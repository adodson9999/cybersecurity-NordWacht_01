import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getServiceRoleClient } from '../_shared/supabase.ts';

serve(async (req) => {
  try {
    const supabase = getServiceRoleClient();
    
    // Find upcoming confirmed bookings in the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const { data: bookings, error } = await supabase
      .from('call_bookings')
      .select(`
        id, slot_start, timezone,
        leads (id, name, email),
        call_types (name)
      `)
      .eq('status', 'confirmed')
      .gte('slot_start', now.toISOString())
      .lte('slot_start', tomorrow.toISOString());

    if (error) throw error;

    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    
    for (const booking of bookings || []) {
      // Check if a reminder was already sent
      const { data: existingLog } = await supabase
        .from('communication_log')
        .select('id')
        .eq('lead_id', booking.leads.id)
        .eq('type', 'email')
        .like('subject', '%Reminder%')
        .gte('created_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle();

      if (!existingLog && brevoApiKey && booking.leads) {
        const formattedTime = new Date(booking.slot_start).toLocaleString('en-US', { timeZone: booking.timezone });
        
        const emailPayload = {
          sender: { name: "Alexander Dodson", email: "noreply@zanderservices.org" },
          to: [{ email: booking.leads.email, name: booking.leads.name }],
          subject: `Reminder: Upcoming ${booking.call_types?.name}`,
          htmlContent: `<p>Hi ${booking.leads.name}, this is a reminder for our meeting tomorrow at ${formattedTime} (${booking.timezone}).</p>`
        };

        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'api-key': brevoApiKey },
          body: JSON.stringify(emailPayload)
        });

        // Log it
        await supabase.from('communication_log').insert({
          lead_id: booking.leads.id,
          type: 'email',
          direction: 'outbound',
          subject: `Reminder: Upcoming ${booking.call_types?.name}`,
          body: `Sent 24h reminder for booking ${booking.id}`
        });
      }
    }

    return new Response(JSON.stringify({ success: true, count: bookings?.length || 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
