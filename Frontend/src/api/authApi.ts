import api from './axiosConfig';

export interface LoginResponse {
    userName: string;
    email: string;
    roles: string[];
    token: string;
}

export const authApi = {
    login: async (credentials: any): Promise<LoginResponse> => {
        const response = await api.post('api/Account/Login', credentials);
        return response.data;
    },
    sendOtp: async (mobile: string): Promise<ApiResponse<any>> => {
        const response = await api.post('api/Account/SendOtp', { userName: mobile });
        return response.data;
    },
    authenticateOtpPatient: async (otp: string, mobile: string): Promise<ApiResponse<any>> => {
        const response = await api.post('api/Account/AuthenticateOtpPatient', { otp, userName: mobile });
        return response.data;
    }
};

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    ispatient?: boolean;
    token?: string;
    roles?: string[];
    userId?: string;
    userName?: string;
    phoneNumber?: string;
}
