import { useState, useEffect, useRef } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle, 
  MessageSquare, User, Mail as MailIcon, Calendar,
  Shield, Star, Users, Globe, ArrowRight, X,
  Award, Briefcase, Building2, Key, Heart, Zap,
  Upload, FileText, Download, Paperclip, Mic,
  Video, Smile, MoreVertical, Search, Filter,
  HelpCircle, AlertCircle, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

function Contact() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    serviceType: '',
    preferredDate: '',
    message: '',
    subscribe: true,
    userId: user?.id || null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [activeTab, setActiveTab] = useState('contact');
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [supportOnline, setSupportOnline] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const serviceTypes = [
    'Luxury Villa Rental',
    'Penthouse Leasing',
    'Private Island Booking',
    'Yacht & Estate Management',
    'Concierge Services',
    'Private Aviation',
    'Investment Consultation',
    'Property Sales & Acquisitions',
    'Portfolio Management',
    'Emergency Support',
    'Technical Support',
    'General Inquiry'
  ];

  // Load chat history for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      loadChatHistory();
      subscribeToChat();
    }
  }, [isAuthenticated, user]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data) {
        setChatMessages(data);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const subscribeToChat = () => {
    const subscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `user_id=eq.${user.id}`
        }, 
        payload => {
          setChatMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting form data:', formData);

      // 1. Save to Supabase with user ID if authenticated
      const { data: insertData, error: supabaseError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            service_type: formData.serviceType,
            preferred_date: formData.preferredDate || null,
            message: formData.message,
            subscribe: formData.subscribe,
            status: 'new',
            user_id: user?.id || null,
            is_authenticated: isAuthenticated || false
          }
        ])
        .select();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      console.log('Form saved to Supabase successfully');

      // Store submitted data for confirmation
      setSubmittedData({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        serviceType: formData.serviceType,
        preferredDate: formData.preferredDate,
        message: formData.message,
        ticketId: insertData[0]?.id || 'PALM-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });

      // 2. Send notification to admin via Edge Function
      try {
        const emailResponse = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/send-contact-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            formData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              serviceType: formData.serviceType,
              preferredDate: formData.preferredDate,
              message: formData.message,
              subscribe: formData.subscribe,
              userId: user?.id || null,
              isAuthenticated: isAuthenticated || false
            } 
          }),
        });

        const emailData = await emailResponse.json();
        console.log('Admin notification response:', emailData);
      } catch (emailErr) {
        console.error('Admin notification failed (form still saved):', emailErr);
      }

      // 3. Send confirmation email to user
      try {
        const userEmailResponse = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/send-user-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              serviceType: formData.serviceType,
              preferredDate: formData.preferredDate,
              message: formData.message,
              ticketId: submittedData?.ticketId
            } 
          }),
        });

        const userEmailData = await userEmailResponse.json();
        console.log('User confirmation email response:', userEmailData);
      } catch (userEmailErr) {
        console.error('User confirmation email failed:', userEmailErr);
      }

      // Success!
      setIsSubmitted(true);
      
      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setSubmittedData(null);
      }, 10000);

    } catch (err) {
      console.error('Form submission error:', err);
      setError(`There was an error submitting your form: ${err.message}. Please try again or call us directly.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDismissSuccess = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    // Reset form but keep user data if authenticated
    setFormData({
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
      serviceType: '',
      preferredDate: '',
      message: '',
      subscribe: true,
      userId: user?.id || null
    });
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim() || !isAuthenticated) return;

    setChatLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: user.id,
            message: newMessage,
            sender: 'user',
            read: false,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      setNewMessage('');
      
      // Simulate auto-reply or trigger support notification
      setTimeout(() => {
        sendAutoReply();
      }, 2000);

    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const sendAutoReply = async () => {
    if (!isAuthenticated) return;

    try {
      await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: user.id,
            message: "Thank you for your message. A luxury concierge will respond shortly. In the meantime, how can I assist you further?",
            sender: 'support',
            read: false,
            created_at: new Date().toISOString()
          }
        ]);
    } catch (err) {
      console.error('Error sending auto-reply:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user?.id || 'anonymous'}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('contact-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('contact-documents')
          .getPublicUrl(filePath);

        setDocuments(prev => [...prev, {
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type
        }]);

        // If authenticated, save document reference to database
        if (isAuthenticated && user) {
          await supabase
            .from('user_documents')
            .insert([
              {
                user_id: user.id,
                file_name: file.name,
                file_url: publicUrl,
                file_size: file.size,
                file_type: file.type
              }
            ]);
        }
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Briefcase className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm md:text-base uppercase">
              {isAuthenticated ? 'PRIVATE CLIENT PORTAL' : 'PREMIUM CONCIERGE'}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            {isAuthenticated ? (
              <>Welcome Back,{' '}
              <span className="text-[#F97316] font-medium">{user?.user_metadata?.first_name || 'Valued Client'}</span>
            </>
            ) : (
              <>Connect With{' '}
              <span className="text-[#F97316] font-medium">Excellence</span>
            </>
          )}
          </h1>
          <p className="font-sans text-lg md:text-xl lg:text-2xl text-[#A1A1AA] max-w-3xl mx-auto leading-relaxed">
            {isAuthenticated ? (
              'Access your dedicated support channel, upload documents, and chat directly with your luxury concierge.'
            ) : (
              'Your journey to exceptional living begins with a conversation. Sign in for priority support or continue as a guest.'
            )}
          </p>
          {!isAuthenticated && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-full hover:bg-[#EA580C] transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In for Priority Support
              </Link>
              <span className="text-[#A1A1AA]">or</span>
              <button
                onClick={() => setActiveTab('contact')}
                className="text-[#F97316] hover:underline"
              >
                Continue as Guest
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs for Authenticated Users */}
        {isAuthenticated && (
          <div className="flex flex-wrap gap-2 mb-8 border-b border-[#27272A] pb-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'chat'
                  ? 'bg-[#F97316] text-white'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Live Chat
              {supportOnline && (
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'documents'
                  ? 'bg-[#F97316] text-white'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10'
              }`}
            >
              <FileText className="w-5 h-5" />
              Documents
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'contact'
                  ? 'bg-[#F97316] text-white'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10'
              }`}
            >
              <Mail className="w-5 h-5" />
              New Inquiry
            </button>
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 transition-all duration-300 ml-auto"
            >
              <Clock className="w-5 h-5" />
              History
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Information (Always Visible) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Card */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-light text-white mb-8">
                {isAuthenticated ? 'Your Concierge' : 'Contact Information'}
              </h3>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#F97316]/10 rounded-xl">
                    <Phone className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-white mb-1">24/7 Concierge</h4>
                    <a 
                      href="tel:+18286239765" 
                      className="font-sans text-[#F97316] hover:text-[#F97316]/80 transition-colors text-lg"
                    >
                      +1 (828) 623-9765
                    </a>
                    <p className="font-sans text-[#A1A1AA] text-sm mt-1">Available around the clock</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#F97316]/10 rounded-xl">
                    <MailIcon className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-white mb-1">Email</h4>
                    <a 
                      href="mailto:concierge@palmsestate.org" 
                      className="font-sans text-[#F97316] hover:text-[#F97316]/80 transition-colors"
                    >
                      concierge@palmsestate.org
                    </a>
                    <p className="font-sans text-[#A1A1AA] text-sm mt-1">Response within 2 hours</p>
                  </div>
                </div>

                {/* Global Offices */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#F97316]/10 rounded-xl">
                    <Globe className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-white mb-1">Global Offices</h4>
                    <div className="font-sans text-[#A1A1AA]">
                      <p className="mb-1">• Miami: Luxury District</p>
                      <p className="mb-1">• New York: Upper East Side</p>
                      <p className="mb-1">• London: Mayfair</p>
                      <p className="mb-1">• Dubai: Downtown</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-[#27272A]"></div>

              {/* Service Hours */}
              <div>
                <h4 className="font-sans font-medium text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#F97316]" />
                  Service Hours
                </h4>
                <div className="space-y-2 font-sans text-[#A1A1AA]">
                  <div className="flex justify-between">
                    <span>Concierge:</span>
                    <span className="font-medium text-white">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Office Hours:</span>
                    <span className="font-medium text-white">8 AM - 8 PM (Local)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency:</span>
                    <span className="font-medium text-[#F97316]">Always Available</span>
                  </div>
                </div>
              </div>

              {/* Support Status for Auth Users */}
              {isAuthenticated && (
                <div className="mt-6 p-4 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Support Status</span>
                    <span className="flex items-center gap-1 text-sm">
                      <span className={`w-2 h-2 rounded-full ${supportOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                      <span className={supportOnline ? 'text-green-500' : 'text-gray-400'}>
                        {supportOnline ? 'Online' : 'Away'}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA]">
                    Average response: <span className="text-white">2 minutes</span>
                  </p>
                </div>
              )}
            </div>

            {/* Services Overview Card */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-light text-white mb-6">Our Services</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <Key className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white text-sm">Luxury Rentals & Sales</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <Building2 className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white text-sm">Portfolio Management</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <Heart className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white text-sm">Concierge Services</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <Zap className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white text-sm">Investment Advisory</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#27272A]">
                <Link 
                  to="/services"
                  className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors text-sm"
                >
                  View all services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-white" />
                <h3 className="font-serif text-2xl font-light text-white">Our Commitment</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="font-sans text-3xl font-bold text-white mb-1">2 Hours</div>
                  <div className="font-sans text-orange-100">Initial Response Time</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="font-sans text-3xl font-bold text-white mb-1">24 Hours</div>
                  <div className="font-sans text-orange-100">Property Viewing Arranged</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="font-sans text-3xl font-bold text-white mb-1">7 Days</div>
                  <div className="font-sans text-orange-100">Average Closing Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Content Based on Tab */}
          <div className="lg:col-span-2">
            {/* Live Chat for Authenticated Users */}
            {isAuthenticated && activeTab === 'chat' && (
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 md:p-8 shadow-xl h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-[#F97316]" />
                      </div>
                      {supportOnline && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#18181B] rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-light text-white">Live Support</h3>
                      <p className="text-[#A1A1AA] text-sm">Chat with your dedicated concierge</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    className="text-[#A1A1AA] hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat History Sidebar */}
                {showChatHistory && (
                  <div className="mb-4 p-4 bg-[#0A0A0A] rounded-xl border border-[#27272A] max-h-40 overflow-y-auto">
                    <h4 className="text-white text-sm font-medium mb-3">Recent Conversations</h4>
                    {chatMessages.slice(0, 5).map((msg, idx) => (
                      <div key={idx} className="text-xs text-[#A1A1AA] py-1 border-b border-[#27272A] last:border-0">
                        {msg.message.substring(0, 50)}...
                      </div>
                    ))}
                  </div>
                )}

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white'
                            : 'bg-[#0A0A0A] border border-[#27272A] text-[#A1A1AA]'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#27272A]">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-[#A1A1AA] hover:text-[#F97316] hover:bg-[#F97316]/10 rounded-xl transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white placeholder-[#A1A1AA]/50"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={chatLoading || !newMessage.trim()}
                    className="p-3 bg-[#F97316] text-white rounded-xl hover:bg-[#EA580C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
              </div>
            )}

            {/* Document Upload for Authenticated Users */}
            {isAuthenticated && activeTab === 'documents' && (
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 md:p-12 shadow-xl">
                <h2 className="font-serif text-3xl font-light text-white mb-2">Document Center</h2>
                <p className="font-sans text-[#A1A1AA] mb-8">
                  Upload and manage documents securely. Share files with your concierge for faster processing.
                </p>

                {/* Upload Area */}
                <div 
                  className="border-2 border-dashed border-[#27272A] rounded-2xl p-12 text-center hover:border-[#F97316]/30 transition-colors cursor-pointer mb-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-[#F97316] mx-auto mb-4" />
                  <p className="text-white mb-2">Click to upload or drag and drop</p>
                  <p className="text-[#A1A1AA] text-sm">PDF, Images, Documents (max 50MB each)</p>
                  {uploading && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[#A1A1AA]">Uploading...</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />

                {/* Uploaded Documents */}
                {documents.length > 0 && (
                  <div>
                    <h3 className="text-white font-medium mb-4">Uploaded Documents</h3>
                    <div className="space-y-3">
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#27272A] rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#F97316]" />
                            <div>
                              <p className="text-white text-sm">{doc.name}</p>
                              <p className="text-[#A1A1AA] text-xs">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-[#A1A1AA] hover:text-[#F97316] hover:bg-[#F97316]/10 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => removeDocument(index)}
                              className="p-2 text-[#A1A1AA] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact Form (Visible for Guests or when 'contact' tab is active) */}
            {(!isAuthenticated || activeTab === 'contact') && (
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 md:p-12 shadow-xl relative">
                {isSubmitted ? (
                  <div className="text-center py-12 relative">
                    {/* Dismiss button */}
                    <button
                      onClick={handleDismissSuccess}
                      className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Success Animation */}
                    <div className="relative mb-8">
                      <div className="w-28 h-28 mx-auto relative">
                        {/* Outer ring animation */}
                        <div className="absolute inset-0 border-4 border-[#F97316]/30 rounded-full animate-ping"></div>
                        {/* Inner circle */}
                        <div className="absolute inset-2 bg-[#F97316]/10 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-full flex items-center justify-center shadow-2xl shadow-[#F97316]/30">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-serif text-3xl font-light text-white mb-4">Message Received!</h3>
                    <p className="font-sans text-[#A1A1AA] mb-8 max-w-lg mx-auto">
                      Thank you for contacting Palms Estate,{' '}
                      <span className="text-[#F97316] font-medium">{submittedData?.name}</span>. 
                      Your ticket ID is{' '}
                      <span className="text-white font-mono">{submittedData?.ticketId}</span>
                    </p>
                    <p className="text-[#A1A1AA] mb-8">
                      We've sent a confirmation to{' '}
                      <span className="text-white">{submittedData?.email}</span>.
                    </p>

                    {/* What happens next */}
                    <div className="bg-[#0A0A0A] rounded-2xl p-6 max-w-lg mx-auto border border-[#27272A]">
                      <h4 className="font-sans font-medium text-white mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#F97316]" />
                        What Happens Next?
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F97316]/30">
                            <span className="text-[#F97316] text-xs font-bold">1</span>
                          </div>
                          <div className="text-left">
                            <p className="text-white text-sm font-medium">Check Your Email</p>
                            <p className="text-[#A1A1AA] text-xs">Confirmation with ticket ID: {submittedData?.ticketId}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F97316]/30">
                            <span className="text-[#F97316] text-xs font-bold">2</span>
                          </div>
                          <div className="text-left">
                            <p className="text-white text-sm font-medium">Advisor Assignment</p>
                            <p className="text-[#A1A1AA] text-xs">A dedicated luxury advisor will contact you</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F97316]/30">
                            <span className="text-[#F97316] text-xs font-bold">3</span>
                          </div>
                          <div className="text-left">
                            <p className="text-white text-sm font-medium">Initial Consultation</p>
                            <p className="text-[#A1A1AA] text-xs">Discuss your requirements in detail</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next steps preview */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                      <span className="text-[#A1A1AA]">Redirecting to home</span>
                      <ArrowRight className="w-4 h-4 text-[#F97316] animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-3xl font-light text-white mb-2">
                      {isAuthenticated ? 'New Inquiry' : 'Schedule Your Consultation'}
                    </h2>
                    <p className="font-sans text-[#A1A1AA] mb-8">
                      {isAuthenticated 
                        ? 'Fill out the form below to create a new support ticket or inquiry.'
                        : 'Complete the form below and our luxury property specialists will contact you to arrange a private consultation.'}
                    </p>

                    {error && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Name Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50"
                            placeholder="John"
                            required
                            disabled={isAuthenticated}
                          />
                        </div>
                        <div>
                          <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50"
                            placeholder="Smith"
                            required
                            disabled={isAuthenticated}
                          />
                        </div>
                      </div>

                      {/* Contact Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50"
                            placeholder="john.smith@example.com"
                            required
                            disabled={isAuthenticated}
                          />
                        </div>
                        <div>
                          <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50"
                            placeholder="+1 (555) 123-4567"
                            required
                            disabled={isAuthenticated}
                          />
                        </div>
                      </div>

                      {/* Service & Date */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                            Service Type *
                          </label>
                          <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white"
                            required
                          >
                            <option value="" className="bg-[#0A0A0A]">Select a service</option>
                            {serviceTypes.map(service => (
                              <option key={service} value={service} className="bg-[#0A0A0A]">{service}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                            Preferred Contact Date
                          </label>
                          <input
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                          Your Requirements *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50 resize-none"
                          placeholder="Please describe your requirements, preferred locations, budget range, timeline, and any specific amenities you're looking for..."
                          required
                        />
                      </div>

                      {/* Document Upload for Guests */}
                      {!isAuthenticated && (
                        <div>
                          <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                            Attach Documents (Optional)
                          </label>
                          <div 
                            className="border-2 border-dashed border-[#27272A] rounded-xl p-6 text-center hover:border-[#F97316]/30 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-6 h-6 text-[#F97316] mx-auto mb-2" />
                            <p className="text-white text-sm mb-1">Click to upload files</p>
                            <p className="text-[#A1A1AA] text-xs">PDF, Images, Documents (max 10MB)</p>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                          />
                          {documents.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-[#0A0A0A] rounded-lg border border-[#27272A]">
                                  <span className="text-white text-xs">{doc.name}</span>
                                  <button
                                    onClick={() => removeDocument(idx)}
                                    className="text-[#A1A1AA] hover:text-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Checkbox */}
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="subscribe"
                          name="subscribe"
                          checked={formData.subscribe}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-[#F97316] rounded border-[#27272A] bg-[#0A0A0A] focus:ring-[#F97316]"
                        />
                        <label htmlFor="subscribe" className="ml-3 font-sans text-[#A1A1AA]">
                          I wish to receive exclusive property updates, market insights, and luxury lifestyle content from Palms Estate. 
                          <span className="block text-sm text-[#A1A1AA]/60 mt-1">
                            You can unsubscribe at any time. We respect your privacy.
                          </span>
                        </label>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-4 rounded-xl font-sans font-medium transition-all duration-300 ${
                            isSubmitting 
                              ? 'opacity-75 cursor-not-allowed' 
                              : 'hover:shadow-xl hover:shadow-[#F97316]/20 hover:-translate-y-1'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Send size={20} />
                              {isAuthenticated ? 'Create Ticket' : 'Submit Your Inquiry'}
                            </>
                          )}
                        </button>
                        <p className="text-center font-sans text-sm text-[#A1A1AA]/60 mt-4">
                          By submitting this form, you agree to our{' '}
                          <a href="/privacy" className="text-[#F97316] hover:underline">Privacy Policy</a> and{' '}
                          <a href="/terms" className="text-[#F97316] hover:underline">Terms of Service</a>.
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}

            {/* FAQ Section - Only show for guests or when not in chat/document tabs */}
            {(!isAuthenticated || activeTab === 'contact') && (
              <div className="mt-8 bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl">
                <h3 className="font-serif text-2xl font-light text-white mb-6">Frequently Asked Questions</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-sans font-medium text-white mb-2 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#F97316]" />
                      What is the typical response time?
                    </h4>
                    <p className="font-sans text-[#A1A1AA] text-sm leading-relaxed">
                      Our luxury concierge team responds to all inquiries within 2 hours during business hours, 
                      and within 4 hours outside of regular hours. For urgent matters, call our 24/7 line.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-sans font-medium text-white mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#F97316]" />
                      Do you require NDAs for privacy?
                    </h4>
                    <p className="font-sans text-[#A1A1AA] text-sm leading-relaxed">
                      Yes, we offer Non-Disclosure Agreements for all clients requiring complete confidentiality. 
                      This is standard for our high-profile and ultra-luxury clients.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-sans font-medium text-white mb-2 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#F97316]" />
                      What locations do you serve?
                    </h4>
                    <p className="font-sans text-[#A1A1AA] text-sm leading-relaxed">
                      We operate globally with a focus on luxury markets in North America, Europe, the Caribbean, 
                      Middle East, and Asia-Pacific. Our network includes over 50 prime locations worldwide.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-sans font-medium text-white mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#F97316]" />
                      Is there a fee for your consultation services?
                    </h4>
                    <p className="font-sans text-[#A1A1AA] text-sm leading-relaxed">
                      Initial consultations are complimentary. For specialized services such as investment analysis 
                      or portfolio management, fees are discussed during the initial consultation.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#27272A]">
                  <p className="text-[#A1A1AA] text-sm">
                    Still have questions? <Link to="/faq" className="text-[#F97316] hover:underline">Visit our FAQ page</Link> or call our 24/7 concierge.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
