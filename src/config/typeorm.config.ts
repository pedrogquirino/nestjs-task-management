import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'doit',
    password: 'doit',
    database: 'taskmanagement',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //entities: [path.resolve(__dirname, '..', '**', '*.enitity.ts')],
    synchronize: true,
}