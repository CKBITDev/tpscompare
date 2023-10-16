
import { createPool } from 'mysql';
import {NODE_ENV,
DB_NAME,
DB_USER,
DB_PASSWORD,
DB_HOST,
DB_NAME_DEV,
DB_USER_DEV,
DB_PASSWORD_DEV,
DB_HOST_DEV,
DB_NAME_TESTING,
DB_USER_TESTING,
DB_PASSWORD_TESTING,
DB_HOST_TESTING} from "@env"
import Logger from '../utils/logger';

let pool;
export const databaseInit = () => {
    var databaseName = "";
        var username = "";
        var password = "";
        var host = "";
        try{

            switch (NODE_ENV) {
                case "production":
                    databaseName = DB_NAME;
                    username = DB_USER;
                    password = DB_PASSWORD;
                    host = DB_HOST;
                    break;
                case "development":
                    databaseName = DB_NAME_DEV;
                    username = DB_USER_DEV;
                    password = DB_PASSWORD_DEV;
                    host = DB_HOST_DEV;
                    break;
                case "testing":
                    databaseName = DB_NAME_TESTING;
                    username = DB_USER_TESTING;
                    password = DB_PASSWORD_TESTING;
                    host = DB_HOST_TESTING;
                    break;
                default:
                    break;
            }
            const configDb =  {
                host: host,
                user: username,
                password: password,
                database: databaseName,
                connectionLimit:0,
                multipleStatements: true,
                timezone: 'Asia/Jakarta'
            };
            console.log(configDb)

            pool = createPool(configDb);

        }catch(error){
            Logger.createLog(error.message)
        }
        
};

        

export const executeQuery = (query, params = []) => {
    try {
        if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');
        return new Promise((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error){ 
                    reject(error)
                }else {
                    var dataString =JSON.stringify(results);
                    var res =  JSON.parse(dataString);
                    resolve(res);
                }
            });
        });
    } catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
}