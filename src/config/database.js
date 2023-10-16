
import { createConnection } from 'mysql';
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


export default class Database{
    static async conn(query,dataParam = ''){
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
            var connection = createConnection(configDb);
            connection.connect();
            
            if(dataParam){
                return new Promise((resolve, reject) => {
                    connection.query(query,dataParam, function (err, data) {
                        // Close the MySQL connection
                        connection.end((error) => {
                            if (error) {
                            console.error('Error closing MySQL connection:', error);
                            return;
                            }
                            //console.log('MySQL connection closed.');
                        });
                        if (err){
                            reject(err);
                        } else{
                            var dataRes =JSON.stringify(data);
                            dataRes = JSON.parse(dataRes);
                            resolve(dataRes);
                        }
    
                    });
                }) 
            }else{
    
                return new Promise((resolve, reject) => {
                    connection.query(query, function (err, data) {
                        // Close the MySQL connection
                        connection.end((error) => {
                            if (error) {
                            console.error('Error closing MySQL connection:', error);
                            return;
                            }
                            //console.log('MySQL connection closed.');
                        });
                        if (err){
                            reject(err);
                        } else{
    
                            var dataRes =JSON.stringify(data);
                            dataRes = JSON.parse(dataRes);
                            resolve(dataRes);
                        }
                        
                    });
                }) 
            }  
        }catch(error){
            Logger.createLog(error.message)
        }

        

            
    }
}