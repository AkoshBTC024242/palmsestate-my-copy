// src/lib/emailTemplates.js - FIXED VERSION
// We'll use a different approach for Vite

// Method 1: Import templates directly (static imports)
import ApplicationConfirmationHTML from '../email/ApplicationConfirmation.html?raw';
import PasswordResetEmailHTML from '../email/PasswordResetEmail.html?raw';
import VerificationEmailHTML from '../email/VerificationEmail.html?raw';

// Store templates
const emailTemplates = {
  ApplicationConfirmation: ApplicationConfirmationHTML,
  PasswordResetEmail: PasswordResetEmailHTML,
  VerificationEmail: VerificationEmailHTML
};

// Or Method 2: Use import.meta.glob with explicit paths
const loadTemplates = () => {
  try {
    // Using Vite's glob import
    const modules = import.meta.glob('../email/*.html', {
      as: 'raw',
      eager: true
    });
    
    const templates = {};
    
    Object.entries(modules).forEach(([path, content]) => {
      // Extract filename without extension
      const filename = path.split('/').pop().replace('.html', '');
      templates[filename] = content;
    });
    
    console.log('✅ Loaded email templates:', Object.keys(templates));
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