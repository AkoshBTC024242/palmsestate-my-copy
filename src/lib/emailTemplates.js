// src/lib/emailTemplates-simple.js
// Simple embedded templates - no file imports

// Application Confirmation Template (embedded)
export const ApplicationConfirmationTemplate = (data) => {
  const {
    ApplicationID = 'APP-N/A',
    PropertyName = 'Property',
    PropertyLocation = 'Location not specified',
    PropertyPrice = 'Contact for pricing',
    ApplicationDate = new Date().toLocaleDateString(),
    ApplicantName = 'Applicant',
    ApplicantEmail = ''
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Confirmation - Palms Estate</title>
    <style>
        body, table, td, div, p, a {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        body {
            background-color: #f8fafc;
            margin: 0;
            padding: 20px 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        @media only screen and (max-width: 620px) {
            .email-container {
                width: 100% !important;
            }
            .content-cell {
                padding: 20px !important;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f8fafc">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="email-container" style="border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
                    <tr>
                        <td bgcolor="#10b981" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 0;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center">
                                        <div style="width: 60px; height: 60px; background-color: white; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                            <span style="font-size: 24px; font-weight: bold; color: #059669;">P</span>
                                        </div>
                                        <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0; font-family: 'Georgia', serif;">
                                            Palms<span style="color: #ffffff;">Estate</span>
                                        </h1>
                                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 12px; letter-spacing: 2px; margin-top: 5px; font-weight: 500;">
                                            APPLICATION CONFIRMATION
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-cell" style="padding: 50px 40px; background-color: #ffffff;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="padding-bottom: 30px;">
                                        <h2 style="color: #1f2937; font-size: 26px; font-weight: bold; margin: 0 0 10px 0; font-family: 'Georgia', serif;">
                                            Application Received!
                                        </h2>
                                        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
                                            Thank you for your interest in our exclusive properties.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 40px;">
                                        <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 4px solid #d1fae5;">
                                            <span style="font-size: 40px; color: #059669;">🏠</span>
                                        </div>
                                        <h3 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 10px 0;">
                                            Application #${ApplicationID}
                                        </h3>
                                        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0; max-width: 450px;">
                                            We've received your application for ${PropertyName} and will review it within 24-48 hours.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td colspan="2" style="padding-bottom: 15px;">
                                                    <h4 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0;">
                                                        Application Details
                                                    </h4>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="50%" valign="top" style="padding-bottom: 10px;">
                                                    <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px 0; font-weight: 500;">
                                                        PROPERTY
                                                    </p>
                                                    <p style="color: #1f2937; font-size: 15px; font-weight: 600; margin: 0;">
                                                        ${PropertyName}
                                                    </p>
                                                </td>
                                                <td width="50%" valign="top" style="padding-bottom: 10px;">
                                                    <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px 0; font-weight: 500;">
                                                        APPLICATION DATE
                                                    </p>
                                                    <p style="color: #1f2937; font-size: 15px; font-weight: 600; margin: 0;">
                                                        ${ApplicationDate}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="50%" valign="top" style="padding-bottom: 10px;">
                                                    <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px 0; font-weight: 500;">
                                                        LOCATION
                                                    </p>
                                                    <p style="color: #1f2937; font-size: 15px; font-weight: 600; margin: 0;">
                                                        ${PropertyLocation}
                                                    </p>
                                                </td>
                                                <td width="50%" valign="top">
                                                    <p style="color: #6b7280; font-size: 13px; margin: 0 0 5px 0; font-weight: 500;">
                                                        PRICE
                                                    </p>
                                                    <p style="color: #1f2937; font-size: 15px; font-weight: 600; margin: 0;">
                                                        ${PropertyPrice}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <a href="https://palmsestate.org/dashboard/applications" 
                                           style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; font-weight: bold; font-size: 16px; padding: 18px 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                                            View Your Application
                                        </a>
                                        <p style="color: #9ca3af; font-size: 13px; margin-top: 15px;">
                                            Track your application status in your dashboard
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #111827; padding: 30px; color: #9ca3af; text-align: center;">
                                        <p style="font-size: 13px; margin: 0 0 10px 0;">
                                            Palms Estate • Exceptional Properties, Exceptional Service
                                        </p>
                                        <p style="font-size: 11px; color: #6b7280; margin: 0; line-height: 1.5;">
                                            This email confirms receipt of your application. Please do not reply to this automated message.
                                            <br>
                                            © 2024 Palms Estate. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

// Simple text version
export const ApplicationConfirmationText = (data) => `
APPLICATION CONFIRMATION - PALMS ESTATE

Application ID: ${data.ApplicationID || 'APP-N/A'}
Property: ${data.PropertyName || 'Property'}
Location: ${data.PropertyLocation || 'Location not specified'}
Price: ${data.PropertyPrice || 'Contact for pricing'}
Application Date: ${data.ApplicationDate || new Date().toLocaleDateString()}
Applicant: ${data.ApplicantName || 'Applicant'}

Thank you for your application! We have received your application and will review it within 24-48 hours.

Next Steps:
1. Initial Review (1-2 business days)
2. Verification Check
3. Decision Notification

View your application status: https://palmsestate.org/dashboard/applications

Questions? Contact: applications@palmsestate.org

© ${new Date().getFullYear()} Palms Estate
`.trim();    return {};
  }
};

// Initialize templates
const templates = loadTemplates();

// Function to process template with data
export function processTemplate(templateName, data) {
  // Try dynamic loading first, fallback to static
  const template = templates[templateName] || emailTemplates[templateName];
  
  if (!template) {
    console.error(`❌ Template "${templateName}" not found.`);
    console.log('Available templates:', Object.keys(templates), Object.keys(emailTemplates));
    return `<p>Email template "${templateName}" not found</p>`;
  }

  let processed = template;
  
  // Replace all {{ .Placeholder }} with data
  Object.keys(data).forEach(key => {
    const placeholder = `{{ .${key} }}`;
    const value = data[key] || '';
    processed = processed.split(placeholder).join(value);
  });
  
  // Clean up any remaining placeholders
  processed = processed.replace(/\{\{ \..*? \}\}/g, '');
  
  // Fix the typo in your template
  if (templateName === 'ApplicationConfirmation') {
    processed = processed.replace('align-items center', 'align-items: center');
  }
  
  return processed;
}

// Get available templates
export function getAvailableTemplates() {
  const allTemplates = { ...templates, ...emailTemplates };
  return Object.keys(allTemplates);
}

// Check if template exists
export function hasTemplate(templateName) {
  return templateName in templates || templateName in emailTemplates;
}

// Test function
export function testTemplateProcessing() {
  const testData = {
    ApplicationID: 'TEST-123',
    PropertyName: 'Test Villa',
    PropertyLocation: 'Test Location',
    PropertyPrice: '$5,000/week',
    ApplicationDate: new Date().toLocaleDateString(),
    ApplicantName: 'Test User',
    ApplicantEmail: 'test@example.com'
  };
  
  const result = processTemplate('ApplicationConfirmation', testData);
  console.log('Template test result (first 100 chars):', result.substring(0, 100));
  return result;
}
