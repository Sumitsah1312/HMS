import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ShieldCheck,
    ArrowRight,
    Clock,
    Stethoscope,
    Users,
    ChevronRight,
    LogIn
} from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';

const LandingPage = () => {
    const navigate = useNavigate();

    const services = [
        { icon: Stethoscope, title: 'Expert Consultation', desc: 'Specialized care across all departments' },
        { icon: Clock, title: 'Real-time Queue', desc: 'Live status and estimated waiting times' },
        { icon: Users, title: 'Patient Portal', desc: 'Self-service registration & health records', external: false, path: '/portal/YOUR_TENANT_ID/entry' },
    ];

    return (
        <div className="min-h-screen bg-clinical-surface selection:bg-brand-100/50">
            {/* Navigation / Header */}
            <nav className="h-24 px-8 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-100">
                        <Activity size={24} />
                    </div>
                    <span className="font-display font-black text-2xl tracking-tighter text-clinical-text">Clinical Console</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 font-black uppercase tracking-widest text-[10px]"
                    onClick={() => navigate('/login')}
                >
                    <LogIn size={14} />
                    Staff Login
                </Button>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12 lg:py-24 grid lg:grid-cols-2 gap-20 items-center">
                {/* Hero Section */}
                <div className="space-y-10 animate-fade-in">
                    <div className="space-y-6">
                        <Badge variant="brand" className="animate-pulse-subtle">Precision Healthcare v2.4</Badge>
                        <h1 className="text-6xl lg:text-7xl font-display font-black text-clinical-text leading-[1.05] tracking-tighter">
                            Healthcare <br />
                            <span className="text-brand-600">Simpler.</span> Faster. <br />
                            Better.
                        </h1>
                        <p className="text-lg text-clinical-slate font-medium max-w-md leading-relaxed">
                            A minimalist, professional environment designed for rapid patient intake and efficient clinic management.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="premium"
                            size="lg"
                            className="gap-3 group h-20 px-10 rounded-3xl"
                            onClick={() => navigate('/portal/YOUR_TENANT_ID/entry')}
                        >
                            Patient Portal
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <div className="flex items-center gap-4 px-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 animate-pulse`} style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-clinical-slate flex flex-col">
                                <span>12 Doctors Online</span>
                                <span className="text-emerald-500 italic">22 in queue</span>
                            </p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
                        {services.map((s, i) => (
                            <div
                                key={i}
                                className="space-y-3 cursor-pointer group"
                                onClick={() => {
                                    if (s.path) {
                                        s.external ? window.location.href = s.path : navigate(s.path);
                                    }
                                }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-600 flex items-center justify-center border border-slate-100 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                    <s.icon size={18} />
                                </div>
                                <h4 className="font-bold text-sm text-clinical-text">{s.title}</h4>
                                <p className="text-[10px] text-clinical-slate font-medium leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual / Right Side */}
                <div className="relative animate-slide-up animation-delay-300 hidden lg:block">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-50 rounded-full blur-3xl opacity-60" />

                    <Card className="p-2 border-none bg-white/40 backdrop-blur-md shadow-premium scale-105 rotate-1">
                        <div className="bg-clinical-surface rounded-[2rem] p-8 space-y-8">
                            <div className="flex items-center justify-between border-b pb-6 border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-clinical-slate">Medical Officer</p>
                                    <p className="font-display font-black text-xl text-clinical-text">Dr. Emily Stone</p>
                                </div>
                                <Badge variant="success" className="animate-pulse">Active Now</Badge>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-clinical-slate">Patient Queue</p>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm transition-all hover:translate-x-1 group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-black text-[10px]">#{100 + i}</div>
                                            <p className="text-sm font-bold text-clinical-text">John Doe {i}</p>
                                        </div>
                                        <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-all" />
                                    </div>
                                ))}
                            </div>

                            <div className="bg-brand-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-brand-100 flex items-center justify-between">
                                <div className="text-left">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Avg Waiting Time</p>
                                    <p className="text-xl font-display font-black tracking-tighter">14 Minutes</p>
                                </div>
                                <Clock size={32} className="opacity-20" />
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            <footer className="p-8 border-t border-slate-100 text-center opacity-30 select-none pointer-events-none">
                <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-clinical-slate">
                    <div className="flex items-center gap-2 grayscale"><ShieldCheck size={14} /> AES-256 Secured</div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>Cloud Cluster v2.4</span>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>© 2026 Antigravity MedSystems</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
