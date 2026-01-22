// src/lib/emailTemplates.js - CORRECTED VERSION
// Use import.meta.glob correctly for Vite

// Method 1: Direct imports for each template (if you want to keep them)
let emailTemplates = {};

// Method 2: Use import.meta.glob properly
const loadTemplates = () => {
  try {
    // Correct way to use import.meta.glob in Vite
    const modules = import.meta.glob('../email/*.html', {
      query: '?raw',
      import: 'default',
      eager: true
    });
    
    const templates = {};
    
    Object.entries(modules).forEach(([path, content]) => {
      // Extract filename without extension
      const filename = path.split('/').pop().replace('.html', '');
      templates[filename] = content;
      console.log(`✅ Loaded template: ${filename}`);
    });
    
    return templates;
  } catch (error) {
    console.error('❌ Error loading email templates:', error);
    return {};
  }
};

// Initialize templates
const templates = loadTemplates();

// Function to process template with data
export function processTemplate(templateName, data) {
  // Try to get template from loaded templates
  const template = templates[templateName];
  
  if (!template) {
    console.error(`❌ Template "${templateName}" not found.`);
    console.log('Available templates:', Object.keys(templates));
    return `<p>Email template "${templateName}" not found</p>`;
  }

  let processed = template;
  
  // Replace all {{ .Placeholder }} with data
  Object.keys(data).forEach(key => {
    const placeholder = `{{ .${key} }}`;
    const value = data[key] || '';
    // Use global replace with regex
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    processed = processed.replace(regex, value);
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
  return Object.keys(templates);
}

// Check if template exists
export function hasTemplate(templateName) {
  return templateName in templates;
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

// Export for debugging
export default {
  processTemplate,
  getAvailableTemplates,
  hasTemplate,
  testTemplateProcessing
};
