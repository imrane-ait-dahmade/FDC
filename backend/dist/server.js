// #region agent log
fetch('http://127.0.0.1:7242/ingest/80de9d51-90e9-4a6d-bb1b-2f9649dbb54b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'server.ts:1', message: 'Module resolution start', data: { imports: ['express', 'connection.js', 'dotenv', 'auth.router.js'] }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'A' }) }).catch(() => { });
// #endregion
import express from "express";
// #region agent log
fetch('http://127.0.0.1:7242/ingest/80de9d51-90e9-4a6d-bb1b-2f9649dbb54b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'server.ts:3', message: 'Before connection import', data: { extension: '.js' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'A' }) }).catch(() => { });
// #endregion
import Connection from "./connection.js";
// #region agent log
fetch('http://127.0.0.1:7242/ingest/80de9d51-90e9-4a6d-bb1b-2f9649dbb54b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'server.ts:5', message: 'Connection import successful', data: { connectionType: typeof Connection }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'A' }) }).catch(() => { });
// #endregion
import dotenv from "dotenv";
// #region agent log
fetch('http://127.0.0.1:7242/ingest/80de9d51-90e9-4a6d-bb1b-2f9649dbb54b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'server.ts:7', message: 'Before authRouter import', data: { extension: '.js' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'A' }) }).catch(() => { });
// #endregion
import authRouter from "./auth.router.js";
// #region agent log
fetch('http://127.0.0.1:7242/ingest/80de9d51-90e9-4a6d-bb1b-2f9649dbb54b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'server.ts:9', message: 'All imports successful', data: { moduleType: 'module' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'A' }) }).catch(() => { });
// #endregion
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
    res.send('hello world');
});
// Auth routes
app.use('/api/auth', authRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
