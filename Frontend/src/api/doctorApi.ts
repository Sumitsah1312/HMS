import axiosInstance from './axiosConfig';

export interface DoctorDashboardStats {
    totalPatientsToday: number;
    pendingPatients: number;
    completedPatients: number;
    reassignedPatients: number;
}

export interface DoctorQueueModel {
    visitId: string;
    patientId: string;
    patientName: string;
    token: string;
    status: string;
    createdDate: string;
    departmentName: string;
}

export interface ReassignPatientModel {
    visitId: string;
    newDoctorId: string;
    newDoctorName: string;
    newDepartmentId: string;
    newDepartmentName: string;
    reason: string;
}

const doctorApi = {
    getDashboardStats: async () => {
        const response = await axiosInstance.get<DoctorDashboardStats>(`api/Doctor/GetDashboardStats`);
        return response.data;
    },

    getQueue: async () => {
        const response = await axiosInstance.get<DoctorQueueModel[]>(`api/Doctor/GetQueue`);
        return response.data;
    },

    reassignPatient: async (model: ReassignPatientModel) => {
        const response = await axiosInstance.post(`api/Doctor/ReassignPatient`, model);
        return response.data;
    },

    updateStatus: async (visitId: string, status: string) => {
        const response = await axiosInstance.post(`api/Doctor/UpdateStatus`, null, {
            params: { visitId, status }
        });
        return response.data;
    },

    getReferralDepartments: async () => {
        const response = await axiosInstance.get(`api/Doctor/GetReferralDepartments`);
        return response.data;
    },

    getReferralStaff: async (departmentId: string) => {
        const response = await axiosInstance.get(`api/Doctor/GetReferralStaff`, {
            params: { departmentId }
        });
        return response.data;
    }
};

export default doctorApi;
