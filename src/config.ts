import {util} from 'config';
import { join } from 'path';
export interface Config{
    server: serverConfig;
    database: databaseConfig;
}

export interface serverConfig {
    port: number;
    host: string;
}

export interface databaseConfig {
    port: number;
    host: string;
    db: string;
    username: string;
    password: string;
}

export const config = util.loadFileConfigs(join(__dirname, '..', 'config')) as Config;