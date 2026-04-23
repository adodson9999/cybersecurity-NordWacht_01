import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getServiceRoleClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { token } = await req.json();
    if (!token) throw new Error('Missing token');

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from('call_bookings')
      .select(`
        id,
        status,
        tokens_expired,
        call_types!inner(slug, name, duration_min)
      `)
      .eq('reschedule_token', token)
      .single();

    if (error || !data) throw new Error('Invalid or expired reschedule token');
    if (data.tokens_expired) throw new Error('This booking link has expired.');
    if (data.status === 'rescheduled' || data.status === 'cancelled') throw new Error(`This booking has already been ${data.status}.`);

    return new Response(JSON.stringify({ 
      success: true, 
      call_type: data.call_types 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
