// src/pages/dashboard/PostApprovalForm.jsx - UPDATED VERSION
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, CreditCard, Shield, Users, CheckCircle,
  MessageSquare, ChevronRight, Calendar, DollarSign,
  Building2, MapPin, ArrowLeft, Loader2, AlertCircle,
  Home, FileCheck, UserCheck, BadgeCheck, Upload,
  ShieldCheck, Building, Clock, Check
} from 'lucide-react';

function PostApprovalForm() {
  const { id } = useParams(); // Application ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState({
    employmentProof: null,
    idProof: null,
    incomeProof: null,
  });

  // Form state for additional information
  const [formData, setFormData] = useState({
    // Personal Information
    dateOfBirth: '',
    ssnLastFour: '',
    
    // Employment Information
    employmentStatus: '',
    monthlyIncome: '',
    employerName: '',
    employmentDuration: '',
    jobTitle: '',
    
    // Financial Information
    bankName: '',
    accountType: '',
    hasPreviousRental: false,
    previousLandlordName: '',
    previousLandlordPhone: '',
    
    // Household Information
    numberOfOccupants: '1',
    occupantAges: '',
    hasPets: false,
    petType: '',
    petSize: '',
    petAge: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    emergencyContactEmail: '',
    
    // References
    reference1Name: '',
    reference1Phone: '',
    reference1Relation: '',
    reference2Name: '',
    reference2Phone: '',
    reference2Relation: '',
    
    // Legal
    hasEvictionHistory: false,
    hasCriminalRecord: false,
    agreeBackgroundCheck: false,
    agreeCreditCheck: false,
    agreeToTerms: false,
    
    // Additional Info
    moveInDate: '',
    leaseTerm: '12',
    specialRequests: '',
    additionalNotes: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    loadApplicationDetails();
  }, [id, user]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      
      // Load application with property info
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          properties:property_id (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (appError) throw appError;
      if (!appData) throw new Error('Application not found');

      setApplication(appData);
      setProperty(appData.properties);

      // Check if application is in the right status
      if (appData.status !== 'approved_pending_info') {
        if (appData.status === 'additional_info_submitted') {
          navigate(`/dashboard/applications/${id}`);
          return;
        }
        setError('This application is not ready for additional information. Please check your application status.');
        return;
      }

    } catch (error) {
      console.error('Error loading application:', error);
      setError(error.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleFileUpload = (fileType, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const validateStep = (step) => {
    switch(step) {
      case 1: // Personal Info
        if (!formData.dateOfBirth) {
          setError('Date of birth is required');
          return false;
        }
        if (!formData.ssnLastFour || formData.ssnLastFour.length !== 4) {
          setError('Last 4 digits of SSN are required');
          return false;
        }
        return true;
        
      case 2: // Employment & Financial
        if (!formData.employmentStatus) {
          setError('Employment status is required');
          return false;
        }
        if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
          setError('Valid monthly income is required');
          return false;
        }
        if (!formData.employerName) {
          setError('Employer name is required');
          return false;
        }
        if (!uploadedFiles.incomeProof) {
          setError('Income verification document is required');
          return false;
        }
        return true;
        
      case 3: // Household & References
        if (!formData.emergencyContactName || !formData.emergencyContactPhone) {
          setError('Emergency contact information is required');
          return false;
        }
        if (!formData.reference1Name || !formData.reference1Phone) {
          setError('At least one reference is required');
          return false;
        }
        if (formData.hasPets && (!formData.petType || !formData.petSize)) {
          setError('Pet details are required if you have pets');
          return false;
        }
        return true;
        
      case 4: // Legal & Submit
        if (!formData.agreeBackgroundCheck || !formData.agreeCreditCheck || !formData.agreeToTerms) {
          setError('You must agree to all terms and conditions');
          return false;
        }
        if (!uploadedFiles.idProof) {
          setError('ID verification document is required');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    setSubmitting(true);
    setError('');

    try {
      // Upload files to Supabase Storage (you'll need to set up storage)
      // For now, we'll just store file names
      const fileData = {
        employmentProof: uploadedFiles.employmentProof?.name || '',
        idProof: uploadedFiles.idProof?.name || '',
        incomeProof: uploadedFiles.incomeProof?.name || '',
      };

      // Update application with additional information
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          additional_info: formData,
          uploaded_files: fileData,
          status: 'additional_info_submitted',
          updated_at: new Date().toISOString(),
          additional_info_submitted_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccess(true);
      
      // Redirect to application detail page after 3 seconds
      setTimeout(() => {
        navigate(`/dashboard/applications/${id}`);
      }, 3000);

    } catch (error) {
      console.error('Error submitting information:', error);
      setError(error.message || 'Failed to submit information. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Application</h3>
            <p className="text-gray-600">Preparing your detailed application form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Proceed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/dashboard/applications" 
                className="inline-flex items-center justify-center bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your detailed application has been submitted successfully.
              Our team will now conduct the final review and contact you within 24-48 hours.
            </p>
            <div className="space-y-3">
              <Link 
                to={`/dashboard/applications/${id}`}
                className="block w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View Application Status
              </Link>
              <Link 
                to="/dashboard/applications"
                className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Back to All Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Steps configuration
  const steps = [
    { number: 1, title: 'Personal Information', icon: UserCheck },
    { number: 2, title: 'Employment & Financial', icon: FileCheck },
    { number: 3, title: 'Household & References', icon: Users },
    { number: 4, title: 'Review & Submit', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Link 
          to="/dashboard/applications" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-orange-300 hover:text-orange-600 font-medium mb-6 group transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Applications
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-semibold rounded-full text-sm">
                  <BadgeCheck className="w-4 h-4" />
                  Continue Your Application
                </span>
                <span className="text-sm text-gray-500">
                  Application #{application?.reference_number || id}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Complete Detailed Application
              </h1>
              <p className="text-gray-600">
                Your initial application was approved! Now complete this detailed form to proceed with your rental application for:
              </p>
            </div>
            
            {property && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 min-w-[300px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    {property.main_image_url ? (
                      <img 
                        src={property.main_image_url} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{property.title}</h3>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </p>
                    {property.price_per_week && (
                      <p className="text-orange-600 font-bold mt-1">
                        ${property.price_per_week}/week
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Application Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;
                
                return (
                  <div 
                    key={step.number} 
                    className={`relative p-4 rounded-2xl border transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 shadow-sm' 
                        : isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                          : isCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${
                          isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Step {step.number}
                        </div>
                        <div className="font-semibold text-gray-800">{step.title}</div>
                      </div>
                    </div>
                    {step.number < 4 && (
                      <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <ChevronRight className={`w-5 h-5 ${
                          isActive ? 'text-orange-400' : isCompleted ? 'text-green-400' : 'text-gray-300'
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-8">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
                <p className="text-gray-600 mb-6">
                  Please provide your personal details for verification purposes.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last 4 Digits of SSN *
                    </label>
                    <input
                      type="text"
                      name="ssnLastFour"
                      value={formData.ssnLastFour}
                      onChange={handleChange}
                      maxLength="4"
                      pattern="\d{4}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="1234"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">For identity verification only</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 font-medium">Security Notice</p>
                      <p className="text-blue-700 text-sm">
                        Your personal information is encrypted and stored securely. 
                        We use bank-level security protocols to protect your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment & Financial */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Employment & Financial Information</h2>
                <p className="text-gray-600 mb-6">
                  Provide your employment and financial details for income verification.
                </p>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status *
                      </label>
                      <select
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="employed_full_time">Employed Full-time</option>
                        <option value="employed_part_time">Employed Part-time</option>
                        <option value="self_employed">Self-Employed</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="student">Student</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income (USD) *
                      </label>
                      <input
                        type="number"
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                        placeholder="5000"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employer Name *
                      </label>
                      <input
                        type="text"
                        name="employerName"
                        value={formData.employerName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                        placeholder="Company Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Your Position"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment Duration
                    </label>
                    <input
                      type="text"
                      name="employmentDuration"
                      value={formData.employmentDuration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., 2 years"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Income Verification Document *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload pay stubs, bank statements, or employment letter</p>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('incomeProof', e.target.files[0])}
                        className="hidden"
                        id="incomeProof"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="incomeProof"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all cursor-pointer"
                      >
                        Choose File
                      </label>
                      {uploadedFiles.incomeProof && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {uploadedFiles.incomeProof.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Household & References */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Household & References</h2>
                <p className="text-gray-600 mb-6">
                  Tell us about your household and provide references.
                </p>
                
                <div className="space-y-6">
                  {/* Emergency Contact */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Emergency Contact</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                          placeholder="Jane Smith"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Household Information */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Household Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Occupants
                        </label>
                        <select
                          name="numberOfOccupants"
                          value={formData.numberOfOccupants}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="hasPets"
                          name="hasPets"
                          checked={formData.hasPets}
                          onChange={handleChange}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="hasPets" className="text-sm font-medium text-gray-700">
                          Will you have pets in the property?
                        </label>
                      </div>

                      {formData.hasPets && (
                        <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pet Type
                            </label>
                            <input
                              type="text"
                              name="petType"
                              value={formData.petType}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Dog, Cat, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Size
                            </label>
                            <select
                              name="petSize"
                              value={formData.petSize}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">Select Size</option>
                              <option value="small">Small (under 20 lbs)</option>
                              <option value="medium">Medium (20-50 lbs)</option>
                              <option value="large">Large (over 50 lbs)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Age
                            </label>
                            <input
                              type="text"
                              name="petAge"
                              value={formData.petAge}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="e.g., 3 years"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* References */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">References</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Please provide at least one personal or professional reference.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reference Name *
                          </label>
                          <input
                            type="text"
                            name="reference1Name"
                            value={formData.reference1Name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="John Smith"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="reference1Phone"
                            value={formData.reference1Phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="(123) 456-7890"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relationship *
                          </label>
                          <input
                            type="text"
                            name="reference1Relation"
                            value={formData.reference1Relation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Friend, Colleague, etc."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Review & Submit</h2>
                <p className="text-gray-600 mb-6">
                  Review your information and agree to the terms before submitting.
                </p>
                
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Application Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Property</p>
                        <p className="font-medium">{property?.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Application Type</p>
                        <p className="font-medium">Rental Application</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Income</p>
                        <p className="font-medium">
                          ${formData.monthlyIncome ? parseFloat(formData.monthlyIncome).toLocaleString() : '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Occupants</p>
                        <p className="font-medium">{formData.numberOfOccupants}</p>
                      </div>
                    </div>
                  </div>

                  {/* ID Upload */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Identity Verification</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload a government-issued ID (Driver's License, Passport, or State ID) *
                      </p>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('idProof', e.target.files[0])}
                        className="hidden"
                        id="idProof"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="idProof"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all cursor-pointer"
                      >
                        Upload ID Document
                      </label>
                      {uploadedFiles.idProof && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {uploadedFiles.idProof.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Legal Agreements */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <input
                        type="checkbox"
                        id="agreeBackgroundCheck"
                        name="agreeBackgroundCheck"
                        checked={formData.agreeBackgroundCheck}
                        onChange={handleChange}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                        required
                      />
                      <div>
                        <label htmlFor="agreeBackgroundCheck" className="font-medium text-gray-800">
                          I authorize Palms Estate to conduct a background check *
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          This may include criminal history, eviction records, and credit history.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <input
                        type="checkbox"
                        id="agreeCreditCheck"
                        name="agreeCreditCheck"
                        checked={formData.agreeCreditCheck}
                        onChange={handleChange}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                        required
                      />
                      <div>
                        <label htmlFor="agreeCreditCheck" className="font-medium text-gray-800">
                          I authorize a credit check *
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          This will be a soft inquiry that does not affect your credit score.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                        required
                      />
                      <div>
                        <label htmlFor="agreeToTerms" className="font-medium text-gray-800">
                          I agree to the terms and conditions *
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          I confirm that all information provided is accurate and complete.
                          I understand that providing false information may result in application denial.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Final Notes */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-medium">Next Steps After Submission</p>
                        <ul className="text-green-700 text-sm mt-2 space-y-1">
                          <li>✓ Our team will review your complete application within 24-48 hours</li>
                          <li>✓ You'll receive an email confirmation</li>
                          <li>✓ Final approval typically takes 2-3 business days</li>
                          <li>✓ We'll contact you to schedule lease signing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Continue to Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Complete Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help & Support */}
        <div className="mt-8 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Need Assistance?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <MessageSquare className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">Live Chat</h4>
              <p className="text-gray-600 text-sm">
                Get instant help from our support team
              </p>
            </div>
            <div className="text-center p-4">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">Save & Continue</h4>
              <p className="text-gray-600 text-sm">
                Your progress is saved automatically
              </p>
            </div>
            <div className="text-center p-4">
              <FileText className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">Document Help</h4>
              <p className="text-gray-600 text-sm">
                What documents do you need?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostApprovalForm;
