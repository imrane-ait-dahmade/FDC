import authService from "../auth.service.ts";
import User from "../../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock des dépendances
jest.mock("../../models/user.model.ts");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        password: "hashedPassword",
        role: "driver",
        toObject: jest.fn(() => ({
          _id: "user123",
          email: "test@example.com",
          password: "hashedPassword",
          role: "driver",
        })),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      const result = await authService.Login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.token).toBe("mockToken");
      expect(result.user).not.toHaveProperty("password");
    });

    it("should throw error for invalid email", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.Login({
          email: "invalid@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error for invalid password", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        password: "hashedPassword",
        role: "driver",
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.Login({
          email: "test@example.com",
          password: "wrongPassword",
        })
      ).rejects.toThrow("Invalid email or password");
    });
  });

  describe("CreateUser", () => {
    it("should create a new user successfully", async () => {
      const mockUser = {
        _id: "user123",
        email: "new@example.com",
        password: "hashedPassword",
        role: "driver",
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn(() => ({
          _id: "user123",
          email: "new@example.com",
          password: "hashedPassword",
          role: "driver",
        })),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as any).mockImplementation(() => mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      const result = await authService.CreateUser({
        email: "new@example.com",
        password: "password123",
        name: "Test User",
        role: "driver",
      });

      expect(result).not.toHaveProperty("password");
      expect(result.email).toBe("new@example.com");
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("should throw error if user already exists", async () => {
      const existingUser = {
        _id: "user123",
        email: "existing@example.com",
      };

      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      await expect(
        authService.CreateUser({
          email: "existing@example.com",
          password: "password123",
        })
      ).rejects.toThrow("User with this email already exists");
    });
  });
});
