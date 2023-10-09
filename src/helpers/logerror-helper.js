import Database from "../config/database";
import DateHelper from "./date-helper";

export default class LogErrorHelper {
    static async set(req,message){
        let dataBody = "";
        if(req.body){
            dataBody = JSON.stringify(req.body);
        }
        let data = {
            created_at:DateHelper.dateTimeNow(),
            message:message,
            endpoint:req.originalUrl,
            post_data:dataBody,
            created_by:''
        }
        if(req.auth){
            data.created_by = req.auth.employee_id;
        }
        await Database.conn('INSERT INTO log_error SET ?',data);
    }
    static async setDb(error){
        
        let data = {
            created_at:DateHelper.dateTimeNow(),
            message:error,
            endpoint:'Database',
            created_by:''
        }
        await Database.conn('INSERT INTO log_error SET ?',data);
    }
}