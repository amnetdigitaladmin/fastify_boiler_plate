// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from './models/user'; // import all entities here
import { userSessions } from './models/user-sessions';
import { Role } from './models/role';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'common_models',
  synchronize: true, // auto-create tables (disable in prod)
  logging: false,
  entities: [User,userSessions,Role],
});
