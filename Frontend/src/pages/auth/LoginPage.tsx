import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, Activity, ArrowLeft, Mail } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';


const roleRedirectMap: Record<string, string> = {
    superadmin: '/superadmin',
    tenant: '/admin',
    hr: '/admin',
    doctor: '/doctor',
    patient: '/patient'
};


const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('admin@hospital.com');
    const [password, setPassword] = useState('password');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authApi.login({
                username: email,
                password
            });

            const role = response.roles?.[0];
            const redirectPath = roleRedirectMap[role] || '/';

            await login({
                username: response.userName,
                email: response.email,
                name: response.userName,
                rolelist: response.roles,
                access_token: response.token,
                ispasswordchanged: true,
                isTenantSubscribed: true
            });

            navigate(redirectPath, { replace: true });

        } catch (err) {
            console.log(err);
            // show toast / error message
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-clinical-surface flex flex-col items-center justify-center p-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]">
            <Link
                to="/"
                className="mb-12 flex items-center gap-3 text-clinical-slate hover:text-brand-600 transition-all group font-black uppercase text-[10px] tracking-widest"
            >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft size={14} />
                </div>
                Return to Landing
            </Link>

            <div className="w-full max-w-[440px] animate-slide-up">
                <div className="text-center mb-10 space-y-3">
                    <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand-100 transition-transform hover:rotate-6 duration-500">
                        <Activity size={32} />
                    </div>
                    <h1 className="text-4xl font-display font-black text-clinical-text tracking-tighter">Clinical Login</h1>
                    <p className="text-clinical-slate font-semibold text-sm">Authorized staff terminal access</p>
                </div>

                <Card className="p-10 shadow-premium border-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 opacity-30" />

                    <form onSubmit={handleLogin} className="space-y-8 relative">
                        <div className="space-y-6">
                            <Input
                                label="Staff Identity (Email)"
                                type="email"
                                icon={Mail}
                                placeholder="name@antigravity.med"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label="Passcode"
                                type="password"
                                icon={Lock}
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-between items-center px-1">
                            <Badge variant="neutral" className="lowercase tracking-normal font-bold">Session v2.4</Badge>
                            <button type="button" className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:underline">Reset Logic?</button>
                        </div>

                        <Button
                            variant="premium"
                            className="w-full h-16 text-lg gap-3 group"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Authenticating Path...
                                </span>
                            ) : (
                                <>
                                    Log In Terminal
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </Card>

                <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-clinical-slate opacity-30 grayscale self-center">
                    <ShieldCheck size={14} />
                    AES-256 Secured Station
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    HIPAA Compliance Verified
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
