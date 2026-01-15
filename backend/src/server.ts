import express from "express";
import Connection from "./connection.ts";
import dotenv from "dotenv";
import authRouter from "./auth.router.ts";
import truckRoutes from "./routes/truck.routes.ts";
import tripRoutes from "./routes/trip.routes.ts";
import driverRoutes from "./routes/driver.routes.ts";
import maintenanceRoutes from "./routes/maintenance.routes.ts";
import { errorHandler } from "./middleware/error.middleware.ts";

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware (remove in production)
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const contentType = req.headers['content-type'];
        console.log('Method:', req.method);
        console.log('Path:', req.path);
        console.log('Content-Type:', contentType);
        console.log('Request body:', req.body);
        
        // Warn if multipart/form-data is used (not parsed by express.json/urlencoded)
        if (contentType && contentType.includes('multipart/form-data')) {
            console.warn('⚠️  WARNING: multipart/form-data detected. Use application/json for API requests.');
        }
    }
    next();
});

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

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
app.use('/api/drivers', driverRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});