export const UserRole = {
  ADMIN: "admin",
  DRIVER: "driver",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface User {
  _id: string;
  email: string;
  name?: string;
  role: UserRoleType;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Truck {
  _id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  status: "available" | "in_use" | "maintenance" | "out_of_service";
  createdAt: string;
  updatedAt: string;
}

export interface Trailer {
  _id: string;
  licensePlate: string;
  type: string;
  capacity: number;
  status: "available" | "in_use" | "maintenance" | "out_of_service";
  createdAt: string;
  updatedAt: string;
}

export interface Tire {
  _id: string;
  serialNumber: string;
  brand: string;
  model: string;
  position: "front_left" | "front_right" | "rear_left" | "rear_right" | "spare";
  truckId?: string;
  trailerId?: string;
  installationDate: string;
  mileageAtInstallation: number;
  currentMileage: number;
  wearLevel: number;
  status: "new" | "good" | "worn" | "critical" | "replaced";
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  _id: string;
  tripNumber: string;
  driverId: string | { _id: string; userId: string; licenseNumber: string };
  truckId: string | { _id: string; licensePlate: string; brand: string; model: string };
  trailerId?: string | { _id: string; licensePlate: string; type: string };
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  mileageStart: number;
  mileageEnd?: number;
  fuelConsumption?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Fuel {
  _id: string;
  truckId: string;
  tripId?: string;
  date: string;
  volume: number;
  cost: number;
  mileage: number;
  station?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  _id: string;
  type: "oil_change" | "tire_replacement" | "inspection" | "repair" | "other";
  truckId?: string;
  trailerId?: string;
  tireId?: string;
  scheduledDate: string;
  completedDate?: string;
  mileage: number;
  cost?: number;
  description: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  technician?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  _id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  phoneNumber: string;
  address?: string;
  hireDate: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

