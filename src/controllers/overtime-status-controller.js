import Response from '../responses/response';
import OvertimeStatusRepository from '../repositories/overtime-status-repositoy';

export default class OvertimeStatusController{
    
    static async list(req,res){
        try {
            var dataBody = req.body;
            if(!req.body.offset){
              dataBody.offset = 0;
            }
            dataBody.user_id = req.auth.user_id;
            let data = await OvertimeStatusRepository.dataOvertime(req,dataBody);       
            return Response.Success(res,data.data);
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
        
    }

    
}