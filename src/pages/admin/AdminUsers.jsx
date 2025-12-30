import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Users, Mail, Calendar, Shield, MoreVertical, Edit, 
  UserPlus, Search, Filter, Eye, Lock, Unlock 
} from 'lucide-react';

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Load all users from auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error loading auth users:', authError);
        return;
      }

      // Load profiles data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      // Load user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      // Combine all data
      const combinedUsers = authUsers.users.map(authUser => {
        const profile = profiles?.find(p => p.id === authUser.id) || {};
        const roleData = userRoles?.find(r => r.user_id === authUser.id) || {};
        
        return {
          id: authUser.id,
          email: authUser.email,
          full_name: profile.full_name || authUser.user_metadata?.full_name || 'N/A',
          phone: profile.phone || 'N/A',
          created_at: authUser.created_at,
          last_sign_in: authUser.last_sign_in_at,
          status: authUser.confirmed_at ? 'Active' : 'Pending',
          role: roleData.role || 'user',
          test_mode: roleData.test_mode || false
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'user' ? 'admin' : 'user';
      
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      alert(`User role changed to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  const toggleTestMode = async (userId, currentMode) => {
    try {
      const newMode = !currentMode;
      
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          test_mode: newMode,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, test_mode: newMode } : user
      ));

      alert(`Test mode ${newMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating test mode:', error);
      alert('Error updating test mode');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage system users and permissions</p>
          </div>
          <button 
            onClick={() => navigate('/admin/users/invite')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <UserPlus className="w-5 h-5" />
            Invite User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>
              
              <button
                onClick={loadUsers}
                className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Mode
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-medium">
                            {user.full_name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleUserRole(user.id, user.role)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                          <span className="capitalize">{user.role}</span>
                        </button>
                      </td>
                      
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleTestMode(user.id, user.test_mode)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            user.test_mode
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {user.test_mode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          <span>{user.test_mode ? 'Enabled' : 'Disabled'}</span>
                        </button>
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.last_sign_in)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
