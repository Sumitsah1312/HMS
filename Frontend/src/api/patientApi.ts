import api from './axiosConfig';
import { DropdownItem } from './tenantApi';

export interface PatientRegistrationRequest {
    tenantid: string;
    fullName: string;
    dateofBirth: string; // ISO string 2026-02-16T13:58:30.204Z
    gender: string;
    mobileNumber: string;
    email: string;
    address: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    token?: string;
    roles?: string[];
    userId?: string;
    userName?: string;
    phoneNumber?: string;
}

export interface Visit {
    visitid: string;
    tenantid: string;
    patientid: string;
    departmentid: string;
    doctorid: string;
    departmentname: string;
    doctorname: string;
    createddate: string;
    token?: string;
    status?: string;
}

export interface Patient {
    patientid: string;
    name: string;
    dob: string;
}

export interface CreateTokenRequest {
    patientid?: string;
    departmentid: string;
    departmentname: string;
    doctorid: string;
    doctorname: string;
    patientname?: string;
    dob?: string;
}

export const patientApi = {
    registerPatient: async (data: PatientRegistrationRequest): Promise<ApiResponse<any>> => {
        const response = await api.post('api/Account/RegisterPatient', data);
        return response.data;
    },
    getVisits: async (): Promise<ApiResponse<Visit[]>> => {
        const response = await api.get('api/Patient/GetMyVisits');
        return response.data;
    },
    getPatients: async (): Promise<ApiResponse<Patient[]>> => {
        const response = await api.get('api/Patient/GetPatients');
        return response.data;
    },
    getDepartments: async (): Promise<ApiResponse<DropdownItem[]>> => {
        const response = await api.get('api/Patient/GetDepartmentDropdown');
        return response.data;
    },
    getStaff: async (departmentId?: string): Promise<ApiResponse<DropdownItem[]>> => {
        const response = await api.get(`api/Patient/GetStaffDropdown${departmentId ? `?departmentid=${departmentId}` : ''}`);
        return response.data;
    },
    createToken: async (data: CreateTokenRequest): Promise<ApiResponse<any>> => {
        const response = await api.post('api/Patient/CreatePatientToken', data);
        return response.data;
    }
};
