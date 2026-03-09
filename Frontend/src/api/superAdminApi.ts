import api from './axiosConfig';

export interface CreateTenantRequest {
    tenantname: string;
    tenantemail: string;
    tenantphone: string;
    tenantpassword: string;
    address: string;
    networkendpoint: string;
}

export interface UpdateTenantRequest {
    tenantid: string;
    tenantname: string;
    address: string;
    networkendpoint: string;
    inactive: boolean;
}

export interface Tenant {
    tenantid: string;
    tenantname: string;
    tenantemail: string;
    tenantphone: string;
    address: string;
    networkendpoint: string;
    inactive: boolean;
    tenantpassword?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const superAdminApi = {
    createTenant: async (data: CreateTenantRequest): Promise<ApiResponse<any>> => {
        const response = await api.post('api/SuperAdmin/CreateTenant', data);
        return response.data;
    },
    getTenantList: async (): Promise<ApiResponse<Tenant[]>> => {
        const response = await api.get('api/SuperAdmin/TenantList');
        return response.data;
    },
    getTenantById: async (id: string): Promise<ApiResponse<Tenant>> => {
        const response = await api.get(`api/SuperAdmin/GetTenantById?id=${id}`);
        return response.data;
    },
    updateTenant: async (data: UpdateTenantRequest): Promise<ApiResponse<any>> => {
        const response = await api.post('api/SuperAdmin/UpdateTenant', data);
        return response.data;
    }
};
