// src/lib/emailTemplates.js

// Import email templates (we'll use fetch or require based on your setup)
let emailTemplates = {};

// Try to load templates from the email folder
async function loadEmailTemplates() {
  try {
    // For Vite, we need to use dynamic imports
    const templatesToLoad = [
      'ApplicationConfirmation',
      'PasswordResetEmail', 
      'VerificationEmail'
    ];

    for (const templateName of templatesToLoad) {
      try {
        // This works with Vite's import.meta.glob
        const module = await import(`../email/${templateName}.html?raw`);
        emailTemplates[templateName] = module.default;
        console.log(`✅ Loaded email template: ${templateName}`);
      } catch (err) {
        console.warn(`⚠️ Could not load template ${templateName}:`, err);
      }
    }
  } catch (error) {
    console.error('❌ Error loading email templates:', error);
  }
}

// Initialize templates on module load
loadEmailTemplates();

// Function to process template with data
export function processTemplate(templateName, data) {
  const template = emailTemplates[templateName];
  
  if (!template) {
    console.error(`Template ${templateName} not found`);
    return `<p>Email template not found</p>`;
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
  
  return processed;
}

// Get available templates
export function getAvailableTemplates() {
  return Object.keys(emailTemplates);
}

// Check if template exists
export function hasTemplate(templateName) {
  return templateName in emailTemplates;
}
