import {
    Activity,
    MapPin,
    Clock,
    ChevronRight,
    TrendingUp,
    Filter,
    Search
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';

const QueueOverview = () => {
    const wings = [
        {
            name: 'Cardiology Wing',
            location: 'Level 2, North Block',
            count: 12,
            wait: '45m',
            status: 'High Load',
            patients: [
                { token: 'T-042', doctor: 'Dr. James Wilson', time: '10:45 AM', status: 'In Consult' },
                { token: 'T-043', doctor: 'Dr. Sarah Chen', time: '11:15 AM', status: 'Waiting' },
            ]
        },
        {
            name: 'Pediatrics Wing',
            location: 'Level 1, South Block',
            count: 5,
            wait: '15m',
            status: 'Optimal',
            patients: [
                { token: 'T-048', doctor: 'Dr. Mike Ross', time: '11:30 AM', status: 'In Consult' },
                { token: 'T-051', doctor: 'Dr. Harvey Specter', time: '11:45 AM', status: 'Waiting' },
            ]
        }
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-black text-clinical-text tracking-tighter">Queue Visualization</h1>
                    <p className="text-clinical-slate font-semibold text-sm mt-1">Global monitoring of specialized wings and patient flow.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clinical-slate opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <input
                            placeholder="Find Wing or Token..."
                            className="pl-10 pr-4 py-3 bg-white border border-clinical-border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/20 w-64"
                        />
                    </div>
                    <Button variant="outline" className="gap-2 text-xs font-black tracking-widest p-3">
                        <Filter size={16} />
                        Filter Flow
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {wings.map((wing, idx) => (
                    <Card key={idx} className="p-0 shadow-premium border-none relative overflow-hidden group">
                        <div className="p-8 pb-6 border-b border-clinical-surface flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="w-14 h-14 bg-brand-50 rounded-[1.25rem] flex items-center justify-center text-brand-600 shadow-xl shadow-brand-100/50 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <Activity size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-black text-clinical-text tracking-tight group-hover:text-brand-600 transition-colors uppercase italic">{wing.name}</h3>
                                    <p className="text-clinical-slate text-xs font-bold flex items-center gap-1.5 mt-1.5 opacity-60">
                                        <MapPin size={12} />
                                        {wing.location}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={wing.status === 'High Load' ? 'danger' : 'success'} className="px-4 py-1.5">
                                {wing.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 divide-x divide-clinical-border bg-clinical-surface/30">
                            <div className="p-6 text-center">
                                <p className="text-[10px] font-black text-clinical-slate uppercase tracking-widest mb-1 opacity-50">Active Queue</p>
                                <p className="text-2xl font-display font-black text-clinical-text tracking-tighter">{wing.count} Patients</p>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-[10px] font-black text-clinical-slate uppercase tracking-widest mb-1 opacity-50">Avg. Response</p>
                                <p className="text-2xl font-display font-black text-clinical-text tracking-tighter">{wing.wait}</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-3 bg-white">
                            <p className="text-[10px] font-black text-clinical-slate uppercase tracking-widest px-2 mb-4 opacity-50 flex items-center gap-2">
                                <Clock size={12} />
                                Live Session Tracking
                            </p>
                            {wing.patients.map((p, pIdx) => (
                                <div key={pIdx} className="flex items-center justify-between p-4 rounded-2xl bg-clinical-surface/50 border border-clinical-border/50 transition-all hover:bg-white hover:shadow-card hover:scale-[1.01] cursor-pointer group/item">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white border border-clinical-border rounded-xl flex items-center justify-center font-black text-xs text-clinical-text shadow-sm">
                                            {p.token}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-clinical-text uppercase tracking-tight">{p.doctor}</p>
                                            <p className="text-[10px] font-bold text-clinical-slate opacity-60">Session Start: {p.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={p.status === 'In Consult' ? 'info' : 'warning'} className="text-[9px]">
                                            {p.status}
                                        </Badge>
                                        <ChevronRight size={14} className="text-clinical-slate opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 pt-2 border-t border-clinical-surface">
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-brand-600 gap-2 p-4 rounded-xl hover:bg-brand-50">
                                Global Resource Allocation
                                <TrendingUp size={14} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default QueueOverview;
