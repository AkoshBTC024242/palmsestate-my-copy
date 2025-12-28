import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('applications');

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <div className="space-y-6">
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6"
        >
          Back to Applications
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Application #{id}</h1>
          <p className="text-gray-600 mb-6">Application details page</p>
          
          <div className="text-center py-12">
            <p className="text-gray-600">Application detail view will be implemented here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ApplicationDetail;
