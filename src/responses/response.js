
import LogErrorHelper from '../helpers/logerror-helper';

class  Response{
    static Success(res,data = [],message = 'success'){
        return res.send({
            message:message,
            status:"success",
            data:data
        })
    }
    static SuccessMessage(res,message = 'success',status = "success"){
        
        return res.send({
            message:message,
            status:status,
            data:{}
        })
    }
    static Error(req,res,message,withLog = false){
        if(withLog){
            LogErrorHelper.set(req,message);
            message = 'Something wrong on the server';
        }
        return res.send({
            message:message,
            status:"error",
        })
    }
}

module.exports = Response