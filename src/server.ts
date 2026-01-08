import 'reflect-metadata';
import { AppDataSource } from './config/datasource';
import { env } from './config/env';
import app from './app';
import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../', env.upload.dir);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    
    // Start server
    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
      console.log(`API Documentation: http://localhost:${env.port}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Error during database initialization:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await AppDataSource.destroy();
  process.exit(0);
});
