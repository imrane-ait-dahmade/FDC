import request from "supertest";
import express from "express";
import authRouter from "../../auth.router.ts";

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("Auth API Integration Tests", () => {
  describe("POST /api/auth/register", () => {
    it("should return 400 for missing email", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          password: "password123",
        })
        .expect(400);
    });

    it("should return 400 for missing password", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
        })
        .expect(400);
    });

    it("should return 400 for invalid email format", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "password123",
        })
        .expect(400);
    });

    it("should return 400 for password too short", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "12345",
        })
        .expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 400 for missing email", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({
          password: "password123",
        })
        .expect(400);
    });

    it("should return 400 for missing password", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        })
        .expect(400);
    });
  });
});
