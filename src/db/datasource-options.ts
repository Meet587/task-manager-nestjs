import { UserEntity } from 'src/db/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TasksEntity } from 'src/db/entities/task.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  entities: [UserEntity, TasksEntity],
  logging: true,
  synchronize: true,
};

export default new DataSource(dataSourceOptions);
