import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getServiceRoleClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { name, email, phone, company, message, honeypot } = await req.json();
    
    // 1. Validate honeypot
    if (honeypot) {
      // If the honeypot field is filled out, it's a bot. 
      // Silently return success to avoid giving feedback to the bot.
      return new Response(JSON.stringify({ success: true, message: 'Message received' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (!name || !email || !message) {
      throw new Error('Missing required fields (name, email, message)');
    }

    const supabase = getServiceRoleClient();

    // 2. Insert into contact_submissions
    const { data: submission, error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        phone,
        company,
        message,
        // IP address could be pulled from headers if behind proxy, but Deno req.conn is not accessible here easily
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // 3. Send notification email via Brevo
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const businessEmail = Deno.env.get('SMTP_REPLY_TO') || 'alexander.dodson@zanderservices.org';

    if (brevoApiKey) {
      const emailPayload = {
        sender: { name: "NordWacht System", email: "noreply@zanderservices.org" },
        to: [{ email: businessEmail, name: "Alexander Dodson" }],
        subject: `New Contact Submission from ${name}`,
        htmlContent: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `
      };

      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify(emailPayload)
      });

      if (!emailResponse.ok) {
        console.error('Failed to send email via Brevo:', await emailResponse.text());
        // We do not throw here, as the submission was saved successfully to DB
      }
    } else {
      console.warn('BREVO_API_KEY is not set. Email notification skipped.');
    }

    return new Response(JSON.stringify({ success: true, message: 'Message received successfully' }), {
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
