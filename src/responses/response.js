
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
    static Error(req,res,error,withLog = false){
        var message = 'Something wrong on the server';
        if(withLog){
            LogErrorHelper.set(req,error);
        }else{
            message = error.message;
        }
        return res.send({
            message:message,
            status:"error",
        })
    }
}

module.exports = Response