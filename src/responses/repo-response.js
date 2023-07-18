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
    static Error(message = 'error'){
         return {
            message:message,
            success:false
        }
    }
}

module.exports = ResponseRepo