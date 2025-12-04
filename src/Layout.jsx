import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, Phone, Mail, HardHat, ChevronDown, LogOut, User, FileText, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./components/shared/NotificationBell";
import UserOnboarding from "./components/auth/UserOnboarding";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  const mainNav = [
    { name: "For Sale", href: createPageUrl("ForSale") },
    { name: "Services", href: createPageUrl("PropertyOwners") },
    { name: "About", href: createPageUrl("About") },
    { name: "Contact", href: createPageUrl("Contact") }
  ];

  const rentalDropdown = [
    { name: "Browse Apartments", href: createPageUrl("Rentals") },
    { name: "AI Property Match", href: createPageUrl("PropertyMatcher") },
    { name: "Applicant Portal", href: createPageUrl("ApplicantDashboard") },
    { name: "Track Application", href: createPageUrl("ApplicationTracker") },
    { name: "Tenant Portal", href: createPageUrl("TenantPortal") }
  ];

  const portalNav = [
    { name: "Owner Portal", href: createPageUrl("PropertyOwnerPortal") },
    { name: "Tenant Portal", href: createPageUrl("TenantPortal") },
    { name: "Track Application", href: createPageUrl("ApplicationTracker") }
  ];

  const adminNav = user?.role === 'admin' ? [
    { name: "Admin Panel", href: createPageUrl("AdminPanel") }
  ] : [];

  return (
    <div className="min-h-screen bg-white">
      <UserOnboarding />
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <HardHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a1f35] tracking-tight">Palms Estate</div>
                <div className="text-xs text-gray-500 tracking-wide">Your Dream Home Awaits</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to={createPageUrl("Home")}
                className={`text-sm font-medium transition-all relative group ${
                  location.pathname === createPageUrl("Home")
                    ? "text-[#ff6b35]"
                    : "text-gray-700 hover:text-[#ff6b35]"
                }`}
              >
                Home
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff6b35] transition-transform origin-left ${
                  location.pathname === createPageUrl("Home") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm font-medium text-gray-700 hover:text-[#ff6b35] transition-all flex items-center gap-1 outline-none">
                  Rentals
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {rentalDropdown.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href} className="cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {mainNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-all relative group ${
                    item.name === 'Contact' 
                      ? 'px-4 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff8c5a]'
                      : location.pathname === item.href
                      ? "text-[#ff6b35]"
                      : "text-gray-700 hover:text-[#ff6b35]"
                  }`}
                >
                  {item.name}
                  {item.name !== 'Contact' && (
                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff6b35] transition-transform origin-left ${
                      location.pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  )}
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-6">
              <div className="hidden xl:flex items-center gap-2 text-sm text-gray-700 hover:text-[#ff6b35] transition-colors font-medium">
                <Phone className="w-4 h-4" />
                <a href="tel:8286239765">(828) 623-9765</a>
              </div>

              {!user && (
                <Button
                  onClick={() => base44.auth.redirectToLogin()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign In
                </Button>
              )}

              {user && (
                <div className="hidden md:flex items-center gap-3">
                  <NotificationBell userEmail={user.email} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-[#1a1f35]">{user.full_name || user.email}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user.full_name || "User"}</span>
                          <span className="text-xs text-gray-500 font-normal">{user.email}</span>
                          {user.role === 'admin' && (
                            <span className="text-xs text-[#ff6b35] font-semibold mt-1">Administrator</span>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {user.role === 'admin' ? (
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("AdminPanel")} className="cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("ApplicantDashboard")} className="cursor-pointer">
                              <FileText className="w-4 h-4 mr-2" />
                              Applicant Portal
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("ApplicationTracker")} className="cursor-pointer">
                              <FileText className="w-4 h-4 mr-2" />
                              Track Application
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("TenantPortal")} className="cursor-pointer">
                              <User className="w-4 h-4 mr-2" />
                              Tenant Portal
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => base44.auth.logout()}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-6 space-y-4">
              {user && (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.full_name || user.email}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="text-xs text-[#ff6b35] font-semibold">Administrator</span>
                      )}
                    </div>
                    <Button
                      onClick={() => base44.auth.logout()}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
              <Link
                to={createPageUrl("Home")}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium py-2 ${
                  location.pathname === createPageUrl("Home")
                    ? "text-[#ff6b35]"
                    : "text-gray-700"
                }`}
              >
                Home
              </Link>
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Rentals</p>
                {rentalDropdown.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-gray-600 py-2 pl-3"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-2">
                {mainNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-base font-medium py-2 ${
                      location.pathname === item.href
                        ? "text-[#ff6b35]"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Portals</p>
                {portalNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-gray-600 py-2"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {adminNav.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Admin</p>
                  {adminNav.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-gray-600 py-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
              {!user && (
                <div className="pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => base44.auth.redirectToLogin()}
                    className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <a href="tel:8286239765" className="flex items-center gap-2 text-gray-600 py-2">
                  <Phone className="w-4 h-4" />
                  <span>(828) 623-9765</span>
                </a>
                <a href="mailto:devbreed@hotmail.com" className="flex items-center gap-2 text-gray-600 py-2">
                  <Mail className="w-4 h-4" />
                  <span>devbreed@hotmail.com</span>
                </a>
              </div>
              </div>
              </div>
              )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1f35] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-lg flex items-center justify-center">
                  <HardHat className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-bold">Palms Estate</div>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                Premium apartment rentals in prime locations. Find your perfect home with Palms Estate.
                </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                {mainNav.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="hover:text-[#ff6b35] transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Portals</h3>
              <ul className="space-y-2 text-gray-400">
                {portalNav.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="hover:text-[#ff6b35] transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  (828) 623-9765
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  devbreed@hotmail.com
                </li>
              </ul>
            </div>
          </div>

          {/* Real Estate Credentials */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-wrap items-center justify-center gap-8 mb-6">
              <a 
                href="https://www.nar.realtor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="bg-white p-3 rounded-lg">
                  <svg className="h-8 w-24" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="10" y="25" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#003DA5">REALTOR®</text>
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Member</span>
              </a>

              <a 
                href="https://www.hud.gov/program_offices/fair_housing_equal_opp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="bg-white p-3 rounded-lg">
                  <svg className="h-10 w-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white"/>
                    <path d="M50 10L20 35V75H40V55H60V75H80V35L50 10Z" fill="#003DA5"/>
                    <circle cx="50" cy="50" r="35" stroke="#003DA5" strokeWidth="3" fill="none"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Equal Housing</span>
              </a>

              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <span className="text-sm text-gray-400">Licensed</span>
              </div>
            </div>
            <p className="text-center text-gray-400 text-xs max-w-2xl mx-auto">
              Licensed Real Estate Professional | Equal Housing Opportunity Provider | All properties listed are subject to the Federal Fair Housing Act
            </p>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Palms Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}