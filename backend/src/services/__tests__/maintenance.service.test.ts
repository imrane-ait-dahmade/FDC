// Mock des dépendances (doit être avant les imports)
import { jest } from '@jest/globals';

jest.mock("../../models/maintenance.model.ts");
jest.mock("../../models/truck.model.ts");

import maintenanceService from "../maintenance.service.ts";
import Maintenance from "../../models/maintenance.model.ts";
import Truck from "../../models/truck.model.ts";
import { AppError } from "../../middleware/error.middleware.ts";

describe("MaintenanceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createMaintenance", () => {
    it("should create maintenance successfully", async () => {
      const mockTruck = { _id: "truck123" };
      const mockMaintenance = {
        _id: "maintenance123",
        type: "oil_change",
        save: jest.fn().mockResolvedValue(true),
      };

      (Truck.findById as jest.Mock).mockResolvedValue(mockTruck);
      (Maintenance as any).mockImplementation(() => mockMaintenance);

      const result = await maintenanceService.createMaintenance({
        type: "oil_change",
        truckId: "truck123" as any,
        scheduledDate: new Date(),
        mileage: 10000,
        description: "Vidange moteur",
      });

      expect(result).toBe(mockMaintenance);
      expect(mockMaintenance.save).toHaveBeenCalled();
    });

    it("should throw error if neither truckId nor trailerId provided", async () => {
      await expect(
        maintenanceService.createMaintenance({
          type: "oil_change",
          scheduledDate: new Date(),
          mileage: 10000,
          description: "Vidange",
        })
      ).rejects.toThrow("Either truckId or trailerId must be provided");
    });

    it("should throw error if truck not found", async () => {
      (Truck.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        maintenanceService.createMaintenance({
          type: "oil_change",
          truckId: "invalid" as any,
          scheduledDate: new Date(),
          mileage: 10000,
          description: "Vidange",
        })
      ).rejects.toThrow("Truck not found");
    });
  });

  describe("getAllMaintenances", () => {
    it("should return all maintenances", async () => {
      const mockMaintenances = [
        { _id: "maint1", type: "oil_change" },
        { _id: "maint2", type: "inspection" },
      ];

      (Maintenance.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockMaintenances),
            }),
          }),
        }),
      });

      const result = await maintenanceService.getAllMaintenances();

      expect(result).toEqual(mockMaintenances);
    });
  });

  describe("updateMaintenanceStatus", () => {
    it("should update status to completed with automatic completedDate", async () => {
      const mockMaintenance = {
        _id: "maint123",
        status: "completed",
        completedDate: new Date(),
      };

      (Maintenance.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockMaintenance),
          }),
        }),
      });

      const result = await maintenanceService.updateMaintenanceStatus(
        "maint123",
        "completed"
      );

      expect(result).toEqual(mockMaintenance);
    });
  });
});
