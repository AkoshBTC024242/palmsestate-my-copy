// src/components/DashboardLayout.jsx - OPTIMIZED VERSION
import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  FileText, 
  Heart, 
  User, 
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  Building2,
  CreditCard,
  Shield
} from 'lucide-react';

// Memoized navigation items to prevent unnecessary re-renders
const NavigationItem = memo(({ item, isActive, onClick }) => (
  <Link
    to={item.href}
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-orange-50 text-orange-700 border border-orange-200'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <item.icon className={`mr-3 h-5 w-5 ${
      isActive ? 'text-orange-600' : 'text-gray-400'
    }`} />
    {item.name}
  </Link>
));

NavigationItem.displayName = 'NavigationItem';

// Memoized user menu to prevent re-renders
const UserMenu = memo(({ 
  isOpen, 
  onClose, 
  onLogout, 
  userEmail 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border z-50 animate-in fade-in slide-in-from-top-2">
      <div className="px-4 py-2 border-b">
        <p className="text-sm font-medium text-gray-900 truncate">
          {userEmail?.split('@')[0] || 'User'}
        </p>
        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
      </div>
      <Link
        to="/dashboard/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={onClose}
      >
        Your Profile
      </Link>
      <Link
        to="/dashboard/settings"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={onClose}
      >
        Settings
      </Link>
      <div className="border-t my-1"></div>
      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        Logout
      </button>
    </div>
  );
});

UserMenu.displayName = 'UserMenu';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation configuration
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Applications', href: '/dashboard/applications', icon: FileText },
    { name: 'Saved Properties', href: '/dashboard/saved', icon: Heart },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
      if (sidebarOpen && 
          !event.target.closest('.sidebar-container') && 
          !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen, sidebarOpen]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSidebarOpen(false);
      setUserMenuOpen(false);
    };
  }, []);

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate('/signin');
  }, [signOut, navigate]);

  // Memoized toggle handlers
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen(prev => !prev);
  }, []);

  // Get current page title
  const currentPageTitle = navigation.find(item => 
    location.pathname === item.href || 
    location.pathname.startsWith(item.href + '/')
  )?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-container fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold">
                <span className="text-gray-900">Palms</span>
                <span className="text-orange-600">Estate</span>
              </span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavigationItem
                  key={item.name}
                  item={item}
                  isActive={location.pathname === item.href || 
                           location.pathname.startsWith(item.href + '/')}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </div>
            
            {/* Bottom section */}
            <div className="mt-8 pt-6 border-t">
              <Link
                to="/properties"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors mb-2"
                onClick={() => setSidebarOpen(false)}
              >
                <Building2 className="mr-3 h-5 w-5 text-gray-400" />
                Browse Properties
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0"> {/* Added min-w-0 for flex overflow */}
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle lg:hidden p-2"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            
            {/* Page title */}
            <div className="flex-1 ml-4">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {currentPageTitle}
              </h1>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-2 text-gray-500 hover:text-gray-700 relative transition-colors"
                  aria-label={`${notificationsCount} notifications`}
                >
                  <Bell className="h-6 w-6" />
                  {notificationsCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>
              
              {/* User menu */}
              <div className="user-menu-container relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-3 focus:outline-none transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="hidden md:block text-left max-w-[120px]">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">Dashboard</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                <UserMenu
                  isOpen={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  onLogout={handleLogout}
                  userEmail={user?.email}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
