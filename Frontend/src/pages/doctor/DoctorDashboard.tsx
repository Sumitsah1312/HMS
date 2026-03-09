import { useState, useEffect } from 'react';
import {
    ClipboardList,
    Clock,
    User,
    ArrowRight,
    Stethoscope,
    Activity,
    History,
    FileText,
    RefreshCw,
    Send,
    Users
} from 'lucide-react';
import { Card, Badge, Button, Input, cn } from '../../components/ui';
import doctorApi, { DoctorDashboardStats, DoctorQueueModel } from '../../api/doctorApi';
import { useToast } from '../../context/ToastContext';
import { DropdownItem } from '../../api/tenantApi';

const DoctorDashboard = () => {
    const { showToast } = useToast();
    const [queue, setQueue] = useState<DoctorQueueModel[]>([]);
    const [stats, setStats] = useState<DoctorDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeVisit, setActiveVisit] = useState<DoctorQueueModel | null>(null);

    // Refer Modal State
    const [showReferModal, setShowReferModal] = useState(false);
    const [referringVisit, setReferringVisit] = useState<DoctorQueueModel | null>(null);
    const [departments, setDepartments] = useState<DropdownItem[]>([]);
    const [doctors, setDoctors] = useState<DropdownItem[]>([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDoc, setSelectedDoc] = useState('');
    const [referReason, setReferReason] = useState('');
    const [submittingRefer, setSubmittingRefer] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [qRes, sRes] = await Promise.all([
                doctorApi.getQueue(),
                doctorApi.getDashboardStats()
            ]);
            setQueue(qRes);
            setStats(sRes);

            // Auto-select first ongoing visit if any
            const ongoing = qRes.find(v => v.status === 'ongoing');
            if (ongoing) setActiveVisit(ongoing);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            showToast('Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (visitId: string, status: string) => {
        try {
            const res = await doctorApi.updateStatus(visitId, status);
            if (res.success) {
                showToast(`Visit status updated to ${status}`, 'success');
                fetchData();
                if (status === 'completed') setActiveVisit(null);
            }
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    const handleOpenRefer = async (visit: DoctorQueueModel) => {
        setReferringVisit(visit);
        setShowReferModal(true);
        try {
            const res = await doctorApi.getReferralDepartments();
            if (res.success) setDepartments(res.data);
        } catch (error) {
            showToast('Failed to load departments', 'error');
        }
    };

    const handleDeptChange = async (deptId: string) => {
        setSelectedDept(deptId);
        setSelectedDoc('');
        try {
            const res = await doctorApi.getReferralStaff(deptId);
            if (res.success) setDoctors(res.data);
        } catch (error) {
            showToast('Failed to load doctors', 'error');
        }
    };

    const handleReferSubmit = async () => {
        if (!referringVisit || !selectedDept || !selectedDoc) {
            showToast('Please select department and doctor', 'error');
            return;
        }

        setSubmittingRefer(true);
        try {
            const deptName = departments.find(d => d.value === selectedDept)?.text || '';
            const docName = doctors.find(d => d.value === selectedDoc)?.text || '';

            const res = await doctorApi.reassignPatient({
                visitId: referringVisit.visitId,
                newDoctorId: selectedDoc,
                newDoctorName: docName,
                newDepartmentId: selectedDept,
                newDepartmentName: deptName,
                reason: referReason
            });

            if (res.success) {
                showToast('Patient referred successfully', 'success');
                setShowReferModal(false);
                fetchData();
                if (activeVisit?.visitId === referringVisit.visitId) setActiveVisit(null);
            }
        } catch (error) {
            showToast('Failed to refer patient', 'error');
        } finally {
            setSubmittingRefer(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative pb-10">
            {/* Top Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Today\'s Total', value: stats?.totalPatientsToday || 0, color: 'bg-brand-50 text-brand-700', icon: Users },
                    { label: 'Pending', value: stats?.pendingPatients || 0, color: 'bg-amber-50 text-amber-700', icon: Clock },
                    { label: 'Completed', value: stats?.completedPatients || 0, color: 'bg-emerald-50 text-emerald-700', icon: Activity },
                    { label: 'Reassigned', value: stats?.reassignedPatients || 0, color: 'bg-indigo-50 text-indigo-700', icon: History },
                ].map((stat, i) => (
                    <Card key={i} className="p-6 border-none shadow-sm flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-clinical-slate tracking-[0.15em] mb-1">{stat.label}</p>
                            <p className="text-2xl font-display font-black text-clinical-text leading-tight">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Queue List */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h2 className="text-2xl font-display font-black text-clinical-text tracking-tight">Patient Queue</h2>
                            <p className="text-clinical-slate text-[10px] font-bold mt-1 uppercase tracking-widest italic flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Updated just now
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchData}
                            disabled={loading}
                            className="bg-white/50 hover:bg-white"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        </Button>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
                        {queue.length > 0 ? queue.map((item) => (
                            <Card
                                key={item.visitId}
                                onClick={() => setActiveVisit(item)}
                                className={cn(
                                    "group p-5 transition-all border-none relative overflow-hidden cursor-pointer",
                                    activeVisit?.visitId === item.visitId ? "ring-2 ring-brand-500 bg-brand-50 shadow-premium" : "hover:bg-white hover:shadow-card bg-white/50"
                                )}>
                                <div className="flex items-center justify-between mb-3 relative">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-clinical-slate mb-1">Queue Token</span>
                                        <span className={cn("text-xl font-display font-black", activeVisit?.visitId === item.visitId ? "text-brand-700" : "text-clinical-text")}>
                                            {item.token}
                                        </span>
                                    </div>
                                    <Badge variant={
                                        item.status === 'ongoing' ? 'info' :
                                            item.status === 'completed' ? 'success' :
                                                item.status === 'referred' ? 'brand' :
                                                    'neutral'
                                    } className="capitalize">
                                        {item.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between relative">
                                    <div>
                                        <p className="font-bold text-clinical-text group-hover:text-brand-700 transition-colors uppercase tracking-tight">{item.patientName}</p>
                                        <p className="text-[10px] text-clinical-slate font-bold uppercase tracking-widest mt-0.5">{item.departmentName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-clinical-slate font-black uppercase">{new Date(item.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                {activeVisit?.visitId === item.visitId && (
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-600" />
                                )}
                            </Card>
                        )) : (
                            <div className="py-20 text-center space-y-4 opacity-50">
                                <Users size={40} className="mx-auto text-clinical-slate" />
                                <p className="text-xs font-black uppercase tracking-widest">No patients in queue</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Focused Content */}
                <div className="lg:col-span-2 space-y-8">
                    {activeVisit ? (
                        <Card className="p-10 bg-clinical-text text-white border-none shadow-premium relative overflow-hidden group min-h-[400px]">
                            <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110 duration-700">
                                <Stethoscope size={160} />
                            </div>

                            <div className="relative h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-2xl shrink-0">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-display font-black tracking-tighter">{activeVisit.patientName}</h3>
                                        <p className="text-brand-100/60 font-bold uppercase tracking-widest text-[10px] mt-1 italic">
                                            {activeVisit.status.replace('_', ' ')} • Token {activeVisit.token}
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Scheduled</p>
                                            <p className="text-xl font-display font-black flex items-center gap-2">
                                                <Clock size={18} className="text-brand-400" />
                                                {new Date(activeVisit.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 mb-auto pb-10">
                                    {[
                                        { label: 'Vitals Status', value: 'Pending', icon: Activity },
                                        { label: 'Visit History', value: 'First Visit', icon: History },
                                        { label: 'Patient ID', value: activeVisit.patientId.substring(0, 8).toUpperCase(), icon: FileText },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                            <stat.icon size={16} className="text-brand-400 mb-2" />
                                            <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">{stat.label}</p>
                                            <p className="text-sm font-bold tracking-tight">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-4 mt-auto">
                                    {activeVisit.status === 'waiting' && (
                                        <Button
                                            onClick={() => handleStatusUpdate(activeVisit.visitId, 'ongoing')}
                                            className="flex-1 py-5 text-base tracking-tight font-black rounded-2xl bg-brand-600 hover:bg-brand-500 shadow-xl shadow-brand-900 border-none transition-all active:scale-[0.98]"
                                        >
                                            Start Consultation
                                        </Button>
                                    )}
                                    {activeVisit.status === 'ongoing' && (
                                        <Button
                                            onClick={() => handleStatusUpdate(activeVisit.visitId, 'completed')}
                                            className="flex-1 py-5 text-base tracking-tight font-black rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900 border-none transition-all active:scale-[0.98]"
                                        >
                                            Complete Consultation
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => handleOpenRefer(activeVisit)}
                                        className="flex-1 py-5 text-base tracking-tight font-black rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all"
                                    >
                                        Refer to Specialist
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <div className="text-center space-y-4 opacity-40">
                                <Stethoscope size={64} className="mx-auto text-clinical-slate" />
                                <p className="text-sm font-black uppercase tracking-widest">Select a patient to begin consultation</p>
                            </div>
                        </div>
                    )}

                    {/* Quick Shortcuts (Static for now) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                        <Card className="p-8 group cursor-pointer hover:bg-white transition-all">
                            <div className="flex items-start justify-between">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-clinical-surface text-clinical-slate rounded-2xl flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <h4 className="text-lg font-display font-black text-clinical-text">Medical Prescriptions</h4>
                                    <p className="text-clinical-slate text-xs font-medium leading-relaxed">Issue digital prescriptions for current patient.</p>
                                </div>
                                <ArrowRight size={20} className="text-clinical-slate opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Card>

                        <Card className="p-8 group cursor-pointer hover:bg-white transition-all">
                            <div className="flex items-start justify-between">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-clinical-surface text-clinical-slate rounded-2xl flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                        <ClipboardList size={24} />
                                    </div>
                                    <h4 className="text-lg font-display font-black text-clinical-text">Lab Test Requests</h4>
                                    <p className="text-clinical-slate text-xs font-medium leading-relaxed">Request laboratory imaging and diagnostics.</p>
                                </div>
                                <ArrowRight size={20} className="text-clinical-slate opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Referral Modal */}
            {showReferModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 backdrop-blur-md bg-clinical-text/20 animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-display font-black text-clinical-text">Refer Patient</h3>
                                <p className="text-clinical-slate text-[10px] font-black uppercase tracking-widest opacity-60 italic">
                                    Transfer {referringVisit?.patientName} to another department
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em]">Select Department</label>
                                    <select
                                        value={selectedDept}
                                        onChange={(e) => handleDeptChange(e.target.value)}
                                        className="w-full px-4 py-4 bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-sm"
                                    >
                                        <option value="">Choose Department</option>
                                        {departments.map(d => (
                                            <option key={d.value} value={d.value}>{d.text}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em]">Select Consultant</label>
                                    <select
                                        value={selectedDoc}
                                        onChange={(e) => setSelectedDoc(e.target.value)}
                                        className="w-full px-4 py-4 bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-sm"
                                        disabled={!selectedDept}
                                    >
                                        <option value="">Choose Doctor</option>
                                        {doctors.map(d => (
                                            <option key={d.value} value={d.value}>{d.text}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em]">Referral Reason</label>
                                    <Input
                                        value={referReason}
                                        onChange={(e) => setReferReason(e.target.value)}
                                        placeholder="Enter clinical reason for referral..."
                                        className="py-4"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-2xl py-6"
                                    onClick={() => setShowReferModal(false)}
                                >
                                    Discard
                                </Button>
                                <Button
                                    variant="premium"
                                    className="flex-[2] rounded-2xl py-6 gap-2"
                                    disabled={submittingRefer || !selectedDoc}
                                    onClick={handleReferSubmit}
                                >
                                    {submittingRefer ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                                    Send Referral
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
