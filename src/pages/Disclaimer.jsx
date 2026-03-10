import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Shield, FileText, Scale, Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-orange-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Buffalo </span>
            <span className="text-orange-500" style={{ color: '#FF6600' }}>Disclaimer</span>
          </h1>
          <div className="h-1 w-24 bg-orange-500 mb-6"></div>
          <p className="text-gray-400 text-lg">
            Important legal information and disclosures for Palm Estates
          </p>
        </div>

        {/* REALTOR® Disclaimer Section */}
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 mb-8 border border-gray-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-orange-500 bg-opacity-20 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">REALTOR® Trademark Disclosure</h2>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-orange-500">REALTOR®</strong> is a registered collective membership mark that identifies a real estate professional who is a member of the National Association of REALTORS® and subscribes to its strict Code of Ethics.
              </p>
            </div>
          </div>
          <div className="pl-14 text-gray-400 text-sm space-y-3">
            <p>
              The term REALTOR® is used throughout this website to identify real estate professionals who are members of NAR and/or the quality of services they provide. Palm Estates is committed to upholding the highest standards of professional practice as outlined in the REALTOR® Code of Ethics.
            </p>
            <p>
              For more information about the REALTOR® organization and its Code of Ethics, visit{' '}
              <a 
                href="https://www.nar.realtor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 underline underline-offset-2"
              >
                www.nar.realtor
              </a>
            </p>
          </div>
        </div>

        {/* Equal Housing Opportunity */}
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 mb-8 border border-gray-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
              <Home className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Equal Housing Opportunity</h2>
              <p className="text-gray-300 leading-relaxed">
                Palm Estates is committed to compliance with all federal, state, and local fair housing laws.
              </p>
            </div>
          </div>
          <div className="pl-14 text-gray-400 text-sm space-y-3">
            <p>
              We pledge to provide professional service without regard to race, color, religion, national origin, sex, handicap, familial status, sexual orientation, gender identity, or any other protected class under applicable law.
            </p>
            <p>
              We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing. All property listings and rental opportunities are available on a non-discriminatory basis.
            </p>
            <div className="flex items-center gap-4 mt-4 p-4 bg-gray-800 rounded-lg">
              <svg width="48" height="48" viewBox="0 0 192.756 192.756" className="flex-shrink-0">
                <g fillRule="evenodd" clipRule="evenodd">
                  <path fill="#fff" d="M0 0h192.756v192.756H0V0z"/>
                  <path d="M26.473 148.555h-7.099v2.81h6.52v2.373h-6.52v3.453h7.414v2.375H16.636v-13.378h9.837v2.367zM35.45 155.928l1.342 1.264a3.247 3.247 0 0 1-1.509.357c-1.51 0-3.635-.93-3.635-4.674s2.125-4.674 3.635-4.674c1.509 0 3.632.93 3.632 4.674 0 1.254-.242 2.18-.614 2.873l-1.416-1.322-1.435 1.502zm6.317 3.09l-1.457-1.371c.82-1.045 1.4-2.572 1.4-4.771 0-6.277-4.658-7.039-6.428-7.039-1.769 0-6.425.762-6.425 7.039 0 6.281 4.656 7.041 6.425 7.041.78 0 2.16-.146 3.427-.898l1.586 1.514 1.472-1.515zM54.863 154.889c0 3.516-2.127 5.027-5.499 5.027-1.228 0-3.054-.297-4.246-1.619-.726-.814-1.006-1.904-1.042-3.242v-8.867h2.85v8.678c0 1.869 1.08 2.684 2.382 2.684 1.921 0 2.701-.93 2.701-2.551v-8.811h2.855v8.701h-.001zM62.348 149.207h.041l1.655 5.291H60.63l1.718-5.291zm-2.464 7.594h4.939l.858 2.766h3.037l-4.71-13.379h-3.225l-4.769 13.379h2.943l.927-2.766zM73.692 157.145h6.65v2.421h-9.448v-13.378h2.798v10.957zM90.938 153.562v6.004h-2.79v-13.378h2.79v5.066h5.218v-5.066h2.791v13.378h-2.791v-6.004h-5.218zM104.273 152.875c0-3.744 2.127-4.674 3.631-4.674 1.512 0 3.637.93 3.637 4.674s-2.125 4.674-3.637 4.674c-1.504 0-3.631-.93-3.631-4.674zm-2.791 0c0 6.281 4.66 7.041 6.422 7.041 1.777 0 6.432-.76 6.432-7.041 0-6.277-4.654-7.039-6.432-7.039-1.761 0-6.422.762-6.422 7.039zM127.676 154.889c0 3.516-2.127 5.027-5.5 5.027-1.23 0-3.051-.297-4.248-1.619-.725-.814-1.006-1.904-1.039-3.242v-8.867h2.846v8.678c0 1.869 1.084 2.684 2.391 2.684 1.918 0 2.699-.93 2.699-2.551v-8.811h2.852v8.701h-.001zM132.789 155.445c.025.744.4 2.162 2.838 2.162 1.32 0 2.795-.316 2.795-1.736 0-1.039-1.006-1.322-2.42-1.656l-1.436-.336c-2.168-.502-4.252-.98-4.252-3.924 0-1.492.807-4.119 5.145-4.119 4.102 0 5.199 2.68 5.219 4.32h-2.686c-.072-.592-.297-2.012-2.738-2.012-1.059 0-2.326.391-2.326 1.602 0 1.049.857 1.264 1.41 1.395l3.264.801c1.826.449 3.5 1.195 3.5 3.596 0 4.029-4.096 4.379-5.271 4.379-4.877 0-5.715-2.814-5.715-4.471h2.673v-.001zM146.186 159.566H143.4v-13.378h2.786v13.378zM157.35 146.188h2.605v13.378h-2.791l-5.455-9.543h-.047v9.543h-2.605v-13.378H152l5.303 9.316h.047v-9.316zM169.307 152.355h5.584v7.211h-1.859l-.279-1.676c-.707.812-1.732 2.025-4.174 2.025-3.221 0-6.143-2.309-6.143-7.002 0-3.648 2.031-7.098 6.533-7.078 4.105 0 5.727 2.66 5.867 4.512h-2.791c0-.523-.953-2.203-2.924-2.203-1.998 0-3.84 1.377-3.84 4.803 0 3.654 1.994 4.602 3.893 4.602.615 0 2.67-.238 3.242-2.943h-3.109v-2.251zM18.836 173.197c0-3.744 2.123-4.678 3.63-4.678 1.509 0 3.631.934 3.631 4.678 0 3.742-2.122 4.68-3.631 4.68-1.507 0-3.63-.938-3.63-4.68zm-2.794 0c0 6.275 4.656 7.049 6.425 7.049 1.77 0 6.426-.773 6.426-7.049s-4.657-7.039-6.426-7.039c-1.769 0-6.425.764-6.425 7.039zM36.549 172.748v-3.934h2.217c1.731 0 2.459.545 2.459 1.85 0 .596 0 2.084-2.088 2.084h-2.588zm0 2.314h3.202c3.597 0 4.265-3.059 4.265-4.268 0-2.625-1.561-4.285-4.153-4.285h-6.107v13.379h2.793v-4.826zM51.599 172.748v-3.934h2.213c1.733 0 2.46.545 2.46 1.85 0 .596 0 2.084-2.083 2.084h-2.59zm0 2.314h3.204c3.594 0 4.267-3.059 4.267-4.268 0-2.625-1.563-4.285-4.153-4.285h-6.113v13.379h2.795v-4.826zM66.057 173.197c0-3.744 2.118-4.678 3.633-4.678 1.502 0 3.63.934 3.63 4.678 0 3.742-2.127 4.68-3.63 4.68-1.515 0-3.633-.938-3.633-4.68zm-2.795 0c0 6.275 4.655 7.049 6.428 7.049 1.765 0 6.421-.773 6.421-7.049s-4.656-7.039-6.421-7.039c-1.773 0-6.428.764-6.428 7.039zM83.717 172.396v-3.582h3.479c1.64 0 1.954 1.049 1.954 1.756 0 1.324-.705 1.826-2.159 1.826h-3.274zm-2.746 7.493h2.746v-5.236h2.882c2.07 0 2.184.705 2.184 2.531 0 1.375.105 2.064.292 2.705h3.095v-.361c-.596-.221-.596-.707-.596-2.656 0-2.504-.596-2.91-1.694-3.396 1.322-.443 2.064-1.713 2.064-3.182 0-1.158-.648-3.783-4.207-3.783H80.97v13.378h.001zM102.355 179.889h-2.793v-11.012h-4.04v-2.367H106.4v2.367h-4.045v11.012zM121.395 175.207c0 3.52-2.123 5.039-5.498 5.039-1.223 0-3.049-.311-4.244-1.631-.727-.816-1.006-1.898-1.039-3.238v-8.867h2.846v8.678c0 1.863 1.082 2.689 2.385 2.689 1.918 0 2.699-.938 2.699-2.557v-8.811h2.852v8.698h-.001zM134.916 166.51h2.613v13.379h-2.8l-5.459-9.543h-.03v9.543h-2.613V166.51h2.943l5.313 9.312h.033v-9.312zM145.412 179.889h-2.803V166.51h2.803v13.379zM156.32 179.889h-2.793v-11.012h-4.035v-2.367h10.873v2.367h-4.045v11.012zM170.928 179.889h-2.799v-5.051l-4.615-8.328h3.295l2.775 5.814 2.652-5.814h3.162l-4.47 8.361v5.018zM95.706 6.842L5.645 51.199v20.836h10.08v62.502h159.284V72.035h12.104V51.199L95.706 6.842zm59.815 108.871H35.216V58.592l60.49-30.914 59.816 30.914v57.121h-.001z" fill="#000"/>
                  <path d="M123.256 78.75H67.479V58.592h55.777V78.75zM123.256 107.662H67.479V87.491h55.777v20.171z" fill="#000"/>
                </g>
              </svg>
              <span className="text-gray-300">Equal Housing Opportunity</span>
            </div>
          </div>
        </div>

        {/* Website Information */}
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 mb-8 border border-gray-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Website Information & Accuracy</h2>
            </div>
          </div>
          <div className="pl-14 text-gray-400 text-sm space-y-3">
            <p>
              The information contained on this website is for general informational purposes only. While Palm Estates endeavors to keep the information up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
            </p>
            <p>
              Property listings, pricing, and availability are subject to change without notice. All property information is deemed reliable but not guaranteed and should be independently verified.
            </p>
          </div>
        </div>

        {/* Legal Terms */}
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 mb-8 border border-gray-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
              <Scale className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Legal Terms & Conditions</h2>
            </div>
          </div>
          <div className="pl-14 text-gray-400 text-sm space-y-3">
            <p>
              By using this website, you agree to the terms and conditions set forth herein. Palm Estates reserves the right to modify these terms at any time without prior notice.
            </p>
            <p>
              All content, logos, and branding on this site are the property of Palm Estates unless otherwise noted. Unauthorized use or reproduction is prohibited.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">Office Address</p>
                <p className="text-gray-400 text-sm">Palm Estates<br />Buffalo, New York 14201</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">Phone</p>
                <p className="text-gray-400 text-sm">+1 (828) 623-9765</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">Email</p>
                <p className="text-gray-400 text-sm">admin@palmsestate.org</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">Last Updated</p>
                <p className="text-gray-400 text-sm">March 10, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to top link */}
        <div className="text-center mt-10">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors"
          >
            Back to Top
            <ArrowLeft className="w-4 h-4 ml-2 rotate-90" />
          </a>
        </div>
      </div>
    </div>
  );
}