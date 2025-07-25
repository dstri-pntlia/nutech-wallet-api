import express from 'express';
import authRoutes from './src/routes/auth.route';
import profileRoutes from './src/routes/profile.route';
import bannerRoutes from './src/routes/banner.route';
import serviceRoutes from './src/routes/service.route';
import transactionRoutes from './src/routes/transaction.route';
import { errorMiddleware } from './src/middlewares/error.middleware';
import multer from 'multer';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Routes
app.use('/', authRoutes);
app.use('/profile', profileRoutes);
app.use('/banner', bannerRoutes);
app.use('/service', serviceRoutes);
app.use('/', transactionRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app;