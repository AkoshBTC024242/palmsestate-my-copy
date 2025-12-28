import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('applications');

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <div className="space-y-6">
        <button
          onClick={() => navigate(`/dashboard/applications/${id}`)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6"
        >
          Back to Application
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Payment for Application #{id}</h1>
          <p className="text-gray-600 mb-6">Complete your payment here</p>
          
          <div className="text-center py-12">
            <p className="text-gray-600">Payment processing will be implemented here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PaymentPage;
