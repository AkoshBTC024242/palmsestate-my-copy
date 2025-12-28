import { useParams, useNavigate } from 'react-router-dom';

function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/applications')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
          >
            Back to Applications
          </button>
          
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            Application #{id}
          </h1>
          <p className="text-gray-600">Review application details</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Application detail view will be implemented here.</p>
            <p className="text-sm text-gray-500 mt-2">Application ID: {id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminApplicationDetail;
