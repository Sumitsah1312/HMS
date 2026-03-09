import { useState, useEffect } from 'react';
import {
    Building2,
    Plus,
    Users,
    Settings,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { tenantApi, Department, StaffDropdownItem } from '../../api/tenantApi';
import DepartmentForm from '../../components/admin/DepartmentForm';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [staffMap, setStaffMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [deptResponse, staffResponse] = await Promise.all([
                tenantApi.getDepartmentList(),
                tenantApi.getStaffDropdown()
            ]);

            if (staffResponse.success && staffResponse.data) {
                const map: Record<string, string> = {};
                staffResponse.data.forEach((s: StaffDropdownItem) => {
                    map[s.value] = s.text;
                });
                setStaffMap(map);
            }

            if (deptResponse.success && deptResponse.data) {
                setDepartments(deptResponse.data);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedDepartment(null);
        setShowForm(true);
    };

    const handleEdit = (dept: Department) => {
        setSelectedDepartment(dept);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        fetchData();
    };

    // Helper to generate mock stats for visual consistency with the design
    const getMockStats = (deptId: string) => {
        // Deterministic pseudo-random based on ID char codes
        const code = deptId.charCodeAt(0) + (deptId.charCodeAt(deptId.length - 1) || 0);
        const staff = (code % 20) + 5;
        const patients = (code % 50) + 10;
        const loads = ['Low', 'Medium', 'High', 'Critical'];
        const load = loads[code % 4];
        const colors = ['bg-rose-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-slate-700'];
        const color = colors[code % 5];
        return { staff, patients, load, color };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-hospital-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
                    <p className="text-slate-500 mt-1">Manage hospital wings, heads and resource allocation.</p>
                </div>
                <Button className="gap-2" onClick={handleCreate}>
                    <Plus size={18} />
                    Create New Wing
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => {
                    const stats = getMockStats(dept.departmentid);
                    return (
                        <Card key={dept.departmentid} className={`hover:border-hospital-300 transition-all group overflow-hidden ${dept.inactive ? 'opacity-60 grayscale' : ''}`}>
                            <div className={`h-1.5 w-full ${stats.color}`} />
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100 group-hover:bg-hospital-50 group-hover:text-hospital-600 transition-colors">
                                        <Building2 size={24} />
                                    </div>
                                    <Badge variant={dept.inactive ? 'neutral' : (stats.load === 'Critical' || stats.load === 'High' ? 'danger' : stats.load === 'Medium' ? 'warning' : 'success')}>
                                        {dept.inactive ? 'Inactive' : `${stats.load} Load`}
                                    </Badge>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                        <Users size={14} />
                                        Head: {staffMap[dept.headid] || 'Not Assigned'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 truncate">{dept.description}</p>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Staff</p>
                                        <p className="text-lg font-bold text-slate-700">{stats.staff}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patients Today</p>
                                        <p className="text-lg font-bold text-slate-700">{stats.patients}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    {dept.inactive ? (
                                        <span className="text-slate-400 text-sm font-medium italic">
                                            Actions Disabled
                                        </span>
                                    ) : (
                                        <button className="text-hospital-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                            View Wing Report
                                            <ChevronRight size={16} />
                                        </button>
                                    )}

                                    <button
                                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                                        onClick={() => handleEdit(dept)}
                                        title="Configure Department"
                                    >
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {showForm && (
                <DepartmentForm
                    department={selectedDepartment}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default DepartmentManagement;
