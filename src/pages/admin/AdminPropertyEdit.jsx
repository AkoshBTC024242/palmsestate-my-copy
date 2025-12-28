import { useParams, useNavigate } from 'react-router-dom';

function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/properties')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
          >
            Back to Properties
          </button>
          
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            {isNew ? 'Add New Property' : 'Edit Property'}
          </h1>
          <p className="text-gray-600">
            {isNew ? 'Create a new luxury property listing' : 'Update property details'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Property edit form will be implemented here.</p>
            {!isNew && <p className="text-sm text-gray-500 mt-2">Editing property ID: {id}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPropertyEdit;
