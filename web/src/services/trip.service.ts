import api from "./api";
import type { ApiResponse, Trip } from "@/types";

export const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const response = await api.get<ApiResponse<Trip[]>>("/trips");
    return response.data.data;
  },

  getMyTrips: async (): Promise<Trip[]> => {
    const response = await api.get<ApiResponse<Trip[]>>("/trips/my-trips");
    return response.data.data;
  },

  getById: async (id: string): Promise<Trip> => {
    const response = await api.get<ApiResponse<Trip>>(`/trips/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Trip>): Promise<Trip> => {
    const response = await api.post<ApiResponse<Trip>>("/trips", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Trip>): Promise<Trip> => {
    const response = await api.put<ApiResponse<Trip>>(`/trips/${id}`, data);
    return response.data.data;
  },

  updateStatus: async (
    id: string,
    status: Trip["status"],
    mileageEnd?: number,
    fuelConsumption?: number
  ): Promise<Trip> => {
    const response = await api.patch<ApiResponse<Trip>>(`/trips/${id}/status`, {
      status,
      mileageEnd,
      fuelConsumption,
    });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },
};

