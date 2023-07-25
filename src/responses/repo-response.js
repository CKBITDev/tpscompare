const { default: LogErrorHelper } = require("../helpers/logerror-helper");

class  ResponseRepo{
    constructor(){

    }
    static Success(data = [],message = 'success'){
        return {
            message:message,
            success:true,
            data:data,
        }
    }
    static NoData(){
        return {
            message:"No Data",
            success:false,
        }
    }
    
    static Error(req,error,message = 'Something wrong on the server'){
        LogErrorHelper.set(req,error);
        return {
            message:message,
            success:false
        }
    }
}

module.exports = ResponseRepo