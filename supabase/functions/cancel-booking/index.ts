import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getServiceRoleClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { token, reason } = await req.json();
    if (!token) throw new Error('Missing cancellation token');

    const supabase = getServiceRoleClient();

    // 1. Verify token
    const { data: booking, error: fetchError } = await supabase
      .from('call_bookings')
      .select(`
        id, 
        status, 
        tokens_expired,
        slot_start,
        timezone,
        leads (name, email),
        call_types (name)
      `)
      .eq('cancel_token', token)
      .single();

    if (fetchError || !booking) {
      throw new Error('Invalid cancellation token');
    }

    if (booking.tokens_expired) {
      throw new Error('This booking link has expired.');
    }

    if (booking.status === 'cancelled') {
      return new Response(JSON.stringify({ success: true, message: 'Booking is already cancelled.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Update status
    const { error: updateError } = await supabase
      .from('call_bookings')
      .update({ 
        status: 'cancelled', 
        cancel_reason: reason || 'Cancelled by user',
        cancel_datetime: new Date().toISOString(),
        tokens_expired: true
      })
      .eq('id', booking.id);

    if (updateError) throw updateError;

    // 3. Send cancellation email via Brevo
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const businessEmail = Deno.env.get('SMTP_REPLY_TO') || 'alexander.dodson@zanderservices.org';

    if (brevoApiKey) {
      const emailPayload = {
        sender: { name: "Alexander Dodson", email: "noreply@zanderservices.org" },
        to: [{ email: businessEmail, name: "Alexander Dodson" }],
        subject: `Booking Cancelled: ${booking.leads?.name}`,
        htmlContent: `
          <h3>Booking Cancelled</h3>
          <p>${booking.leads?.name} (${booking.leads?.email}) has cancelled their ${booking.call_types?.name}.</p>
          <p><strong>Original Time:</strong> ${new Date(booking.slot_start).toLocaleString('en-US', { timeZone: booking.timezone })} (${booking.timezone})</p>
          <p><strong>Reason:</strong> ${reason || 'Not provided'}</p>
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

    return new Response(JSON.stringify({ success: true, message: 'Booking cancelled successfully.' }), {
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
