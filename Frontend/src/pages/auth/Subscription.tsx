import {
    CreditCard,
    ShieldCheck,
    Zap,
    CheckCircle2,
    Clock,
    ArrowRight,
    Hospital
} from 'lucide-react';
import { Card, Button } from '../../components/ui';

const Subscription = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col pt-20 px-6">
            <div className="max-w-4xl mx-auto w-full space-y-16">
                <div className="text-center space-y-4">
                    <Badge variant="warning" className="mb-4 bg-amber-50 text-amber-700 border-amber-100 py-1.5 px-4 font-bold">Subscription Required</Badge>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Choose Your Facility Plan</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Your medical license is verified. Please subscribe to a plan to start managing your clinical operations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-10 border-2 hover:border-hospital-500 transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Hospital size={100} />
                        </div>
                        <div className="space-y-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-50 rounded-xl text-slate-600">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Clinic Pro</h3>
                                <p className="text-slate-500 mt-1 text-sm italic">For individual practices</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900">$49</span>
                                <span className="text-slate-400 font-medium">/month</span>
                            </div>
                            <ul className="space-y-4 pt-6 border-t border-slate-50">
                                <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                    <CheckCircle2 size={18} className="text-hospital-600" />
                                    Up to 3 Doctors
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                    <CheckCircle2 size={18} className="text-hospital-600" />
                                    Max 500 Patients/mo
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                    <CheckCircle2 size={18} className="text-hospital-600" />
                                    Basic Analytics
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full py-6 group-hover:bg-hospital-600 group-hover:text-white transition-colors">Start 7-Day Trial</Button>
                        </div>
                    </Card>

                    <Card className="p-10 border-2 border-hospital-600 bg-slate-900 text-white relative overflow-hidden ring-4 ring-hospital-100">
                        <div className="absolute top-4 right-4 bg-hospital-500 text-[10px] font-black uppercase px-3 py-1 rounded-full text-white">Most Popular</div>
                        <div className="space-y-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-hospital-500/20 rounded-xl text-hospital-400">
                                <Hospital size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Hospital Elite</h3>
                                <p className="text-hospital-400 mt-1 text-sm italic">For multi-ward facilities</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">$199</span>
                                <span className="text-slate-500 font-medium">/month</span>
                            </div>
                            <ul className="space-y-4 pt-6 border-t border-slate-800">
                                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                                    <CheckCircle2 size={18} className="text-hospital-400" />
                                    Unlimited Doctors
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                                    <CheckCircle2 size={18} className="text-hospital-400" />
                                    Pharmacy Inventory Mgmt
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                                    <CheckCircle2 size={18} className="text-hospital-400" />
                                    Global Tele-medicine
                                </li>
                            </ul>
                            <Button className="w-full py-6 bg-hospital-500 hover:bg-hospital-400 text-white border-none gap-2">
                                Get Started
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="flex items-center justify-center gap-8 py-10 border-t border-slate-100 opacity-50 grayscale">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Verified Payment Partners</p>
                    <CreditCard size={24} />
                    <ShieldCheck size={24} />
                    <Clock size={24} />
                </div>
            </div>
        </div>
    );
};

// Re-using styles from Badge since it's locally needed here if not imported
const Badge = ({ children, variant = 'success', className }: any) => {
    const styles: any = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        danger: 'bg-rose-50 text-rose-700 border-rose-100',
        info: 'bg-sky-50 text-sky-700 border-sky-100',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${styles[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Subscription;
