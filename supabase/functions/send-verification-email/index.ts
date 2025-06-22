import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, token_hash, type } = await req.json()

    console.log('📧 Processing verification email for:', email)
    console.log('🔑 Token hash:', token_hash)
    console.log('📝 Type:', type)

    // Construct the verification URL with proper parameters
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'
    const verificationUrl = `${frontendUrl}/verify-email?token_hash=${encodeURIComponent(token_hash)}&type=${encodeURIComponent(type)}`

    console.log('🔗 Constructed verification URL:', verificationUrl)

    // Create the email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">Welcome to Makao 👋</h2>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Thank you for signing up! Please click the button below to confirm your email and access your dashboard:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #000000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Confirm Email
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you didn't request this, you can safely ignore it.
        </p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This email was sent by Makao. If you have any questions, please contact our support team.</p>
        </div>
      </div>
    `

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Send the email using Supabase's built-in email service
    // Note: This would typically use a third-party email service like SendGrid, Resend, etc.
    // For now, we'll log the email content and return success
    
    console.log('📧 Email HTML content generated:')
    console.log(emailHtml)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification email processed',
        verificationUrl: verificationUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Error processing verification email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})