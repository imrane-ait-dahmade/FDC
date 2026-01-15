import api from "./api";
import type { ApiResponse, Maintenance } from "@/types";

export const maintenanceService = {
  getAll: async (): Promise<Maintenance[]> => {
    const response = await api.get<ApiResponse<Maintenance[]>>("/maintenance");
    return response.data.data;
  },

  getById: async (id: string): Promise<Maintenance> => {
    const response = await api.get<ApiResponse<Maintenance>>(`/maintenance/${id}`);
    return response.data.data;
  },

  getByTruck: async (truckId: string): Promise<Maintenance[]> => {
    const response = await api.get<ApiResponse<Maintenance[]>>(`/maintenance/truck/${truckId}`);
    return response.data.data;
  },

  create: async (data: Partial<Maintenance>): Promise<Maintenance> => {
    const response = await api.post<ApiResponse<Maintenance>>("/maintenance", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Maintenance>): Promise<Maintenance> => {
    const response = await api.put<ApiResponse<Maintenance>>(`/maintenance/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/maintenance/${id}`);
  },

  updateStatus: async (
    id: string,
    status: Maintenance["status"],
    completedDate?: string,
    cost?: number
  ): Promise<Maintenance> => {
    const response = await api.patch<ApiResponse<Maintenance>>(`/maintenance/${id}/status`, {
      status,
      completedDate,
      cost,
    });
    return response.data.data;
  },
};
