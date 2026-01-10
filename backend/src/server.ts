import express from "express";
import Connection from "./connection.ts";
import dotenv from "dotenv";
import authRouter from "./auth.router.ts";
import truckRoutes from "./routes/truck.routes.ts";
import tripRoutes from "./routes/trip.routes.ts";
import { errorHandler } from "./middleware/error.middleware.ts";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/fdc";
new Connection(mongoUrl);

// Routes
app.get('/', (req, res) => {
    res.send('Fleet Management System API');
});

// Auth routes
app.use('/api/auth', authRouter);

// Resource routes
app.use('/api/trucks', truckRoutes);
app.use('/api/trips', tripRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});