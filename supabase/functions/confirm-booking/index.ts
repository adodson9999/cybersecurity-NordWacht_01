import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getServiceRoleClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { token } = await req.json();
    if (!token) throw new Error('Missing confirmation token');

    const supabase = getServiceRoleClient();

    // 1. Verify token
    const { data: booking, error: fetchError } = await supabase
      .from('call_bookings')
      .select('id, status, tokens_expired')
      .eq('confirmation_token', token)
      .single();

    if (fetchError || !booking) {
      throw new Error('Invalid confirmation token');
    }

    if (booking.tokens_expired) {
      throw new Error('This booking link has expired.');
    }

    if (booking.status !== 'scheduled') {
      return new Response(JSON.stringify({ success: true, message: 'Booking is already confirmed or cancelled.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Update status
    const { error: updateError } = await supabase
      .from('call_bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, message: 'Booking confirmed successfully.' }), {
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
