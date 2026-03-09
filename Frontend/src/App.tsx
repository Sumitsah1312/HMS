import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import Subscription from './pages/auth/Subscription';
import ChangePassword from './pages/auth/ChangePassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import QueueOverview from './pages/admin/QueueOverview';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDetails from './pages/doctor/PatientDetails';
import PatientRegistration from './pages/patient/PatientRegistration';
import PatientLookup from './pages/patient/PatientLookup';
import TokenDisplay from './pages/patient/TokenDisplay';
import LandingPage from './pages/LandingPage';
import PatientEntry from './pages/patient/PatientEntry';
import PatientDashboard from './pages/patient/PatientDashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

import { ToastProvider } from './context/ToastContext';

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <div className="min-h-screen bg-clinical-surface">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/portal/:tenantid/entry" element={<PatientEntry />} />
                            <Route path="/portal/:tenantid/register" element={<PatientRegistration />} />
                            <Route path="/portal/:tenantid/dashboard" element={<PatientDashboard />} />
                            <Route path="/subscription" element={<Subscription />} />
                            <Route path="/change-password" element={<ChangePassword />} />

                            {/* Protected Admin Routes */}
                            <Route
                                path="/admin/*"
                                element={
                                    <ProtectedRoute allowedRoles={['hr', 'tenant']}>
                                        <DashboardLayout>
                                            <Routes>
                                                <Route path="/" element={<AdminDashboard />} />
                                                <Route path="/doctors" element={<DoctorManagement />} />
                                                <Route path="/departments" element={<DepartmentManagement />} />
                                                <Route path="/queue" element={<QueueOverview />} />
                                            </Routes>
                                        </DashboardLayout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected Doctor Routes */}
                            <Route
                                path="/doctor/*"
                                element={
                                    <ProtectedRoute allowedRoles={['doctor']}>
                                        <DashboardLayout>
                                            <Routes>
                                                <Route path="/" element={<DoctorDashboard />} />
                                                <Route path="/queue" element={<div>Detailed Queue</div>} />
                                                <Route path="/details/:id" element={<PatientDetails />} />
                                            </Routes>
                                        </DashboardLayout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected Patient Routes (HR/Employee) */}
                            <Route
                                path="/patient/*"
                                element={
                                    <ProtectedRoute allowedRoles={['hr', 'employee']}>
                                        <DashboardLayout>
                                            <Routes>
                                                <Route path="/register" element={<PatientRegistration />} />
                                                <Route path="/lookup" element={<PatientLookup />} />
                                                <Route path="/status" element={<TokenDisplay />} />
                                            </Routes>
                                        </DashboardLayout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected SuperAdmin Routes */}
                            <Route
                                path="/superadmin/*"
                                element={
                                    <ProtectedRoute allowedRoles={['superadmin']}>
                                        <DashboardLayout>
                                            <Routes>
                                                <Route path="/" element={<SuperAdminDashboard />} />
                                                <Route path="/hospitals" element={<SuperAdminDashboard />} />
                                            </Routes>
                                        </DashboardLayout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* Root Redirect */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
