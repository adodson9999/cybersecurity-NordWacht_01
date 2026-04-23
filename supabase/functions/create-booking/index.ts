import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getServiceRoleClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { name, email, phone, company, call_type_id, slot_start, slot_end, timezone, notes } = await req.json();
    
    if (!name || !email || !call_type_id || !slot_start || !slot_end || !timezone) {
      throw new Error('Missing required fields');
    }

    const supabase = getServiceRoleClient();

    // 1. Find or create lead
    let leadId;
    const { data: existingLead, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingLead) {
      leadId = existingLead.id;
      // Update lead if they provided new info? Optional.
    } else {
      const { data: newLead, error: insertLeadError } = await supabase
        .from('leads')
        .insert({
          name,
          email,
          phone,
          company,
          source: 'booking'
        })
        .select()
        .single();
        
      if (insertLeadError) throw insertLeadError;
      leadId = newLead.id;
    }

    // 2. Generate tokens
    const confirmationToken = crypto.randomUUID();
    const rescheduleToken = crypto.randomUUID();
    const cancelToken = crypto.randomUUID();

    // 3. Create booking
    // Note: The unique constraint on (call_type_id, slot_start) will prevent double booking
    const { data: booking, error: bookingError } = await supabase
      .from('call_bookings')
      .insert({
        lead_id: leadId,
        call_type_id,
        slot_start,
        slot_end,
        timezone,
        prep_notes: notes,
        confirmation_token: confirmationToken,
        reschedule_token: rescheduleToken,
        cancel_token: cancelToken,
        status: 'scheduled'
      })
      .select(`
        *,
        call_types (name)
      `)
      .single();

    if (bookingError) {
      if (bookingError.code === '23505') { // Unique violation
        throw new Error('This time slot was just booked by someone else. Please select another time.');
      }
      throw bookingError;
    }

    // 4. Send confirmation email via Brevo
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const businessEmail = Deno.env.get('SMTP_REPLY_TO') || 'alexander.dodson@zanderservices.org';
    const siteUrl = Deno.env.get('NEXT_PUBLIC_SITE_URL') || 'https://zanderservices.org';

    if (brevoApiKey) {
      const callTypeName = booking.call_types?.name || 'Consultation';
      const formattedTime = new Date(slot_start).toLocaleString('en-US', { timeZone: timezone });
      
      const emailPayload = {
        sender: { name: "Alexander Dodson", email: "noreply@zanderservices.org" },
        to: [{ email: email, name: name }],
        replyTo: { email: businessEmail },
        subject: `Booking Confirmed: ${callTypeName}`,
        htmlContent: `
          <h3>Your booking is confirmed!</h3>
          <p>Hi ${name},</p>
          <p>Your ${callTypeName} is scheduled for <strong>${formattedTime} (${timezone})</strong>.</p>
          <p>I will send you a calendar invite with the meeting link shortly.</p>
          <br/>
          <p>Need to make changes?</p>
          <p><a href="${siteUrl}/book/reschedule?token=${rescheduleToken}">Reschedule Booking</a></p>
          <p><a href="${siteUrl}/book/cancel?token=${cancelToken}">Cancel Booking</a></p>
        `
      };

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify(emailPayload)
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      booking_id: booking.id,
      message: 'Booking created successfully' 
    }), {
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
