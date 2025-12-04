// Professional Email Templates for Palms Estate

export const getApplicationReceivedEmail = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 48px 32px; text-align: center; position: relative; overflow: hidden; }
    .header::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); }
    .header-content { position: relative; z-index: 1; }
    .logo { font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 12px; letter-spacing: -0.5px; }
    .header-title { font-size: 32px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
    .header-subtitle { font-size: 16px; color: rgba(255,255,255,0.9); }
    .content { padding: 48px 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 24px; }
    .text { font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 24px; }
    .tracking-card { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 16px; padding: 32px; text-align: center; margin: 32px 0; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3); }
    .tracking-label { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.8); font-weight: 600; margin-bottom: 16px; }
    .tracking-code { background: rgba(255,255,255,0.95); color: #1e293b; font-size: 32px; font-weight: 800; padding: 20px 32px; border-radius: 12px; margin: 20px 0; letter-spacing: 4px; font-family: 'Courier New', monospace; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .btn { display: inline-block; background: #ffffff; color: #3b82f6; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s; }
    .info-card { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 24px; border-radius: 12px; margin: 32px 0; }
    .info-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
    .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #64748b; min-width: 140px; }
    .info-value { color: #1e293b; font-weight: 500; }
    .steps-card { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 28px; margin: 32px 0; }
    .steps-title { font-size: 18px; font-weight: 700; color: #78350f; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    .steps-list { list-style: none; counter-reset: step; }
    .steps-list li { counter-increment: step; position: relative; padding-left: 48px; margin-bottom: 16px; color: #92400e; line-height: 1.6; }
    .steps-list li::before { content: counter(step); position: absolute; left: 0; top: 0; width: 32px; height: 32px; background: #f59e0b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .contact-card { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 28px; text-align: center; margin: 32px 0; }
    .contact-title { font-size: 18px; font-weight: 700; color: #065f46; margin-bottom: 16px; }
    .contact-info { color: #047857; margin: 8px 0; font-size: 15px; }
    .contact-link { color: #059669; text-decoration: none; font-weight: 600; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 40px 0; }
    .footer { background: #1e293b; color: #ffffff; padding: 40px 32px; text-align: center; }
    .footer-logo { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
    .footer-text { color: #cbd5e1; font-size: 14px; margin: 4px 0; }
    .footer-link { color: #60a5fa; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="header-content">
        <div class="logo">🏠 PALMS ESTATE</div>
        <h1 class="header-title">Application Received</h1>
        <p class="header-subtitle">Your journey to finding home begins here</p>
      </div>
    </div>
    
    <div class="content">
      <p class="greeting">Dear ${data.fullName},</p>
      
      <p class="text">
        Thank you for choosing Palms Estate! We've successfully received your rental application for <strong>${data.apartmentTitle}</strong>. Our dedicated team will review your application with care and respond within <strong>24-48 hours</strong>.
      </p>

      <div class="tracking-card">
        <div class="tracking-label">🔍 Your Application Tracking Number</div>
        <div class="tracking-code">${data.trackingNumber}</div>
        <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 12px;">Save this number to track your application status anytime</p>
        <a href="${data.trackingUrl}" class="btn">Track Application Status</a>
      </div>

      <div class="info-card">
        <div class="info-title">📋 Application Summary</div>
        <div class="info-row">
          <span class="info-label">Property</span>
          <span class="info-value">${data.apartmentTitle}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Location</span>
          <span class="info-value">${data.location}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Monthly Rent</span>
          <span class="info-value" style="color: #059669; font-weight: 700;">$${data.rent}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Move-in Date</span>
          <span class="info-value">${data.moveInDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Submitted</span>
          <span class="info-value">${data.submittedDate}</span>
        </div>
      </div>

      <div class="steps-card">
        <div class="steps-title">
          <span>📋</span>
          <span>What Happens Next?</span>
        </div>
        <ul class="steps-list">
          <li><strong>Application Review:</strong> Our team carefully reviews your application and supporting documents</li>
          <li><strong>Status Updates:</strong> You'll receive email notifications as your application progresses</li>
          <li><strong>Background Check:</strong> We'll conduct necessary verifications with your consent</li>
          <li><strong>Additional Info:</strong> We may contact you for any additional details needed</li>
          <li><strong>Property Tour:</strong> We can arrange a viewing if you haven't visited yet</li>
          <li><strong>Lease Agreement:</strong> Once approved, we'll send the lease for your digital signature</li>
        </ul>
      </div>

      <div class="divider"></div>

      <div class="contact-card">
        <div class="contact-title">💬 Need Assistance?</div>
        <p style="color: #065f46; margin-bottom: 16px;">Our team is here to help you every step of the way</p>
        <div class="contact-info">📞 Phone: <a href="tel:8286239765" class="contact-link">(828) 623-9765</a></div>
        <div class="contact-info">✉️ Email: <a href="mailto:devbreed@hotmail.com" class="contact-link">devbreed@hotmail.com</a></div>
        <p style="color: #047857; font-size: 13px; margin-top: 16px;">Business Hours: Mon-Fri 9AM-6PM | Sat 10AM-4PM</p>
      </div>

      <p class="text" style="text-align: center; color: #64748b; font-size: 14px;">
        Thank you for choosing Palms Estate for your housing needs!
      </p>
    </div>

    <div class="footer">
      <div class="footer-logo">PALMS ESTATE</div>
      <p class="footer-text">Premium Property Management & Rentals</p>
      <p class="footer-text" style="margin-top: 16px;">© ${new Date().getFullYear()} Palms Estate. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const getApplicationFeeEmail = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); padding: 48px 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
    .header-title { font-size: 32px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
    .content { padding: 48px 32px; }
    .text { font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 24px; }
    .fee-card { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 3px solid #3b82f6; border-radius: 16px; padding: 32px; text-align: center; margin: 32px 0; }
    .fee-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #1e40af; font-weight: 600; }
    .fee-amount { font-size: 56px; font-weight: 800; color: #1e3a8a; margin: 16px 0; }
    .payment-method-card { background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 28px; margin: 24px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .method-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
    .payment-detail { background: #f8fafc; padding: 16px 20px; border-radius: 8px; margin: 12px 0; font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; color: #1e293b; border: 2px solid #e2e8f0; }
    .steps-card { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 28px; margin: 32px 0; }
    .steps-title { font-size: 18px; font-weight: 700; color: #78350f; margin-bottom: 20px; }
    .steps-list { list-style: none; counter-reset: step; }
    .steps-list li { counter-increment: step; position: relative; padding-left: 48px; margin-bottom: 16px; color: #92400e; }
    .steps-list li::before { content: counter(step); position: absolute; left: 0; width: 32px; height: 32px; background: #f59e0b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .footer { background: #1e293b; color: #ffffff; padding: 40px 32px; text-align: center; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="logo">🏠 PALMS ESTATE</div>
      <h1 class="header-title">Application Fee</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 16px;">Payment Instructions Inside</p>
    </div>
    
    <div class="content">
      <p class="text">
        Hello! To proceed with your rental application for <strong>${data.apartmentTitle}</strong>, please complete the application fee payment using the details below.
      </p>

      <div class="fee-card">
        <div class="fee-label">Application Fee</div>
        <div class="fee-amount">$${data.amount}</div>
        <p style="color: #1e40af; font-size: 14px;">One-time payment</p>
      </div>

      <div class="payment-method-card">
        <div class="method-title">
          <span>${data.method === 'zelle' ? '💳' : '💚'}</span>
          <span>${data.method === 'zelle' ? 'Zelle Payment' : 'Chime Payment'}</span>
        </div>
        ${data.method === 'zelle' ? `
          <div class="payment-detail">📧 devbreed@hotmail.com</div>
          <div class="payment-detail">👤 Palms Estate</div>
        ` : `
          <div class="payment-detail">$PalmsEstate</div>
        `}
      </div>

      <div class="steps-card">
        <div class="steps-title">📋 Next Steps</div>
        <ul class="steps-list">
          <li>Send <strong>$${data.amount}</strong> using the payment details above</li>
          <li>Take a screenshot of your payment confirmation</li>
          <li>Return to our website and upload the screenshot</li>
          <li>Wait for admin verification (usually within 24 hours)</li>
          <li>You'll receive a confirmation email once verified</li>
        </ul>
      </div>

      <p class="text" style="text-align: center;">
        <strong>Need help?</strong><br>
        📞 (828) 623-9765 | ✉️ devbreed@hotmail.com
      </p>
    </div>

    <div class="footer">
      <div style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">PALMS ESTATE</div>
      <p style="color: #cbd5e1; font-size: 14px;">© ${new Date().getFullYear()} Palms Estate. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;