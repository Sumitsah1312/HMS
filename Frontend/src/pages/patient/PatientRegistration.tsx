import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
    UserPlus,
    User,
    MapPin,
    Calendar,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Smartphone,
    Users,
    Mail
} from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import { patientApi, PatientRegistrationRequest } from '../../api/patientApi';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const PatientRegistration = () => {
    const location = useLocation();
    const { tenantid } = useParams<{ tenantid: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { login } = useAuth();

    // Get mobile from navigation state
    const mobileFromState = location.state?.mobile || '';

    // Default tenant ID if not present in URL or is placeholder
    const activeTenantId = (tenantid && tenantid !== 'YOUR_TENANT_ID') ? tenantid : '20ebf065-c5fe-405d-92f9-2aacddb54dd8';

    const [formData, setFormData] = useState<PatientRegistrationRequest>({
        tenantid: activeTenantId,
        fullName: '',
        dateofBirth: '',
        gender: 'Male',
        mobileNumber: mobileFromState,
        email: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);

    // Update formData if navigation state changes or tenantid changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            mobileNumber: mobileFromState || prev.mobileNumber,
            tenantid: tenantid || prev.tenantid
        }));
    }, [mobileFromState, tenantid]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation for dateofBirth (ISO string format expected by API, but input type="date" returns YYYY-MM-DD)
        // We might need to convert it to ISO string
        const submissionData = {
            ...formData,
            dateofBirth: formData.dateofBirth ? new Date(formData.dateofBirth).toISOString() : new Date().toISOString()
        };

        try {
            const response = await patientApi.registerPatient(submissionData);
            if (response.success && response.token) {
                showToast('Registration Successful!', 'success');

                // Auto-login
                login({
                    username: response.userName || formData.mobileNumber,
                    email: formData.email,
                    name: formData.fullName,
                    rolelist: response.roles || ['patient'],
                    ispasswordchanged: false,
                    isTenantSubscribed: false,
                    access_token: response.token
                });
                navigate(`/portal/${activeTenantId}/dashboard`);
            } else {
                showToast(response.message || 'Registration failed.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('An error occurred during registration.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1050px] mx-auto space-y-12 animate-fade-in py-10 px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-brand-100 transition-transform hover:rotate-6 duration-500">
                        <UserPlus size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-black text-clinical-text tracking-tighter">New Patient Registration</h1>
                        <p className="text-clinical-slate font-semibold text-sm mt-1">Please fill in your details to create an account.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-1">
                            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center ring-4 ring-brand-50">
                                <User size={18} />
                            </div>
                            <h3 className="text-lg font-display font-black text-clinical-text uppercase tracking-tight">Personal Details</h3>
                        </div>
                        <Card className="p-10 shadow-premium border-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    icon={User}
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="e.g. John Doe"
                                    required
                                />
                                <Input
                                    label="Date of Birth"
                                    name="dateofBirth"
                                    type="date"
                                    icon={Calendar}
                                    value={formData.dateofBirth ? formData.dateofBirth.split('T')[0] : ''}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1 group-focus-within:text-brand-600 transition-colors">Gender</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-slate group-focus-within:text-brand-500 transition-colors pointer-events-none">
                                            <Users size={18} />
                                        </div>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <Input
                                    label="Mobile Number"
                                    name="mobileNumber"
                                    icon={Smartphone}
                                    value={formData.mobileNumber}
                                    readOnly
                                    className="bg-slate-50 cursor-not-allowed"
                                />
                                <Input
                                    label="Email Address (Optional)"
                                    name="email"
                                    type="email"
                                    icon={Mail}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </Card>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-1">
                            <div className="w-8 h-8 rounded-lg bg-clinical-surface text-clinical-slate flex items-center justify-center ring-4 ring-clinical-surface">
                                <MapPin size={18} />
                            </div>
                            <h3 className="text-lg font-display font-black text-clinical-text uppercase tracking-tight">Address</h3>
                        </div>
                        <Card className="p-10 shadow-premium border-none">
                            <div className="space-y-8">
                                <Input
                                    label="Full Address"
                                    name="address"
                                    icon={MapPin}
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Street, City, State, Zip"
                                    required
                                />
                            </div>
                        </Card>
                    </section>
                </div>

                <div className="space-y-10">
                    <Card className="p-8 shadow-premium border-none bg-clinical-text text-white relative overflow-hidden">
                        <div className="space-y-6 relative mb-10">
                            <h4 className="text-xl font-display font-black">Ready to Register?</h4>
                            <p className="text-white/60 text-sm">Review your details before submitting. You will be redirected to the dashboard upon success.</p>
                        </div>
                        <Button
                            className="w-full py-5 text-base font-black tracking-tight rounded-2xl shadow-2xl shadow-brand-900 gap-2 border-none"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Registering...
                                </span>
                            ) : (
                                <>
                                    Complete Registration
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </Card>
                    {/* Guidelines */}
                    <Card className="p-8 border-dashed border-2 border-clinical-border bg-transparent">
                        <h4 className="font-display font-black text-clinical-text mb-4 text-sm flex items-center gap-2">
                            <ShieldCheck size={16} className="text-brand-600" />
                            Clinical Protocols
                        </h4>
                        <ul className="space-y-4">
                            {[
                                'Ensure physical ID verification.',
                                'Verify existing medical records.',
                            ].map((text, i) => (
                                <li key={i} className="flex gap-3 text-xs font-medium text-clinical-slate leading-relaxed">
                                    <div className="mt-0.5">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default PatientRegistration;
