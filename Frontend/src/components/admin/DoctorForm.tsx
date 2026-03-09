import { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../ui';
import { Staff, CreateStaffRequest, tenantApi, DropdownItem } from '../../api/tenantApi';

interface DoctorFormProps {
    staff?: Staff | null;
    onClose: () => void;
    onSuccess: () => void;
}

const DoctorForm = ({ staff, onClose, onSuccess }: DoctorFormProps) => {
    const [formData, setFormData] = useState<CreateStaffRequest>({
        maritalstatusid: '',
        departmentid: '',
        staffname: '',
        staffemail: '',
        staffphone: '',
        address: '',
        staffpassword: ''
    });
    const [inactive, setInactive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState<DropdownItem[]>([]);
    const [maritalStatuses, setMaritalStatuses] = useState<DropdownItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDropdowns();
        if (staff) {
            setFormData({
                maritalstatusid: staff.maritalstatusid,
                departmentid: staff.departmentid,
                staffname: staff.staffname,
                staffemail: staff.staffemail,
                staffphone: staff.staffphone,
                address: staff.address,
                staffpassword: '' // Don't show password on edit
            });
            setInactive(staff.inactive);
        }
    }, [staff]);

    const fetchDropdowns = async () => {
        setLoading(true);
        try {
            const [deptRes, maritalRes] = await Promise.all([
                tenantApi.getDepartmentDropdown(),
                tenantApi.getMaritalStatusDropdown()
            ]);

            if (deptRes.success) {
                setDepartments(deptRes.data);
            } else {
                console.error('Department dropdown failed:', deptRes.message);
            }

            if (maritalRes.success) {
                setMaritalStatuses(maritalRes.data);
            } else {
                console.error('Marital status dropdown failed:', maritalRes.message);
            }

            if (!deptRes.success || !maritalRes.success) {
                setError('Some dropdown data could not be loaded. Please refresh or try again.');
            }
        } catch (err: any) {
            console.error('Failed to fetch dropdowns', err);
            setError('Connection error: Failed to fetch dropdown data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (staff) {
                // For update
                await tenantApi.updateStaff(staff.staffid || '', {
                    ...formData,
                    inactive
                });
            } else {
                await tenantApi.createStaff(formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'An error occurred while saving the staff member.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900">
                        {staff ? 'Edit Doctor / Staff' : 'Register New Doctor / Staff'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                name="staffname"
                                value={formData.staffname}
                                onChange={handleChange}
                                placeholder="Dr. John Doe"
                                required
                            />
                            <Input
                                label="Email Address"
                                name="staffemail"
                                type="email"
                                value={formData.staffemail}
                                onChange={handleChange}
                                placeholder="john.doe@hospital.com"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Phone Number"
                                name="staffphone"
                                value={formData.staffphone}
                                onChange={handleChange}
                                placeholder="+1 234 567 890"
                                required
                            />
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1">
                                    Department
                                </label>
                                <select
                                    name="departmentid"
                                    value={formData.departmentid}
                                    onChange={handleChange}
                                    className="w-full bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all text-clinical-text font-bold text-sm px-5 py-4 appearance-none"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.value} value={dept.value} disabled={dept.disabled}>
                                            {dept.text}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1">
                                    Marital Status
                                </label>
                                <select
                                    name="maritalstatusid"
                                    value={formData.maritalstatusid}
                                    onChange={handleChange}
                                    className="w-full bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all text-clinical-text font-bold text-sm px-5 py-4 appearance-none"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    {maritalStatuses.map((status) => (
                                        <option key={status.value} value={status.value} disabled={status.disabled}>
                                            {status.text}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1">
                                    Password {staff && '(Leave blank to keep current)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="staffpassword"
                                        value={formData.staffpassword}
                                        onChange={handleChange}
                                        className="w-full bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all placeholder:text-clinical-slate/30 text-clinical-text font-bold text-sm px-5 py-4"
                                        placeholder={staff ? "••••••••" : "Create password"}
                                        required={!staff}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all placeholder:text-clinical-slate/30 text-clinical-text font-bold text-sm px-5 py-4"
                                placeholder="Residential address..."
                                required
                            />
                        </div>

                        {staff && (
                            <div className="flex items-center gap-3 px-1">
                                <input
                                    type="checkbox"
                                    id="inactive"
                                    checked={inactive}
                                    onChange={(e) => setInactive(e.target.checked)}
                                    className="w-5 h-5 rounded-md border-2 border-slate-300 text-brand-600 focus:ring-brand-500 rounded focus:ring-offset-0"
                                />
                                <label htmlFor="inactive" className="text-sm font-bold text-slate-700 select-none">
                                    Staff is Inactive
                                </label>
                            </div>
                        )}

                        <div className="pt-2 flex gap-3">
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
                                {loading ? 'Saving...' : staff ? 'Update Staff' : 'Register Staff'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorForm;
