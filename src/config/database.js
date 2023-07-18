require('dotenv').config()
import { createConnection } from 'mysql';

export default class Database{
    static async conn(query,dataParam = ''){
        var databaseName = "";
        var username = "";
        var password = "";
        var host = "";

        switch (process.env.NODE_ENV) {
            case "production":
                databaseName = process.env.DB_NAME;
                username = process.env.DB_USER;
                password = process.env.DB_PASSWORD;
                host = process.env.DB_HOST;
                break;
            case "development":
                databaseName = process.env.DB_NAME_DEV;
                username = process.env.DB_USER_DEV;
                password = process.env.DB_PASSWORD_DEV;
                host = process.env.DB_HOST_DEV;
                break;
            case "testing":
                databaseName = process.env.DB_NAME_TESTING;
                username = process.env.DB_USER_TESTING;
                password = process.env.DB_PASSWORD_TESTING;
                host = process.env.DB_HOST_TESTING;
                break;
            default:
                break;
        }
        const configDb =  {
            host: host,
            user: username,
            password: password,
            database: databaseName,
            options: {
                encrypt: false,
                trustServerCertificate: false
                
            },
            multipleStatements: true,
            timezone: 'Asia/Jakarta'
        };
        var connection = createConnection(configDb);
        connection.connect();
        
        if(dataParam){
            return new Promise((resolve, reject) => {
                connection.query(query,dataParam, function (err, data) {
                    if (err) reject(err);

                    var dataRes =JSON.stringify(data);
                    dataRes = JSON.parse(dataRes);
                    resolve(dataRes);
                });
            }) 
        }else{

            return new Promise((resolve, reject) => {
                connection.query(query, function (err, data) {
                    if (err) reject(err);
                    
                    var dataRes =JSON.stringify(data);
                    dataRes = JSON.parse(dataRes);
                    resolve(dataRes);
                });
            }) 
        }  
        

            
    }
}