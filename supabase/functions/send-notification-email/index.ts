import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "meeting" | "inquiry";
  name: string;
  email: string;
  company?: string;
  topic?: string;
  message?: string;
  role_title?: string;
  meeting_date?: string;
  meeting_time?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();
    console.log("Received notification request:", data);

    // Note: Until domain is verified at resend.com/domains, emails can only be sent to the account owner
    // After domain verification, change this to: ["Anupama.S@canopi.ai", "rameshwar@canopi.ai"]
    const recipientEmails = ["rameshwar@thecanopi.ai"];
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    let subject: string;
    let htmlContent: string;

    if (data.type === "meeting") {
      subject = `New Meeting Request from ${data.name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">🗓️ New Meeting Request</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
            ${data.meeting_date ? `<p><strong>Date:</strong> ${data.meeting_date}</p>` : ""}
            ${data.meeting_time ? `<p><strong>Time:</strong> ${data.meeting_time}</p>` : ""}
            ${data.topic ? `<p><strong>Topic:</strong> ${data.topic}</p>` : ""}
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Please respond to this meeting request within 30 minutes as promised on the website.
          </p>
        </div>
      `;
    } else {
      subject = `New Inquiry from ${data.name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">📩 New Contact Inquiry</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
            ${data.role_title ? `<p><strong>Role/Title:</strong> ${data.role_title}</p>` : ""}
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Please respond to this inquiry promptly.
          </p>
        </div>
      `;
    }

    console.log("Sending email to:", recipientEmails);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Canopi Notifications <onboarding@resend.dev>",
        to: recipientEmails,
        subject: subject,
        html: htmlContent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);