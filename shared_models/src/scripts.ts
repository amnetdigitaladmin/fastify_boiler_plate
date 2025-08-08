import { AppDataSource } from './data-source';

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database schema synchronized successfully.');
  })
  .catch((error: any) => {
    console.error('❌ Error during schema synchronization:', error);
    process.exit(1);
  });
