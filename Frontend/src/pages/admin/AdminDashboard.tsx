import { useState, useEffect } from 'react';
import {
    UserPlus,
    Activity,
    TrendingUp,
    Clock,
    ArrowUpRight,
    UserCheck,
    QrCode,
    Copy,
    ExternalLink
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Card, Badge, Button } from '../../components/ui';
import { tenantApi, TenantDashboardData } from '../../api/tenantApi';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
    const { showToast } = useToast();
    const [dashboardData, setDashboardData] = useState<TenantDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await tenantApi.getTenantDashboardData();
                if (response.success) {
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const portalUrl = dashboardData?.tenantid
        ? `${window.location.protocol}//${window.location.host}/portal/${dashboardData.tenantid}/entry`
        : '';

    const handleCopyLink = () => {
        if (portalUrl) {
            navigator.clipboard.writeText(portalUrl);
            showToast('Portal link copied to clipboard', 'success');
        }
    };

    const stats = [
        { label: 'Pending Queue', value: dashboardData?.pendingQueue.toString() || '0', icon: Clock, color: 'text-brand-600', bg: 'bg-brand-50', change: '+5' },
        { label: 'Active Doctors', value: dashboardData?.totalActiveDoctorCount.toString() || '0', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+2' },
        { label: 'Today Visits', value: dashboardData?.totalPatientCount.toString() || '0', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%' },
        { label: 'New Patients', value: dashboardData?.newPatient.toString() || '0', icon: UserPlus, color: 'text-amber-600', bg: 'bg-amber-50', change: '+3' },
    ];

    const recentActivities = [
        { id: '1', patient: 'John Doe', doctor: 'Dr. James Wilson', time: '10:45 AM', status: 'Completed', department: 'Cardiology' },
        { id: '2', patient: 'Sarah Wilson', doctor: 'Dr. Sarah Chen', time: '11:15 AM', status: 'Waiting', department: 'Gastro' },
        { id: '3', patient: 'Michael Brown', doctor: 'Dr. Mike Ross', time: '11:30 AM', status: 'In Consult', department: 'Pediatrics' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-clinical-text tracking-tight">Facility Overview</h1>
                    <p className="text-clinical-slate font-medium text-sm mt-1">Real-time status of your medical facility operations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 text-xs">
                        <TrendingUp size={16} />
                        View Full Report
                    </Button>
                    <Button className="gap-2 text-xs">
                        <UserPlus size={16} />
                        Onboard Doctor
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="p-6 transition-all hover:-translate-y-1 hover:shadow-premium group cursor-default">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 italic">
                                    <ArrowUpRight size={10} />
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-clinical-slate text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-display font-black text-clinical-text mt-1">{stat.value}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content Area - Left Column */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Patient Portal Access Card */}
                    <Card className="p-8 shadow-premium border-none relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <QrCode size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-display font-black tracking-tight">Patient Portal Access</h3>
                                </div>
                                <p className="text-brand-100 font-medium text-sm leading-relaxed max-w-md">
                                    Scan this QR code to instantly access the patient registration and check-in portal.
                                </p>

                                <div className="flex items-center gap-2 bg-black/20 p-2 pl-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                    <code className="text-xs font-mono text-brand-100 truncate flex-1 block max-w-[300px]">
                                        {portalUrl || 'Loading portal URL...'}
                                    </code>
                                    <Button
                                        size="sm"
                                        className="bg-white text-brand-700 hover:bg-brand-50 h-8 px-3"
                                        onClick={handleCopyLink}
                                        disabled={!portalUrl}
                                    >
                                        <Copy size={14} className="mr-1.5" />
                                        Copy
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white hover:bg-white/10 h-8 w-8 p-0"
                                        onClick={() => window.open(portalUrl, '_blank')}
                                        disabled={!portalUrl}
                                    >
                                        <ExternalLink size={14} />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-2xl shadow-2xl transform rotate-3 transition-transform hover:rotate-0 duration-500">
                                {portalUrl ? (
                                    <QRCodeCanvas
                                        value={portalUrl}
                                        size={140}
                                        bgColor={"#ffffff"}
                                        fgColor={"#000000"}
                                        level={"H"}
                                        includeMargin={false}
                                    />
                                ) : (
                                    <div className="w-[140px] h-[140px] bg-slate-100 animate-pulse rounded-lg" />
                                )}
                            </div>
                        </div>

                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
                    </Card>

                    <Card className="shadow-premium border-none">
                        <div className="p-8 pb-4 flex items-center justify-between border-b border-clinical-surface">
                            <h3 className="text-xl font-display font-extrabold text-clinical-text tracking-tight">Clinical Activity</h3>
                            <Button variant="ghost" className="text-xs font-bold text-brand-600">See All Details</Button>
                        </div>
                        <div className="overflow-x-auto p-4">
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] opacity-60">
                                    <tr>
                                        <th className="px-6 py-3">Patient Record</th>
                                        <th className="px-6 py-3">Department</th>
                                        <th className="px-6 py-3">Assigned Physician</th>
                                        <th className="px-6 py-3 text-right">Consult Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-0">
                                    {recentActivities.map((activity) => (
                                        <tr key={activity.id} className="group hover:bg-clinical-surface transition-colors cursor-default patient-row-animation">
                                            <td className="px-6 py-5 rounded-l-2xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-clinical-border flex items-center justify-center font-bold text-[10px] text-clinical-slate">
                                                        {activity.patient[0]}
                                                    </div>
                                                    <p className="font-bold text-sm text-clinical-text">{activity.patient}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-bold text-clinical-slate">{activity.department}</span>
                                            </td>
                                            <td className="px-6 py-5 font-bold text-xs text-brand-600">
                                                {activity.doctor}
                                            </td>
                                            <td className="px-6 py-5 text-right rounded-r-2xl">
                                                <Badge variant={
                                                    activity.status === 'Completed' ? 'success' :
                                                        activity.status === 'In Consult' ? 'info' : 'warning'
                                                }>
                                                    {activity.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <Card className="bg-clinical-text text-white p-8 border-none relative overflow-hidden group h-fit">
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full -mb-24 -mr-24 blur-2xl transition-all group-hover:bg-brand-500/20" />
                    <h3 className="text-xl font-display font-black tracking-tight mb-2 relative">Facility Health Score</h3>
                    <p className="text-brand-100/60 text-xs font-medium relative italic">Overall operational efficiency based on patient throughput.</p>

                    <div className="mt-10 flex items-center gap-6 relative">
                        <div className="text-6xl font-display font-black tracking-tighter">94%</div>
                        <div className="text-emerald-400 font-bold text-xs flex flex-col tracking-wider">
                            <span className="flex items-center gap-1"><ArrowUpRight size={12} /> Excellence</span>
                            <span className="opacity-50 font-medium">Top 2% Globally</span>
                        </div>
                    </div>

                    <div className="mt-12 space-y-6 relative">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-clinical-slate">
                                <span>Wait Time Optimization</span>
                                <span>88%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-500 w-[88%] transition-all duration-1000 ease-out" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-clinical-slate">
                                <span>Patient Feedback</span>
                                <span>98%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[98%] transition-all duration-1000 ease-out" />
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full mt-10 border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-2xl py-4 font-black tracking-widest text-[10px] uppercase">
                        Generate Audit Report
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
