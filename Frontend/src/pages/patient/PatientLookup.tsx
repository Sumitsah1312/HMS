import {
    Users,
    Search,
    History,
    UserPlus,
    Filter,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';

const PatientLookup = () => {
    const navigate = useNavigate();
    const recentPatients = [
        { id: '10245', name: 'John Doe', lastVisit: '2025-01-15', gender: 'M', age: 45, status: 'Registered' },
        { id: '10246', name: 'Sarah Wilson', lastVisit: '2025-01-10', gender: 'F', age: 32, status: 'In Queue' },
        { id: '10247', name: 'Michael Brown', lastVisit: '2025-01-05', gender: 'M', age: 10, status: 'Completed' },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Records Lookup</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Find existing patients to generate tokens or update records.</p>
                </div>
                <Button onClick={() => navigate('/patient/register')} className="gap-2">
                    <UserPlus size={18} />
                    New Registration
                </Button>
            </div>

            <Card className="p-8 border-none shadow-xl bg-[radial-gradient(#f8fafc_1px,transparent_1px)] [background-size:20px_20px]">
                <div className="max-w-xl mx-auto space-y-6 py-4">
                    <div className="text-center space-y-2 mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-hospital-100 text-hospital-600 rounded-xl mb-2">
                            <Search size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Ready to search?</h2>
                        <p className="text-slate-500 text-sm">Enter name, ID, or phone number to find the patient record.</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-hospital-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Start typing patient details..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-lg outline-none focus:ring-4 focus:ring-hospital-100 focus:border-hospital-500 transition-all shadow-sm font-medium"
                        />
                    </div>

                    <div className="flex justify-center gap-4">
                        <Badge variant="info" className="cursor-pointer hover:bg-hospital-100">By Phone</Badge>
                        <Badge variant="info" className="cursor-pointer hover:bg-hospital-100">By Token</Badge>
                        <Badge variant="info" className="cursor-pointer hover:bg-hospital-100">By MR Number</Badge>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <History className="text-hospital-600" size={20} />
                                Recent Lookups
                            </h3>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Filter size={16} />
                                Filters
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Last Visit</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentPatients.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                                                    <p className="text-xs text-slate-500">ID: {p.id} • {p.gender}, {p.age}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{p.lastVisit}</td>
                                            <td className="px-6 py-4">
                                                <Button variant="ghost" size="sm" className="text-hospital-600 font-bold gap-2">
                                                    Select
                                                    <ArrowRight size={14} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 bg-slate-900 text-white border-none h-full">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Users size={20} className="text-hospital-400" />
                            Quick Statistics
                        </h3>
                        <div className="space-y-6 mt-8">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Patients This Week</p>
                                <p className="text-3xl font-black">1.4k</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">New Registrations</p>
                                <p className="text-3xl font-black">82</p>
                            </div>
                        </div>
                        <div className="mt-12 opacity-40">
                            <p className="text-[10px] italic leading-relaxed">Searching across 43,000+ medical records in the Antigravity Central DB.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientLookup;
