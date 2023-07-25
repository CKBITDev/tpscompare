import Database from "../config/database";
import DateHelper from "./date-helper";

export default class LogErrorHelper {
    static async set(req,error){
        let data = {
            created_at:DateHelper.dateTimeNow(),
            message:error.message,
            endpoint:req.originalUrl,
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