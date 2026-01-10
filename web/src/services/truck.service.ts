import api from "./api";
import type { ApiResponse, Truck } from "@/types";

export const truckService = {
  getAll: async (): Promise<Truck[]> => {
    const response = await api.get<ApiResponse<Truck[]>>("/trucks");
    return response.data.data;
  },

  getById: async (id: string): Promise<Truck> => {
    const response = await api.get<ApiResponse<Truck>>(`/trucks/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Truck>): Promise<Truck> => {
    const response = await api.post<ApiResponse<Truck>>("/trucks", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Truck>): Promise<Truck> => {
    const response = await api.put<ApiResponse<Truck>>(`/trucks/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/trucks/${id}`);
  },

  updateMileage: async (id: string, mileage: number): Promise<Truck> => {
    const response = await api.patch<ApiResponse<Truck>>(`/trucks/${id}/mileage`, {
      mileage,
    });
    return response.data.data;
  },
};

