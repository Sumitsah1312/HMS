import api from './axiosConfig';

export interface Department {
    tenantid: string;
    departmentid: string;
    headid: string;
    name: string;
    description: string;
    inactive: boolean;
    headName?: string; // Optional for display if returned by API or joined
}

export interface CreateDepartmentRequest {
    headid: string | null;
    name: string;
    description: string;
    inactive: boolean;
}

export interface UpdateDepartmentRequest {
    departmentid: string;
    headid: string | null;
    name: string;
    description: string;
    inactive: boolean;
}

export interface Staff {
    tenantid: string;
    staffid: string;
    departmentid: string;
    maritalstatusid: string;
    staffname: string;
    staffemail: string;
    staffphone: string;
    address: string;
    inactive: boolean;
    departmentName?: string;
}

export interface CreateStaffRequest {
    maritalstatusid: string;
    departmentid: string;
    staffname: string;
    staffemail: string;
    staffphone: string;
    address: string;
    staffpassword: string;
}

export interface UpdateStaffRequest {
    staffid: string;
    tenantid?: string; // User example has it
    maritalstatusid: string;
    departmentid: string;
    staffname: string;
    staffemail: string;
    staffphone: string;
    address: string;
    staffpassword?: string; // Optional in update? User example shows it.
    inactive: boolean;
}

export interface DropdownItem {
    disabled: boolean;
    group: string | null;
    selected: boolean;
    text: string;
    value: string;
}

export interface StaffDropdownItem {
    disabled: boolean;
    group: string | null;
    selected: boolean;
    text: string;
    value: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}

export interface TenantDashboardData {
    tenantid: string;
    pendingQueue: number;
    totalActiveDoctorCount: number;
    totalPatientCount: number;
    newPatient: number;
}

export const tenantApi = {
    getStaffDropdown: async (): Promise<ApiResponse<StaffDropdownItem[]>> => {
        const response = await api.get('api/Tenant/GetStaffDropdown');
        return response.data;
    },
    getDepartmentList: async (): Promise<ApiResponse<Department[]>> => {
        const response = await api.get('api/Tenant/GetDepartmentList');
        return response.data;
    },
    createDepartment: async (data: CreateDepartmentRequest): Promise<ApiResponse<any>> => {
        const response = await api.post('api/Tenant/CreateDepartment', data);
        return response.data;
    },
    getDepartmentById: async (departmentId: string): Promise<ApiResponse<Department>> => {
        const response = await api.get(`api/Tenant/EditDepartment?departmentid=${departmentId}`);
        return response.data;
    },
    updateDepartment: async (departmentId: string, data: Omit<UpdateDepartmentRequest, 'departmentid'>): Promise<ApiResponse<any>> => {
        // The user requested to send departmentid in the body.
        const response = await api.post('api/Tenant/UpdateDepartment', { ...data, departmentid: departmentId });
        return response.data;
    },

    // Staff Endpoints
    getDepartmentDropdown: async (): Promise<ApiResponse<DropdownItem[]>> => {
        const response = await api.get('api/Tenant/GetDepartmentDropdown');
        return response.data;
    },
    getMaritalStatusDropdown: async (): Promise<ApiResponse<DropdownItem[]>> => {
        const response = await api.get('api/Tenant/GetMaritalStatusDropdown');
        return response.data;
    },
    getStaffList: async (): Promise<ApiResponse<Staff[]>> => {
        const response = await api.get('api/Tenant/GetStaffList');
        return response.data;
    },
    createStaff: async (data: CreateStaffRequest): Promise<ApiResponse<any>> => {
        const response = await api.post('api/Tenant/CreateStaff', data);
        return response.data;
    },
    getStaffById: async (staffId: string): Promise<ApiResponse<Staff>> => {
        const response = await api.get(`api/Tenant/EditStaff?staffid=${staffId}`);
        return response.data;
    },
    updateStaff: async (data: UpdateStaffRequest): Promise<ApiResponse<any>> => {
        const response = await api.post('api/Tenant/UpdateStaff', data);
        return response.data;
    },
    getTenantDashboardData: async (): Promise<ApiResponse<TenantDashboardData>> => {
        const response = await api.get('api/Tenant/GetTenantDashboardData');
        return response.data;
    }
};
