import api from "./api";
import type { AuthResponse, User, ApiResponse } from "@/types";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken: () => {
    return localStorage.getItem("token");
  },

  getAvailableDrivers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>("/auth/available-drivers");
    return response.data.data;
  },
};

