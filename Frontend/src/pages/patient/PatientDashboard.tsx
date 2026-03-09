import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    Calendar,
    FileText,
    Bell,
    Settings,
    LogOut,
    User,
    ChevronRight,
    Clock,
    Stethoscope,
    Pill,
    Thermometer,
    HeartPulse,
    MapPin,
    AlertCircle,
    Plus,
    Loader2,
    Search,
    UserPlus,
    Users
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/ui';
import { patientApi, Visit, Patient } from '../../api/patientApi';
import { DropdownItem } from '../../api/tenantApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { showToast } = useToast();

    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [requestingToken, setRequestingToken] = useState(false);
    const [flow, setFlow] = useState<'existing' | 'new'>('existing');

    // Lookup Data
    const [departments, setDepartments] = useState<DropdownItem[]>([]);
    const [staff, setStaff] = useState<DropdownItem[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);

    // Form State
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [newPatientName, setNewPatientName] = useState('');
    const [newPatientDob, setNewPatientDob] = useState('');
    const [submittingToken, setSubmittingToken] = useState(false);

    useEffect(() => {
        fetchVisits();
        fetchLookupData();
    }, []);

    useEffect(() => {
        if (selectedDept) {
            fetchDoctors(selectedDept);
        } else {
            setStaff([]);
        }
    }, [selectedDept]);

    const fetchDoctors = async (deptId: string) => {
        try {
            const response = await patientApi.getStaff(deptId);
            if (response.success) {
                setStaff(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        }
    };

    const fetchVisits = async () => {
        try {
            const response = await patientApi.getVisits();
            if (response.success) {
                setVisits(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch visits:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLookupData = async () => {
        try {
            const [deptRes, patientRes] = await Promise.all([
                patientApi.getDepartments(),
                patientApi.getPatients()
            ]);

            if (deptRes.success) setDepartments(deptRes.data || []);
            if (patientRes.success) {
                setPatients(patientRes.data || []);
                console.log('Patients fetched:', patientRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch lookup data:', error);
            showToast('Loading error. Please refresh.', 'error');
        }
    };

    const handleRequestToken = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDept || !selectedDoctor) {
            showToast('Please select department and doctor', 'error');
            return;
        }

        if (flow === 'existing' && !selectedPatientId) {
            showToast('Please select a patient', 'error');
            return;
        }

        if (flow === 'new' && (!newPatientName || !newPatientDob)) {
            showToast('Please provide patient name and date of birth', 'error');
            return;
        }

        setSubmittingToken(true);
        try {
            const dept = departments.find(d => d.value === selectedDept);
            const doc = staff.find(s => s.value === selectedDoctor);

            const payload: any = {
                departmentid: selectedDept,
                departmentname: dept?.text,
                doctorid: selectedDoctor,
                doctorname: doc?.text,
            };

            if (flow === 'existing') {
                payload.patientid = selectedPatientId;
            } else {
                payload.patientname = newPatientName;
                payload.dob = newPatientDob;
            }

            const response = await patientApi.createToken(payload);

            if (response.success) {
                showToast('Token requested successfully!', 'success');
                setRequestingToken(false);
                resetForm();
                fetchVisits();
                fetchLookupData(); // Refresh patient list in case a new one was added
            } else {
                showToast(response.message || 'Failed to request token', 'error');
            }
        } catch (error) {
            console.error('Token request error:', error);
            showToast('An error occurred', 'error');
        } finally {
            setSubmittingToken(false);
        }
    };

    const resetForm = () => {
        setSelectedDept('');
        setSelectedDoctor('');
        setSelectedPatientId('');
        setNewPatientName('');
        setNewPatientDob('');
    };

    const latestVisit = visits[0];
    const pastVisits = visits.slice(1);

    return (
        <div className="min-h-screen bg-clinical-surface selection:bg-brand-100">
            {/* Header */}
            <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm shadow-slate-200/20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-clinical-surface rounded-xl flex items-center justify-center text-brand-600 border border-slate-100 shadow-sm">
                        <Activity size={20} />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="font-display font-black text-lg text-clinical-text tracking-tight">Status Terminal</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-clinical-slate opacity-60">Patient Account: {user?.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="w-10 h-10 rounded-xl bg-clinical-surface text-clinical-slate hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center border border-slate-100"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-10 animate-fade-in">
                {/* Token Hero / Active Visit */}
                {latestVisit ? (
                    <Card className="p-0 border-none shadow-premium overflow-hidden">
                        <div className="premium-gradient p-10 md:p-16 text-white text-center space-y-8 relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />

                            <div className="space-y-2">
                                <Badge variant="neutral" className="bg-white/10 border-white/20 text-white italic tracking-normal font-bold">Active Session</Badge>
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] opacity-80">Patient Token</h2>
                            </div>

                            <div className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none py-4">
                                {latestVisit.token || latestVisit.visitid.substring(0, 5).toUpperCase()}
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-8 border-t border-white/10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Visit Date</p>
                                    <p className="text-2xl font-display font-black">
                                        {new Date(latestVisit.createddate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status</p>
                                    <p className="text-2xl font-display font-black capitalize">{latestVisit.status || 'Scheduled'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 md:p-12 grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                                        <Stethoscope size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-clinical-slate tracking-[0.15em]">Assigned Doctor</p>
                                        <p className="text-lg font-display font-black text-clinical-text leading-tight">{latestVisit.doctorname}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-clinical-slate tracking-[0.15em]">Department</p>
                                        <p className="text-lg font-display font-black text-clinical-text leading-tight">{latestVisit.departmentname}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-clinical-surface rounded-[2rem] p-8 space-y-6 border border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-clinical-slate">Patient Status</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-clinical-text capitalize">{latestVisit.status || 'Awaiting Appointment'}</p>
                                        <p className="text-[10px] text-clinical-slate opacity-60 font-medium">{latestVisit.status === 'waiting' ? 'Please wait for your call' : 'Status updated by doctor'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-12 text-center space-y-8 border-dashed border-2 border-slate-200 bg-transparent">
                        <div className="w-20 h-20 bg-clinical-surface rounded-3xl flex items-center justify-center text-clinical-slate mx-auto">
                            <Calendar size={32} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-display font-black text-clinical-text">No Active Session</h2>
                            <p className="text-clinical-slate text-sm max-w-xs mx-auto">Select an option below to request your consultation token.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => { setFlow('existing'); setRequestingToken(true); }}
                                className="gap-3 py-6 px-8 rounded-2xl border-2"
                            >
                                <Users size={20} />
                                Existing Patient
                            </Button>
                            <Button
                                variant="premium"
                                onClick={() => { setFlow('new'); setRequestingToken(true); }}
                                className="gap-3 py-6 px-8 rounded-2xl"
                            >
                                <UserPlus size={20} />
                                New Patient
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Visit History */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-display font-black text-clinical-text tracking-tight uppercase tracking-widest text-[10px]">Visit History</h3>
                        {latestVisit && (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setFlow('existing'); setRequestingToken(true); }}
                                    className="gap-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50"
                                >
                                    <Users size={14} />
                                    Repeat Visit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setFlow('new'); setRequestingToken(true); }}
                                    className="gap-2 text-clinical-slate hover:text-brand-600 hover:bg-brand-50"
                                >
                                    <UserPlus size={14} />
                                    New Patient
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-clinical-slate">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                Loading history...
                            </div>
                        ) : visits.length > 0 ? (
                            visits.map((visit) => (
                                <Card key={visit.visitid} className="p-6 flex items-center justify-between group hover:border-brand-100 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-clinical-surface rounded-2xl flex items-center justify-center text-clinical-slate group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-clinical-slate uppercase tracking-widest">{new Date(visit.createddate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            <p className="text-lg font-display font-black text-clinical-text">{visit.doctorname}</p>
                                            <p className="text-[10px] font-bold text-clinical-slate uppercase tracking-[0.1em]">{visit.departmentname}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge
                                            variant={
                                                visit.status === 'completed' ? 'success' :
                                                    visit.status === 'referred' ? 'brand' :
                                                        'neutral'
                                            }
                                            className="capitalize"
                                        >
                                            {visit.status || 'Completed'}
                                        </Badge>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 group-hover:text-brand-300 transition-all" />
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                                    <FileText size={24} />
                                </div>
                                <p className="text-clinical-slate text-sm font-bold opacity-40 uppercase tracking-widest">No history record found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Token Request Overlay */}
                {requestingToken && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-clinical-text/20 animate-in fade-in duration-300">
                        <Card className="w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 slide-in-from-bottom-10">
                            <form onSubmit={handleRequestToken} className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-display font-black text-clinical-text">
                                            {flow === 'existing' ? 'Register Visit' : 'New Patient Token'}
                                        </h3>
                                        <p className="text-clinical-slate text-xs font-bold uppercase tracking-widest opacity-60">
                                            {flow === 'existing' ? 'Returning Patient Flow' : 'First-time registration'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 bg-clinical-surface p-1.5 rounded-2xl border border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setFlow('existing')}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${flow === 'existing' ? 'bg-white text-brand-600 shadow-sm' : 'text-clinical-slate hover:text-clinical-text'}`}
                                        >
                                            Existing
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFlow('new')}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${flow === 'new' ? 'bg-white text-brand-600 shadow-sm' : 'text-clinical-slate hover:text-clinical-text'}`}
                                        >
                                            New
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {flow === 'existing' ? (
                                        <div className="md:col-span-2 space-y-2 group">
                                            <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1 group-focus-within:text-brand-600">Patient Selection</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-slate group-focus-within:text-brand-500" size={18} />
                                                <select
                                                    value={selectedPatientId}
                                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                                                    required
                                                >
                                                    <option value="">{patients.length > 0 ? 'Choose Patient' : 'No patients found'}</option>
                                                    {patients.map(p => (
                                                        <option key={p.patientid} value={p.patientid}>{p.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                    <ChevronRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2 group">
                                                <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1 group-focus-within:text-brand-600">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-slate group-focus-within:text-brand-500" size={18} />
                                                    <input
                                                        type="text"
                                                        value={newPatientName}
                                                        onChange={(e) => setNewPatientName(e.target.value)}
                                                        placeholder="Patient Name"
                                                        className="w-full pl-12 pr-4 py-4 bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 group">
                                                <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1 group-focus-within:text-brand-600">Date of Birth</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-slate group-focus-within:text-brand-500" size={18} />
                                                    <input
                                                        type="date"
                                                        value={newPatientDob}
                                                        onChange={(e) => setNewPatientDob(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1 group-focus-within:text-brand-600">Department</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-slate group-focus-within:text-brand-500" size={18} />
                                            <select
                                                value={selectedDept}
                                                onChange={(e) => { setSelectedDept(e.target.value); setSelectedDoctor(''); }}
                                                className="w-full pl-12 pr-4 py-4 bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="">Choose Dept</option>
                                                {departments.map(dept => (
                                                    <option key={dept.value} value={dept.value}>{dept.text}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                <ChevronRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1 group-focus-within:text-brand-600">Consultant</label>
                                        <div className="relative">
                                            <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-slate group-focus-within:text-brand-500" size={18} />
                                            <select
                                                value={selectedDoctor}
                                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                                                required
                                                disabled={!selectedDept}
                                            >
                                                <option value="">Choose Doctor</option>
                                                {staff.map(doc => (
                                                    <option key={doc.value} value={doc.value}>{doc.text}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                <ChevronRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => { setRequestingToken(false); resetForm(); }}
                                        className="flex-1 rounded-2xl py-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="premium"
                                        className="flex-[2] rounded-2xl py-6"
                                        disabled={submittingToken}
                                    >
                                        {submittingToken ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </span>
                                        ) : 'Generate Token'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PatientDashboard;
