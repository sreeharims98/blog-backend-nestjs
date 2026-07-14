import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';

config();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['db/migrations/*.ts'],
  synchronize: false,
  seeds: [(__dirname + '/seeds/main.seeder{.ts,.js}').replace(/\\/g, '/')],
  factories: [(__dirname + '/seeds/**/*.factory{.ts,.js}').replace(/\\/g, '/')],
};

export default new DataSource(options);
