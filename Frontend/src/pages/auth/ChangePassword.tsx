import {
    ShieldAlert,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/ui';

const ChangePassword = () => {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleUpdate = () => {
        // Mock update
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
            <Card className="max-w-md w-full p-10 shadow-2xl border-none">
                <div className="text-center space-y-4 mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-2xl text-amber-600 mb-2">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Secure Your Account</h1>
                    <p className="text-slate-500 text-sm">You're using a temporary password. Please set a new, strong password to continue.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-hospital-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                                >
                                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-hospital-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Password Requirements</p>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            Minimum 8 characters
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            Includes 1 special character
                        </div>
                    </div>

                    <Button className="w-full py-4 rounded-xl gap-2 shadow-lg shadow-hospital-100" type="submit">
                        Update & Continue
                        <ChevronRight size={18} />
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ChangePassword;
