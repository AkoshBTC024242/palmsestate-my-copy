import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Quote from './pages/Quote';
import Contact from './pages/Contact';
import Rentals from './pages/Rentals';
import AdminRentals from './pages/AdminRentals';
import AdminProjects from './pages/AdminProjects';
import About from './pages/About';
import AdminApartments from './pages/AdminApartments';
import ForSale from './pages/ForSale';
import TenantPortal from './pages/TenantPortal';
import AdminLeaseRenewals from './pages/AdminLeaseRenewals';
import AdminTenantDirectory from './pages/AdminTenantDirectory';
import AdminNotifications from './pages/AdminNotifications';
import PropertyOwners from './pages/PropertyOwners';
import ApplicationTracker from './pages/ApplicationTracker';
import FAQ from './pages/FAQ';
import PropertyMatcher from './pages/PropertyMatcher';
import PropertyOwnerPortal from './pages/PropertyOwnerPortal';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplicants from './pages/AdminApplicants';
import ApplicationFeeTracker from './pages/ApplicationFeeTracker';
import UploadPaymentProof from './pages/UploadPaymentProof';
import ApplicantDashboard from './pages/ApplicantDashboard';
import AdminReporting from './pages/AdminReporting';
import AdminSettings from './pages/AdminSettings';
import AdminPanel from './pages/AdminPanel';
import AdminInspections from './pages/AdminInspections';
import AdminOnboarding from './pages/AdminOnboarding';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Services": Services,
    "Projects": Projects,
    "Quote": Quote,
    "Contact": Contact,
    "Rentals": Rentals,
    "AdminRentals": AdminRentals,
    "AdminProjects": AdminProjects,
    "About": About,
    "AdminApartments": AdminApartments,
    "ForSale": ForSale,
    "TenantPortal": TenantPortal,
    "AdminLeaseRenewals": AdminLeaseRenewals,
    "AdminTenantDirectory": AdminTenantDirectory,
    "AdminNotifications": AdminNotifications,
    "PropertyOwners": PropertyOwners,
    "ApplicationTracker": ApplicationTracker,
    "FAQ": FAQ,
    "PropertyMatcher": PropertyMatcher,
    "PropertyOwnerPortal": PropertyOwnerPortal,
    "AdminDashboard": AdminDashboard,
    "AdminApplicants": AdminApplicants,
    "ApplicationFeeTracker": ApplicationFeeTracker,
    "UploadPaymentProof": UploadPaymentProof,
    "ApplicantDashboard": ApplicantDashboard,
    "AdminReporting": AdminReporting,
    "AdminSettings": AdminSettings,
    "AdminPanel": AdminPanel,
    "AdminInspections": AdminInspections,
    "AdminOnboarding": AdminOnboarding,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};