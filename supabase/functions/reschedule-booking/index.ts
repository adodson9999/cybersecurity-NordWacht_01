import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getServiceRoleClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { token, new_slot_start, new_slot_end } = await req.json();
    if (!token || !new_slot_start || !new_slot_end) throw new Error('Missing required fields');

    const supabase = getServiceRoleClient();

    // 1. Verify token
    const { data: oldBooking, error: fetchError } = await supabase
      .from('call_bookings')
      .select(`
        id, 
        lead_id,
        call_type_id,
        timezone,
        prep_notes,
        status, 
        tokens_expired,
        leads (name, email),
        call_types (name)
      `)
      .eq('reschedule_token', token)
      .single();

    if (fetchError || !oldBooking) throw new Error('Invalid reschedule token');
    if (oldBooking.tokens_expired) throw new Error('This booking link has expired.');

    // 2. Generate new tokens
    const confirmationToken = crypto.randomUUID();
    const rescheduleToken = crypto.randomUUID();
    const cancelToken = crypto.randomUUID();

    // 3. Create new booking
    const { data: newBooking, error: bookingError } = await supabase
      .from('call_bookings')
      .insert({
        lead_id: oldBooking.lead_id,
        call_type_id: oldBooking.call_type_id,
        slot_start: new_slot_start,
        slot_end: new_slot_end,
        timezone: oldBooking.timezone,
        prep_notes: oldBooking.prep_notes,
        confirmation_token: confirmationToken,
        reschedule_token: rescheduleToken,
        cancel_token: cancelToken,
        original_booking_id: oldBooking.id,
        status: 'scheduled'
      })
      .select()
      .single();

    if (bookingError) {
      if (bookingError.code === '23505') throw new Error('This time slot is no longer available.');
      throw bookingError;
    }

    // 4. Mark old booking as rescheduled
    await supabase
      .from('call_bookings')
      .update({ status: 'rescheduled', tokens_expired: true })
      .eq('id', oldBooking.id);

    // 5. Send updated email
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const businessEmail = Deno.env.get('SMTP_REPLY_TO') || 'alexander.dodson@zanderservices.org';
    const siteUrl = Deno.env.get('NEXT_PUBLIC_SITE_URL') || 'https://zanderservices.org';

    if (brevoApiKey && oldBooking.leads) {
      const formattedTime = new Date(new_slot_start).toLocaleString('en-US', { timeZone: oldBooking.timezone });
      
      const emailPayload = {
        sender: { name: "Alexander Dodson", email: "noreply@zanderservices.org" },
        to: [{ email: oldBooking.leads.email, name: oldBooking.leads.name }],
        replyTo: { email: businessEmail },
        subject: `Booking Rescheduled: ${oldBooking.call_types?.name}`,
        htmlContent: `
          <h3>Your booking has been rescheduled!</h3>
          <p>Your new time is: <strong>${formattedTime} (${oldBooking.timezone})</strong>.</p>
          <p>I will send you an updated calendar invite shortly.</p>
          <br/>
          <p><a href="${siteUrl}/book/reschedule?token=${rescheduleToken}">Reschedule Again</a></p>
          <p><a href="${siteUrl}/book/cancel?token=${cancelToken}">Cancel Booking</a></p>
        `
      };

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'api-key': brevoApiKey },
        body: JSON.stringify(emailPayload)
      });
    }

    return new Response(JSON.stringify({ success: true, booking_id: newBooking.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
