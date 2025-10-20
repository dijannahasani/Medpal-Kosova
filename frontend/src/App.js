import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/Mobile.css';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import WelcomePage from './pages/WelcomePage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyEmail from './pages/Patient/VerifyEmail';

// Patient Pages
import PatientDashboard from './pages/Patient/PatientDashboard';
import PatientProfile from './pages/Patient/PatientProfile';
import BookAppointment from './pages/Patient/BookAppointment';
import AppointmentHistory from './pages/Patient/AppointmentHistory';
import PatientReports from './pages/Patient/PatientReports';
import UploadDocuments from './pages/Patient/UploadDocuments';
import SearchDoctors from './pages/Patient/SearchDoctors';
import PatientNotifications from './pages/Patient/PatientNotifications';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorReports from './pages/Doctor/DoctorReports';
import AddVisitReport from './pages/Doctor/AddVisitReport';
import DoctorWorkingHours from './pages/Doctor/DoctorWorkingHours';

// Clinic Pages
import ClinicDashboard from './pages/Clinic/ClinicDashboard';
import ClinicProfileUpdate from './pages/Clinic/ClinicProfileUpdate';
import ClinicAddDoctor from './pages/Clinic/ClinicAddDoctor';
import ClinicAppointments from './pages/Clinic/ClinicAppointments';
import ClinicPatientReports from './pages/Clinic/ClinicPatientReports';
import ClinicServicesAndDepartments from './pages/Clinic/ClinicServicesAndDepartments';
import ClinicSetDoctorHours from './pages/Clinic/ClinicSetDoctorHours';
import DoctorList from './pages/Clinic/DoctorList';
import InvitePatient from './pages/Clinic/InvitePatient';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminOverView from './pages/AdminOverView';

// Common Pages
import CalendarView from './pages/Common/CalendarView';

// NotFoundRedirect component
function NotFoundRedirect() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        // Redirect to appropriate dashboard
        navigate(`/${userData.role}`, { replace: true });
      } catch (error) {
        // If user data is corrupted, redirect to login
        navigate('/login', { replace: true });
      }
    } else {
      // If not logged in, redirect to welcome page
      navigate('/', { replace: true });
    }
  }, [navigate]);
  
  return null; // This component doesn't render anything
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/verify-invite" element={<VerifyEmail />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Patient Routes */}
          <Route path="/patient" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </PrivateRoute>
          } />
          <Route path="/patient/profile" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientProfile />
            </PrivateRoute>
          } />
          <Route path="/patient/book-appointment" element={
            <PrivateRoute allowedRoles={['patient']}>
              <BookAppointment />
            </PrivateRoute>
          } />
          <Route path="/patient/appointments" element={
            <PrivateRoute allowedRoles={['patient']}>
              <AppointmentHistory />
            </PrivateRoute>
          } />
          <Route path="/patient/reports" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientReports />
            </PrivateRoute>
          } />
          <Route path="/patient/documents" element={
            <PrivateRoute allowedRoles={['patient']}>
              <UploadDocuments />
            </PrivateRoute>
          } />
          <Route path="/patient/search-doctors" element={
            <PrivateRoute allowedRoles={['patient']}>
              <SearchDoctors />
            </PrivateRoute>
          } />
          <Route path="/patient/notifications" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientNotifications />
            </PrivateRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor" element={
            <PrivateRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </PrivateRoute>
          } />
          <Route path="/doctor/profile" element={
            <PrivateRoute allowedRoles={['doctor']}>
              <DoctorProfile />
            </PrivateRoute>
          } />
          <Route path="/doctor/appointments" element={
            <PrivateRoute allowedRoles={['doctor']}>
              <DoctorAppointments />
            </PrivateRoute>
          } />
          <Route path="/doctor/reports" element={
            <PrivateRoute allowedRoles={['doctor']}>
              <DoctorReports />
            </PrivateRoute>
          } />
          <Route path="/doctor/add-report" element={
            <PrivateRoute allowedRoles={['doctor']}>
              <AddVisitReport />
            </PrivateRoute>
          } />
          <Route path="/doctor/working-hours" element={
            <PrivateRoute allowedRoles={['doctor']}>
              <DoctorWorkingHours />
            </PrivateRoute>
          } />

          {/* Clinic Routes */}
          <Route path="/clinic" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <ClinicDashboard />
            </PrivateRoute>
          } />
          <Route path="/clinic/profile" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <ClinicProfileUpdate />
            </PrivateRoute>
          } />
          <Route path="/clinic/add-doctor" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <ClinicAddDoctor />
            </PrivateRoute>
          } />
          <Route path="/clinic/appointments" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <ClinicAppointments />
            </PrivateRoute>
          } />
          <Route path="/clinic/reports" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <ClinicPatientReports />
            </PrivateRoute>
          } />
          <Route path="/clinic/services" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <ClinicServicesAndDepartments />
            </PrivateRoute>
          } />
          <Route path="/clinic/doctor-hours" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <ClinicSetDoctorHours />
            </PrivateRoute>
          } />
          <Route path="/clinic/doctors" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <DoctorList />
            </PrivateRoute>
          } />
          <Route path="/clinic/invite-patient" element={
            <PrivateRoute allowedRoles={['clinic']}>
              <InvitePatient />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/overview" element={
            <AdminRoute>
              <AdminOverView />
            </AdminRoute>
          } />

          {/* Common Routes */}
          <Route path="/calendar" element={
            <PrivateRoute allowedRoles={['patient', 'doctor', 'clinic']}>
              <CalendarView />
            </PrivateRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
