// Mock des dépendances (doit être avant les imports)
import { jest } from '@jest/globals';

jest.mock("../../models/trip.model.ts");
jest.mock("../../models/truck.model.ts");
jest.mock("../../models/driver.model.ts");

import tripService from "../trip.service.ts";
import Trip from "../../models/trip.model.ts";
import Truck from "../../models/truck.model.ts";
import Driver from "../../models/driver.model.ts";
import { AppError } from "../../middleware/error.middleware.ts";

describe("TripService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTrip", () => {
    it("should create a trip successfully", async () => {
      const mockTruck = { _id: "truck123", status: "available" };
      const mockDriver = { _id: "driver123" };
      const mockTrip = {
        _id: "trip123",
        tripNumber: "TRIP-000001",
        save: jest.fn().mockResolvedValue(true),
      };

      (Truck.findById as jest.Mock).mockResolvedValue(mockTruck);
      (Driver.findById as jest.Mock).mockResolvedValue(mockDriver);
      (Trip.countDocuments as jest.Mock).mockResolvedValue(0);
      (Trip as any).mockImplementation(() => mockTrip);
      (Truck.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTruck);

      const result = await tripService.createTrip({
        driverId: "driver123" as any,
        truckId: "truck123" as any,
        origin: "Paris",
        destination: "Lyon",
        departureDate: new Date(),
        mileageStart: 10000,
      });

      expect(result).toBe(mockTrip);
      expect(Truck.findByIdAndUpdate).toHaveBeenCalledWith("truck123", {
        status: "in_use",
      });
    });

    it("should throw error if truck not found", async () => {
      (Truck.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        tripService.createTrip({
          driverId: "driver123" as any,
          truckId: "invalid" as any,
          origin: "Paris",
          destination: "Lyon",
          departureDate: new Date(),
          mileageStart: 10000,
        })
      ).rejects.toThrow("Truck not found");
    });

    it("should throw error if driver not found", async () => {
      const mockTruck = { _id: "truck123" };
      (Truck.findById as jest.Mock).mockResolvedValue(mockTruck);
      (Driver.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        tripService.createTrip({
          driverId: "invalid" as any,
          truckId: "truck123" as any,
          origin: "Paris",
          destination: "Lyon",
          departureDate: new Date(),
          mileageStart: 10000,
        })
      ).rejects.toThrow("Driver not found");
    });
  });

  describe("getAllTrips", () => {
    it("should return all trips with populated data", async () => {
      const mockTrips = [
        { _id: "trip1", tripNumber: "TRIP-000001" },
        { _id: "trip2", tripNumber: "TRIP-000002" },
      ];

      (Trip.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockTrips),
            }),
          }),
        }),
      });

      const result = await tripService.getAllTrips();

      expect(result).toEqual(mockTrips);
    });
  });

  describe("getTripById", () => {
    it("should return a trip by id", async () => {
      const mockTrip = {
        _id: "trip123",
        tripNumber: "TRIP-000001",
      };

      (Trip.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockTrip),
          } as any),
        } as any),
      } as any);

      const result = await tripService.getTripById("trip123");

      expect(result).toEqual(mockTrip);
    });

    it("should throw error if trip not found", async () => {
      (Trip.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
          } as any),
        } as any),
      } as any);

      await expect(tripService.getTripById("invalid")).rejects.toThrow(
        "Trip not found"
      );
    });
  });
});
