import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "@dineshReddyPadala/shared_models";
import { userSessions } from '../models/schemas/user-sessions';
import { Role } from '../models/schemas/role'
dotenv.config();


let AppDataSource: any;
let retries: number = 5;
while (retries) {
    try {
        AppDataSource = new DataSource({
            type: "postgres",
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT!),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            synchronize: true,
            logging: false,
            entities: [ User, userSessions,Role]
            //entities: [ User,userSessions, ImportEntity, Role, Request, Notifications, AMC, Category, SubCategory, Workflow]
        });
        AppDataSource.initialize()
            .then(() => {
                console.log("Database Connection Established");
            })
            .catch((error: any) => console.log(error));
        retries = 0;
    } catch (error) {
        console.log('Postgres trying to reconnect : ', retries, 'Error :', error);
        retries -= 1;
        AppDataSource = undefined;
        new Promise(res => setTimeout(res, 500));
    }
}


export default AppDataSource;