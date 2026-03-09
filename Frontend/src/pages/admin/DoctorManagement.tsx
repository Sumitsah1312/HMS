import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit3,
    Loader2
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { tenantApi, Staff } from '../../api/tenantApi';
import DoctorForm from '../../components/admin/DoctorForm';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Staff | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await tenantApi.getStaffList();
            if (response.success && response.data) {
                setDoctors(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedDoctor(null);
        setShowForm(true);
    };

    const handleEdit = (doctor: Staff) => {
        setSelectedDoctor(doctor);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        fetchDoctors();
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.staffname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.staffemail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-hospital-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Doctor & Staff Management</h1>
                    <p className="text-slate-500 mt-1">Add, edit and monitor hospital medical staff.</p>
                </div>
                <Button className="gap-2" onClick={handleCreate}>
                    <Plus size={18} />
                    Register New Staff
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, department or email..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hospital-500 outline-none text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Doctor Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Department</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor.staffid} className={`hover:bg-slate-50/50 transition-colors group ${doctor.inactive ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-hospital-50 flex items-center justify-center text-hospital-600 font-bold border border-hospital-100 uppercase">
                                                {doctor.staffname.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{doctor.staffname}</p>
                                                <p className="text-xs text-slate-500">ID: {doctor.staffid?.substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600">
                                            <p>{doctor.staffemail}</p>
                                            <p className="text-xs text-slate-400">{doctor.staffphone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{doctor.departmentName || 'Unknown Dept'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={!doctor.inactive ? 'success' : 'neutral'}>
                                            {!doctor.inactive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                                onClick={() => handleEdit(doctor)}
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDoctors.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No staff members found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {showForm && (
                <DoctorForm
                    staff={selectedDoctor}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default DoctorManagement;
