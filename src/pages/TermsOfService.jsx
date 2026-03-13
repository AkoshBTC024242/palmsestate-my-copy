import { Link } from 'react-router-dom';
import { 
  FileText, Scale, AlertCircle, CheckCircle, 
  ArrowLeft, Shield, Globe, Mail, Phone
} from 'lucide-react';

function TermsOfService() {
  const lastUpdated = "March 15, 2026";

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <CheckCircle className="w-6 h-6" />,
      content: "By accessing or using the Palms Estate website and services, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, please do not use our services."
    },
    {
      title: "Services Description",
      icon: <Globe className="w-6 h-6" />,
      content: "Palms Estate provides luxury real estate services including property listings, rental applications, concierge services, and related offerings. We act as an intermediary between property owners and potential tenants or buyers. While we strive for accuracy, we do not guarantee the completeness or accuracy of property listings."
    },
    {
      title: "User Accounts",
      icon: <Shield className="w-6 h-6" />,
      content: "To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to provide accurate and complete information when creating your account."
    },
    {
      title: "Property Listings",
      icon: <FileText className="w-6 h-6" />,
      content: "Property listings are provided for informational purposes only. While we make reasonable efforts to ensure accuracy, we do not warrant that descriptions, pricing, or availability are error-free. All property information should be independently verified."
    },
    {
      title: "Application Process",
      icon: <AlertCircle className="w-6 h-6" />,
      content: "Submitting a rental application does not guarantee approval. Applications are subject to review by property owners and may require additional documentation, credit checks, and background verification. Application fees, if applicable, are non-refundable."
    },
    {
      title: "Intellectual Property",
      icon: <Scale className="w-6 h-6" />,
      content: "All content on this website, including text, graphics, logos, images, and software, is the property of Palms Estate or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or modify any content without our written consent."
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
            <Scale className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              TERMS OF SERVICE
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-4">
            Our{' '}
            <span className="text-[#F97316] font-medium">Agreement</span>
          </h1>
          <p className="text-[#A1A1AA] text-lg">Last Updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 mb-8">
          <p className="text-[#E4E4E7] leading-relaxed">
            Welcome to Palms Estate. These Terms of Service govern your use of our website, services, and any related applications. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms. Please read them carefully.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
                  <div className="text-[#F97316]">{section.icon}</div>
                </div>
                <h2 className="font-serif text-2xl font-light text-white">{section.title}</h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Limitations */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 mb-8">
          <h2 className="font-serif text-2xl font-light text-white mb-4">Limitation of Liability</h2>
          <p className="text-[#A1A1AA] mb-4">
            To the fullest extent permitted by law, Palms Estate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="space-y-2 text-[#A1A1AA] ml-4">
            <li className="list-disc">Your use or inability to use our services</li>
            <li className="list-disc">Any conduct or content of any third party on our services</li>
            <li className="list-disc">Unauthorized access, use, or alteration of your content</li>
            <li className="list-disc">Any property listings or transactions facilitated through our platform</li>
          </ul>
        </div>

        {/* Governing Law */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 mb-8">
          <h2 className="font-serif text-2xl font-light text-white mb-4">Governing Law</h2>
          <p className="text-[#A1A1AA]">
            These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating to these Terms shall be brought exclusively in the courts of Miami-Dade County, Florida.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 text-center">
          <h2 className="font-serif text-3xl font-light text-white mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-white/90 mb-6">
            If you have any questions about these Terms of Service, please contact our legal department.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@palmsestate.org"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#0A0A0A] transition-colors"
            >
              <Mail className="w-4 h-4" />
              legal@palmsestate.org
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

export default TermsOfService;