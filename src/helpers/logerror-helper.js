import Database from "../config/database";
import DateHelper from "./date-helper";

export default class LogErrorHelper {
    static async set(req,message,query = "",className = "",functionName = ""){
        
        let data = {
            created_at:DateHelper.dateTimeNow(),
            message:message,
            query:query,
            function_name:functionName,
            class_name:className,
            endpoint:req.originalUrl
        }
        if(req.auth){
            data.created_by = req.auth.employee_id;
        }
        await Database.conn('INSERT INTO log_error SET ?',data);
    }
}