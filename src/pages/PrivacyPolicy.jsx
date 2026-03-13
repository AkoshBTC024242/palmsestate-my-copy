import { Link } from 'react-router-dom';
import { 
  Shield, Lock, Eye, FileText, CheckCircle, 
  ArrowLeft, Globe, Database, Mail, Phone
} from 'lucide-react';

function PrivacyPolicy() {
  const lastUpdated = "March 15, 2026";

  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="w-6 h-6" />,
      content: "We collect information you provide directly to us, such as when you create an account, submit a contact form, apply for a property, or communicate with us. This may include:",
      items: [
        "Name, email address, phone number, and postal address",
        "Financial information for rental applications and transactions",
        "Identification documents for verification purposes",
        "Property preferences and search history",
        "Communications with our concierge team"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="w-6 h-6" />,
      content: "We use the information we collect to:",
      items: [
        "Process your property inquiries and applications",
        "Provide, maintain, and improve our services",
        "Communicate with you about properties and services",
        "Personalize your experience on our website",
        "Verify your identity and prevent fraud",
        "Comply with legal obligations"
      ]
    },
    {
      title: "Information Sharing",
      icon: <Globe className="w-6 h-6" />,
      content: "We may share your information with:",
      items: [
        "Property owners and managers for rental applications",
        "Service providers who assist in our operations",
        "Legal and financial advisors when necessary",
        "Law enforcement when required by law",
        "With your consent, to other third parties"
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="w-6 h-6" />,
      content: "We implement industry-standard security measures to protect your personal information, including:",
      items: [
        "Encryption of sensitive data in transit and at rest",
        "Regular security assessments and monitoring",
        "Strict access controls for our team members",
        "Secure document storage and handling procedures"
      ]
    },
    {
      title: "Your Rights",
      icon: <CheckCircle className="w-6 h-6" />,
      content: "Depending on your location, you may have the right to:",
      items: [
        "Access the personal information we hold about you",
        "Correct inaccurate or incomplete information",
        "Request deletion of your personal information",
        "Opt out of marketing communications",
        "Withdraw consent at any time"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-[#A1A1AA] hover:text-[#F97316] transition-colors gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Shield className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              PRIVACY POLICY
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-4">
            Your Privacy{' '}
            <span className="text-[#F97316] font-medium">Matters</span>
          </h1>
          <p className="text-[#A1A1AA] text-lg">Last Updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 mb-8">
          <p className="text-[#E4E4E7] leading-relaxed">
            At Palms Estate, we are committed to protecting your privacy and maintaining the confidentiality of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully. By accessing or using our services, you consent to the practices described in this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
                  <div className="text-[#F97316]">{section.icon}</div>
                </div>
                <h2 className="font-serif text-2xl font-light text-white">{section.title}</h2>
              </div>
              <p className="text-[#A1A1AA] mb-4">{section.content}</p>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#A1A1AA]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cookies Section */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 mb-8">
          <h2 className="font-serif text-2xl font-light text-white mb-4 flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#F97316]" />
            Cookie Policy
          </h2>
          <p className="text-[#A1A1AA] mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:
          </p>
          <ul className="space-y-2 text-[#A1A1AA] ml-4">
            <li className="list-disc">Remember your preferences and settings</li>
            <li className="list-disc">Understand how you interact with our website</li>
            <li className="list-disc">Improve our services and user experience</li>
            <li className="list-disc">Provide personalized content and recommendations</li>
          </ul>
          <p className="text-[#A1A1AA] mt-4">
            You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Privacy Questions?
          </h2>
          <p className="text-white/90 mb-6">
            If you have any questions about this Privacy Policy or how we handle your data, please contact our Data Protection Officer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@palmsestate.org"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#0A0A0A] transition-colors"
            >
              <Mail className="w-4 h-4" />
              privacy@palmsestate.org
            </a>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +1 (828) 623-9765
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;