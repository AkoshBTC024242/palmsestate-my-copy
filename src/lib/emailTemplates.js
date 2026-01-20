// src/lib/emailTemplates.js - UPDATED FOR VITE
// Using Vite's import.meta.glob for dynamic imports

let emailTemplates = {};

// Load all HTML files from the email folder
const emailModules = import.meta.glob('../email/*.html', {
  as: 'raw',
  eager: true
});

// Process loaded templates
Object.entries(emailModules).forEach(([path, content]) => {
  const fileName = path.split('/').pop().replace('.html', '');
  emailTemplates[fileName] = content;
  console.log(`✅ Loaded email template: ${fileName}`);
});

// Function to process template with data
export function processTemplate(templateName, data) {
  const template = emailTemplates[templateName];
  
  if (!template) {
    console.error(`❌ Template "${templateName}" not found. Available:`, Object.keys(emailTemplates));
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
  
  // Optional: Add missing styles or fix common issues
  if (templateName === 'ApplicationConfirmation') {
    // Fix the typo in your template
    processed = processed.replace('align-items center', 'align-items: center');
  }
  
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

// Optional: Preload specific template
export async function preloadTemplate(templateName) {
  if (!hasTemplate(templateName)) {
    try {
      const module = await import(`../email/${templateName}.html?raw`);
      emailTemplates[templateName] = module.default;
      console.log(`✅ Lazy loaded template: ${templateName}`);
    } catch (error) {
      console.error(`❌ Failed to load template ${templateName}:`, error);
      return null;
    }
  }
  return emailTemplates[templateName];
}
