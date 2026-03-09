import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../ui';
import { Department, CreateDepartmentRequest, tenantApi, StaffDropdownItem } from '../../api/tenantApi';

interface DepartmentFormProps {
    department?: Department | null;
    onClose: () => void;
    onSuccess: () => void;
}

const DepartmentForm = ({ department, onClose, onSuccess }: DepartmentFormProps) => {
    const [formData, setFormData] = useState<CreateDepartmentRequest>({
        headid: null,
        name: '',
        description: '',
        inactive: false
    });
    const [staffList, setStaffList] = useState<StaffDropdownItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStaff();
        if (department) {
            setFormData({
                headid: department.headid,
                name: department.name,
                description: department.description,
                inactive: department.inactive
            });
        }
    }, [department]);

    const fetchStaff = async () => {
        try {
            const response = await tenantApi.getStaffDropdown();
            if (response.success && response.data) {
                setStaffList(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch staff list', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'headid' && value === '') ? null : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (department) {
                await tenantApi.updateDepartment(department.departmentid, formData);
            } else {
                await tenantApi.createDepartment(formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'An error occurred while saving the department.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-900">
                        {department ? 'Edit Department' : 'Create New Department'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Department Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Cardiology"
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all placeholder:text-clinical-slate/30 text-clinical-text font-bold text-sm px-5 py-4"
                            placeholder="Department description..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1">
                            Department Head
                        </label>
                        <select
                            name="headid"
                            value={formData.headid || ''}
                            onChange={handleChange}
                            className="w-full bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all text-clinical-text font-bold text-sm px-5 py-4 appearance-none"
                        >
                            <option value="">Select Head</option>
                            {staffList.map((staff) => (
                                <option key={staff.value} value={staff.value} disabled={staff.disabled}>
                                    {staff.text}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 px-1">
                        <input
                            type="checkbox"
                            id="inactive"
                            name="inactive"
                            checked={formData.inactive}
                            onChange={handleChange}
                            className="w-5 h-5 rounded-md border-2 border-slate-300 text-brand-600 focus:ring-brand-500 rounded focus:ring-offset-0"
                        />
                        <label htmlFor="inactive" className="text-sm font-bold text-slate-700 select-none">
                            Department is Inactive
                        </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : department ? 'Update Department' : 'Create Department'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentForm;
