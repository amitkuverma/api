import express, { Application } from 'express';
import bodyParser from 'body-parser';
import corsMiddleware from './middlewares/cors';
import userRoutes from './routes/user.routes';
import otpRoutes from './routes/otp.routes';
import { setupSwagger } from './config/swagger';
import paymentRouter from './routes/payment.routes';
import accRouter from './routes/account.routes';

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(corsMiddleware);

// Routes
app.use('/api', userRoutes, otpRoutes, paymentRouter, accRouter);

// Swagger Docs
setupSwagger(app);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running');
});
// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
