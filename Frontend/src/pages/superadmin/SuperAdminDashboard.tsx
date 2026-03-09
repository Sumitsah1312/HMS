import { useState, useEffect } from 'react';
import {
    Building2,
    Plus,
    Activity,
    TrendingUp,
    ShieldCheck,
    MapPin,
    Phone,
    Globe,
    Search,
    Filter,
    Mail,
    Lock
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { superAdminApi, Tenant } from '../../api/superAdminApi';
import { Edit2 } from 'lucide-react';

const SuperAdminDashboard = () => {
    const [hospitals, setHospitals] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notifications, setNotifications] = useState<{ id: number, message: string, type: 'success' | 'danger' | 'warning' | 'info' }[]>([]);

    // Form state for Create/Edit
    const [formData, setFormData] = useState({
        tenantid: '',
        name: '',
        location: '',
        contact: '',
        email: '',
        password: '',
        endpoint: '',
        inactive: false
    });

    useEffect(() => {
        fetchHospitals();
    }, []);

    const showNotification = (message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const response = await superAdminApi.getTenantList();
            if (response.success) {
                setHospitals(response.data);
            } else {
                showNotification(response.message || 'Failed to fetch entities.', 'danger');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showNotification('Error connecting to backend.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHospital = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await superAdminApi.createTenant({
                tenantname: formData.name,
                tenantemail: formData.email,
                tenantphone: formData.contact,
                tenantpassword: formData.password,
                address: formData.location,
                networkendpoint: formData.endpoint
            });

            if (response.success) {
                setShowCreateModal(false);
                resetForm();
                showNotification('Hospital onboarded successfully!', 'success');
                fetchHospitals();
            } else {
                showNotification(response.message || 'Failed to create tenant.', 'danger');
            }
        } catch (err: any) {
            console.error('Create error:', err);
            showNotification(err.response?.data?.message || 'Error creating tenant.', 'danger');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = async (id: string) => {
        try {
            const response = await superAdminApi.getTenantById(id);
            if (response.success) {
                const t = response.data;
                setFormData({
                    tenantid: t.tenantid,
                    name: t.tenantname,
                    location: t.address,
                    contact: t.tenantphone,
                    email: t.tenantemail,
                    password: '', // Password usually stays hidden on edit
                    endpoint: t.networkendpoint,
                    inactive: t.inactive
                });
                setShowEditModal(true);
            } else {
                showNotification('Failed to fetch hospital details.', 'danger');
            }
        } catch (err) {
            showNotification('Error fetching hospital record.', 'danger');
        }
    };

    const handleUpdateHospital = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await superAdminApi.updateTenant({
                tenantid: formData.tenantid,
                tenantname: formData.name,
                address: formData.location,
                networkendpoint: formData.endpoint,
                inactive: formData.inactive
            });

            if (response.success) {
                setShowEditModal(false);
                resetForm();
                showNotification('Hospital updated successfully!', 'success');
                fetchHospitals();
            } else {
                showNotification(response.message || 'Update failed.', 'danger');
            }
        } catch (err) {
            showNotification('Error updating hospital.', 'danger');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            tenantid: '',
            name: '',
            location: '',
            contact: '',
            email: '',
            password: '',
            endpoint: '',
            inactive: false
        });
    };

    const stats = [
        { label: 'Total Hospitals', value: hospitals.length, icon: Building2, trend: '+12%', color: 'text-brand-600', bg: 'bg-brand-50' },
        { label: 'Active Nodes', value: hospitals.filter(h => !h.inactive).length, icon: Activity, trend: 'Stable', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <Badge variant="brand" className="mb-2">Network Control v4.0</Badge>
                    <h1 className="text-4xl font-display font-black text-clinical-text tracking-tighter">
                        Hospital Ecosystem
                    </h1>
                    <p className="text-clinical-slate font-medium">Manage and monitor your global healthcare network</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="gap-2 h-12 px-6 rounded-2xl font-bold">
                        <TrendingUp size={18} />
                        Analytics Report
                    </Button>
                    <Button
                        variant="premium"
                        className="gap-2 h-12 px-8 rounded-2xl shadow-lg shadow-brand-100 font-bold"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={18} />
                        Onboard New Hospital
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-8 border-none shadow-sm relative overflow-hidden group hover:shadow-premium transition-all">
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-clinical-slate opacity-60 leading-tight mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-display font-black text-clinical-text leading-tight">{stat.value}</h3>
                                </div>
                            </div>
                            <Badge variant={stat.trend.startsWith('+') ? 'success' : 'neutral'} className="font-bold">{stat.trend}</Badge>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50 rounded-full opacity-50 transition-transform group-hover:scale-150" />
                    </Card>
                ))}
            </div>

            {/* Hospital List Section */}
            <Card className="border-none shadow-premium overflow-hidden rounded-[2rem]">
                <div className="p-8 border-b border-clinical-border flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-clinical-surface px-4 py-2.5 rounded-2xl border border-clinical-border flex items-center gap-3">
                            <Search size={16} className="text-clinical-slate" />
                            <input
                                type="text"
                                placeholder="Filter by hospital name..."
                                className="bg-transparent border-none outline-none text-sm font-semibold w-64 placeholder:text-clinical-slate/50"
                            />
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2 text-[10px] uppercase font-black tracking-widest">
                            <Filter size={14} />
                            Status
                        </Button>
                    </div>
                    <p className="text-xs font-bold text-clinical-slate">Showing {hospitals.length} Active Entities</p>
                </div>

                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-clinical-surface/30">
                                <th className="px-8 py-5 text-[10px] font-black text-clinical-slate uppercase tracking-widest border-b border-clinical-border/50">Hospital Registry</th>
                                <th className="px-8 py-5 text-[10px] font-black text-clinical-slate uppercase tracking-widest border-b border-clinical-border/50">Location</th>
                                <th className="px-8 py-5 text-[10px] font-black text-clinical-slate uppercase tracking-widest border-b border-clinical-border/50">Doctors</th>
                                <th className="px-8 py-5 text-[10px] font-black text-clinical-slate uppercase tracking-widest border-b border-clinical-border/50">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-clinical-slate uppercase tracking-widest border-b border-clinical-border/50">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-clinical-border/30">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-16 bg-white/50" />
                                    </tr>
                                ))
                            ) : (
                                hospitals.map((hospital) => (
                                    <tr key={hospital.tenantid} className="group hover:bg-clinical-surface/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl border border-clinical-border flex items-center justify-center text-brand-600 shadow-sm transition-transform group-hover:scale-110">
                                                    <Building2 size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-clinical-text text-sm mb-0.5">{hospital.tenantname}</p>
                                                    <p className="text-[10px] font-bold text-clinical-slate uppercase tracking-wider flex items-center gap-1">
                                                        <ShieldCheck size={10} className="text-emerald-500" />
                                                        Verified Network
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-semibold text-clinical-text flex items-center gap-2">
                                                <MapPin size={14} className="text-clinical-slate" />
                                                {hospital.address}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[10px] font-bold text-clinical-slate uppercase tracking-tight">
                                                {hospital.networkendpoint}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={!hospital.inactive ? 'success' : 'neutral'} className="capitalize font-black tracking-wide">
                                                {!hospital.inactive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="font-black text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 gap-2"
                                                onClick={() => handleEditClick(hospital.tenantid)}
                                            >
                                                <Edit2 size={12} />
                                                Edit Entity
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create Hospital Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-clinical-text/40 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
                    <Card className="w-full max-w-lg p-10 relative z-10 shadow-3xl border-none animate-slide-up rounded-[2.5rem] max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h2 className="text-3xl font-display font-black text-clinical-text mb-2">Onboard Hospital</h2>
                        <p className="text-clinical-slate font-medium mb-8">Deploy a new instance into the healthcare grid</p>

                        <form onSubmit={handleCreateHospital} className="space-y-6">
                            <Input
                                label="Hospital Registered Name"
                                icon={Building2}
                                placeholder="e.g. Apollo Medical Center"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Administrative Region"
                                    icon={MapPin}
                                    placeholder="City, State"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Network Endpoint"
                                    icon={Globe}
                                    placeholder="https://hospital.med"
                                    value={formData.endpoint}
                                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Tenant Email"
                                    icon={Mail}
                                    type="email"
                                    placeholder="admin@hospital.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Account Password"
                                    icon={Lock}
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <Input
                                label="Primary Emergency Point"
                                icon={Phone}
                                placeholder="+91 XXXX XXX XXX"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                required
                            />

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="flex-1 h-14 font-black uppercase tracking-widest"
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="premium"
                                    type="submit"
                                    className="flex-1 h-14 shadow-lg shadow-brand-100 font-black"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Deploying...' : 'Finalize Deployment'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Edit Hospital Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-clinical-text/40 backdrop-blur-md" onClick={() => setShowEditModal(false)} />
                    <Card className="w-full max-w-lg p-10 relative z-10 shadow-3xl border-none animate-slide-up rounded-[2.5rem] max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h2 className="text-3xl font-display font-black text-clinical-text mb-2">Configure Entity</h2>
                        <p className="text-clinical-slate font-medium mb-8">Update parameters for {formData.name}</p>

                        <form onSubmit={handleUpdateHospital} className="space-y-6">
                            <Input
                                label="Hospital Name"
                                icon={Building2}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Location"
                                icon={MapPin}
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                            <Input
                                label="Endpoint"
                                icon={Globe}
                                value={formData.endpoint}
                                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                                required
                            />

                            <div className="flex items-center gap-3 p-4 bg-clinical-surface rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="inactive"
                                    checked={formData.inactive}
                                    onChange={(e) => setFormData({ ...formData, inactive: e.target.checked })}
                                    className="w-5 h-5 rounded border-2 border-clinical-border text-brand-600 focus:ring-brand-500"
                                />
                                <label htmlFor="inactive" className="text-sm font-bold text-clinical-text">
                                    Mark as Inactive (Grid Disconnect)
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="flex-1 h-14 font-black uppercase tracking-widest"
                                    onClick={() => { setShowEditModal(false); resetForm(); }}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="flex-1 h-14 font-black"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating...' : 'Save Configuration'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
            {/* Notifications Container */}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
                {notifications.map(n => (
                    <Badge key={n.id} variant={n.type} className="animate-slide-up shadow-xl py-3 px-6 text-xs normal-case border-none bg-white/80 backdrop-blur-md">
                        {n.message}
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
