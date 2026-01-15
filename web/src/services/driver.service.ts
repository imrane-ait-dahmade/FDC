import api from "./api";
import type { ApiResponse, Driver } from "@/types";

export interface DriverWithUser extends Driver {
  userId: string | {
    _id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export const driverService = {
  getAll: async (): Promise<DriverWithUser[]> => {
    const response = await api.get<ApiResponse<DriverWithUser[]>>("/drivers");
    return response.data.data;
  },

  getById: async (id: string): Promise<DriverWithUser> => {
    const response = await api.get<ApiResponse<DriverWithUser>>(`/drivers/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Driver>): Promise<DriverWithUser> => {
    const response = await api.post<ApiResponse<DriverWithUser>>("/drivers", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Driver>): Promise<DriverWithUser> => {
    const response = await api.put<ApiResponse<DriverWithUser>>(`/drivers/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },

  updateStatus: async (id: string, status: "active" | "inactive" | "suspended"): Promise<DriverWithUser> => {
    const response = await api.patch<ApiResponse<DriverWithUser>>(`/drivers/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  getMyProfile: async (): Promise<DriverWithUser> => {
    const response = await api.get<ApiResponse<DriverWithUser>>("/drivers/my-profile");
    return response.data.data;
  },
};
