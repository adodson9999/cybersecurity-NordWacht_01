import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getServiceRoleClient } from '../_shared/supabase.ts';
import { 
  addMinutes, 
  parseISO, 
  isBefore, 
  isAfter, 
  startOfDay, 
  endOfDay, 
  addDays, 
  format, 
  isSameDay 
} from 'npm:date-fns@2.30.0';
import { utcToZonedTime, zonedTimeToUtc } from 'npm:date-fns-tz@2.0.0';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { call_type, start_date, end_date, timezone } = await req.json();

    if (!call_type || !start_date || !end_date || !timezone) {
      throw new Error('Missing required fields: call_type, start_date, end_date, timezone');
    }

    const supabase = getServiceRoleClient();

    // 1. Get call type details
    const { data: callTypeData, error: callTypeError } = await supabase
      .from('call_types')
      .select('*')
      .eq('slug', call_type)
      .single();

    if (callTypeError || !callTypeData) {
      throw new Error('Call type not found');
    }

    const duration = callTypeData.duration_min || 30;
    const bufferBefore = callTypeData.buffer_before_min || 0;
    const bufferAfter = callTypeData.buffer_after_min || 0;

    // 2. Get availability rules
    const { data: rules, error: rulesError } = await supabase
      .from('availability_rules')
      .select('*');

    // 3. Get existing bookings
    // We pad the search window to account for timezone differences
    const searchStart = new Date(start_date).toISOString();
    const searchEnd = endOfDay(parseISO(end_date)).toISOString();

    const { data: bookings, error: bookingsError } = await supabase
      .from('call_bookings')
      .select('slot_start, slot_end')
      .neq('status', 'cancelled')
      .neq('status', 'rescheduled')
      .gte('slot_end', searchStart)
      .lte('slot_start', searchEnd);

    // 4. Get exceptions
    const { data: exceptions, error: exceptionsError } = await supabase
      .from('availability_exceptions')
      .select('*')
      .gte('date_end', start_date)
      .lte('date_start', end_date);

    // 5. Generate slots
    const availableSlots = [];
    const intervalMinutes = 30; // Generate a slot every 30 mins
    
    let currentDate = parseISO(start_date);
    const finalDate = parseISO(end_date);
    const now = new Date();
    // Add 24h lead time for bookings
    const minBookingTime = addMinutes(now, 24 * 60); 

    while (isBefore(currentDate, finalDate) || isSameDay(currentDate, finalDate)) {
      const dayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
      
      // Find rule for this day
      const dayRule = rules?.find(r => r.day_of_week === dayOfWeek);
      
      if (dayRule) {
        // dayRule.start_time is like "09:00:00"
        const [startHour, startMin] = dayRule.start_time.split(':').map(Number);
        const [endHour, endMin] = dayRule.end_time.split(':').map(Number);
        
        let slotCandidate = new Date(currentDate);
        slotCandidate.setHours(startHour, startMin, 0, 0);
        
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(endHour, endMin, 0, 0);

        while (isBefore(addMinutes(slotCandidate, duration), dayEnd) || addMinutes(slotCandidate, duration).getTime() === dayEnd.getTime()) {
          const slotStart = new Date(slotCandidate);
          const slotEnd = addMinutes(slotStart, duration);
          const slotStartPadded = addMinutes(slotStart, -bufferBefore);
          const slotEndPadded = addMinutes(slotEnd, bufferAfter);

          // Check if slot is in the past or within lead time
          if (isAfter(slotStart, minBookingTime)) {
            
            // Check against existing bookings
            let hasOverlap = false;
            if (bookings) {
              for (const booking of bookings) {
                const bStart = parseISO(booking.slot_start);
                const bEnd = parseISO(booking.slot_end);
                
                // If padded slot overlaps with booking
                if (isBefore(slotStartPadded, bEnd) && isAfter(slotEndPadded, bStart)) {
                  hasOverlap = true;
                  break;
                }
              }
            }

            // Check against exceptions (blocks)
            if (!hasOverlap && exceptions) {
              const dateString = format(slotStart, 'yyyy-MM-dd');
              const exception = exceptions.find(e => 
                e.type === 'block' && 
                e.date_start <= dateString && 
                e.date_end >= dateString
              );
              
              if (exception) {
                if (!exception.start_time && !exception.end_time) {
                  // Full day block
                  hasOverlap = true;
                } else if (exception.start_time && exception.end_time) {
                  // Partial day block
                  const [exStartH, exStartM] = exception.start_time.split(':').map(Number);
                  const [exEndH, exEndM] = exception.end_time.split(':').map(Number);
                  
                  const exStart = new Date(currentDate);
                  exStart.setHours(exStartH, exStartM, 0, 0);
                  
                  const exEnd = new Date(currentDate);
                  exEnd.setHours(exEndH, exEndM, 0, 0);

                  if (isBefore(slotStart, exEnd) && isAfter(slotEnd, exStart)) {
                    hasOverlap = true;
                  }
                }
              }
            }

            if (!hasOverlap) {
              availableSlots.push({
                start: slotStart.toISOString(),
                end: slotEnd.toISOString()
              });
            }
          }
          
          // Increment candidate by interval
          slotCandidate = addMinutes(slotCandidate, intervalMinutes);
        }
      }
      
      currentDate = addDays(currentDate, 1);
    }

    return new Response(JSON.stringify({ slots: availableSlots }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
