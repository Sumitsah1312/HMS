import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Smartphone, ArrowRight, ArrowLeft, CheckCircle2, ShieldEllipsis, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Badge } from '../../components/ui';
import { authApi } from '../../api/authApi';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const PatientEntry = () => {
    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();
    const { tenantid } = useParams<{ tenantid: string }>();

    // Fallback ID if URL has placeholder or is undefined
    const activeTenantId = (tenantid && tenantid !== 'YOUR_TENANT_ID') ? tenantid : '20ebf065-c5fe-405d-92f9-2aacddb54dd8';
    const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleMobileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authApi.sendOtp(mobile);
            if (response.success) {
                setStep('otp');
                showToast('OTP sent securely to your device', 'success');
            } else {
                showToast(response.message || 'Failed to send OTP', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const otpString = otp.join('');
            const response = await authApi.authenticateOtpPatient(otpString, mobile);

            if (response.success && response.ispatient) {
                // Scenario 1: Login
                showToast('Welcome back! Login Successful', 'success');

                // Map to User interface
                if (response.token) { // Ensure token exists
                    login({
                        username: response.userName || mobile,
                        email: '', // Not returned in login response
                        name: response.phoneNumber || 'Patient',
                        rolelist: response.roles || ['patient'],
                        ispasswordchanged: false,
                        isTenantSubscribed: false,
                        access_token: response.token
                    });
                    navigate(`/portal/${activeTenantId}/dashboard`);
                } else {
                    showToast('Login failed: No token received', 'error');
                }

            } else if (response.success && !response.ispatient) {
                // Scenario 3: Not Registered -> Register
                showToast('Verification successful. Proceeding to registration.', 'success');
                navigate(`/portal/${activeTenantId}/register`, { state: { mobile } });
            } else {
                // Scenario 2: Incorrect OTP / Error
                showToast(response.message || 'OTP authentication fail. Please retry.', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred during verification.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-clinical-surface flex flex-col items-center justify-center p-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
            <button
                onClick={() => step === 'otp' ? setStep('mobile') : navigate('/')}
                className="mb-12 flex items-center gap-3 text-clinical-slate hover:text-brand-600 transition-all group font-black uppercase text-[10px] tracking-widest"
            >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft size={14} />
                </div>
                Return to Landing
            </button>

            <div className="w-full max-w-[480px] space-y-8 animate-slide-up">
                <div className="text-center space-y-3 mb-10">
                    <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand-100 transition-transform hover:scale-105 duration-500">
                        {step === 'mobile' ? <Smartphone size={32} /> : <ShieldEllipsis size={32} />}
                    </div>
                    <h1 className="text-4xl font-display font-black text-clinical-text tracking-tighter">
                        {step === 'mobile' ? 'Quick Access' : 'Security Check'}
                    </h1>
                    <p className="text-clinical-slate font-semibold text-sm">
                        {step === 'mobile'
                            ? 'Enter your mobile number to check-in or register.'
                            : 'We\'ve sent a verification code to your terminal.'}
                    </p>
                </div>

                <Card className="p-10 shadow-premium border-none relative overflow-hidden">
                    {/* Progress Indicator */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                        <div
                            className="h-full bg-brand-600 transition-all duration-700"
                            style={{ width: step === 'mobile' ? '33%' : '66%' }}
                        />
                    </div>

                    {step === 'mobile' ? (
                        <form onSubmit={handleMobileSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <Input
                                    label="Mobile Identification"
                                    placeholder="Enter your registered number"
                                    type="tel"
                                    icon={Smartphone}
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <div className="flex items-center gap-2 px-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-clinical-slate">
                                        End-to-end encrypted terminal session
                                    </p>
                                </div>
                            </div>

                            <Button variant="premium" className="w-full h-16 text-lg gap-3 group" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Checking Path...
                                    </span>
                                ) : (
                                    <>
                                        Continue to Terminal
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-10">
                            <div className="space-y-6">
                                <div className="flex justify-between gap-3">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !digit && idx > 0) {
                                                    document.getElementById(`otp-${idx - 1}`)?.focus();
                                                }
                                            }}
                                            className="w-full h-16 text-center text-3xl font-display font-black bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all shadow-sm"
                                            required
                                            autoFocus={idx === 0}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <button
                                        type="button"
                                        className="text-[10px] font-black uppercase tracking-widest text-clinical-slate hover:text-brand-600 transition-colors"
                                    >
                                        Resend Code
                                    </button>
                                    <Badge variant="brand">Expires in 02:34</Badge>
                                </div>
                            </div>

                            <Button variant="premium" className="w-full h-16 text-lg" disabled={loading || otp.some(d => !d)}>
                                {loading ? 'Validating Token...' : 'Finalize Authentication'}
                            </Button>
                        </form>
                    )}
                </Card>

                <div className="flex items-center justify-center gap-8 opacity-40 grayscale">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">HiPAA Ready</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full" />
                    <div className="flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Public Terminal</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientEntry;
