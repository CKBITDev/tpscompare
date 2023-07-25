import Response from '../responses/response';
import ApprovalOvertimeRepository from '../repositories/approval-overtime-repository';
import OvertimeRepository from '../repositories/overtime-repositoy';
import DateHelper from '../helpers/date-helper';

export default class ApprovalOvertimeController{
    
    static async list(req,res){
        try {
            let dataBody = req.body;
            dataBody.employee_id = req.auth.employee_id;
            let data = await ApprovalOvertimeRepository.data(req,dataBody);       
            return Response.Success(res,data.data);
          } catch (error) {
            return Response.Error(req,res,error,true);
          }
        
    }
    static async approve(req,res){
      try{
        const dataBody = req.body;
        let idOvertime = dataBody.id_overtime.split(",");
        var response;
        for (let index = 0; index < idOvertime.length; index++) {
            const id_overtime = idOvertime[index];   
            var ot = await OvertimeRepository.dataOvertimeById(req,{id_over_time:id_overtime});
            ot = ot.data;
            if(ot.appv_spr == 1){
              return Response.Error(req,res,`Transaksi gagal di proses, data ini sudah di approved oleh ${ot.req_spr_name}`);
            }
            var dataOt = {
              appv_spr:1,
              appv_spr_uid:req.auth.employee_id,
              appv_spr_name:ot.req_spr_name,
              update_by:req.auth.employee_id,
              update_datetime:DateHelper.dateTimeNowJoin(),
            };
            var dataOtHistory = {    
              over_guid : ot.over_guid,               
              otStatus : 'APPROVED 1',
              created_by : req.auth.employee_id,
              created_datetime : DateHelper.dateTimeNowJoin()
            }

            response = await OvertimeRepository.updateOvertime(req,dataOt,{id_over_time:id_overtime});
            await OvertimeRepository.insertOtHistory(req,dataOtHistory);
            
        }
          return Response.SuccessMessage(res,"Data berhasil di Approve");
        
    } catch (error) {
        return Response.Error(req,res,error,true);
    }
    }

    static async reject(req,res){
      try{
        const dataBody = req.body;
        let idOvertime = dataBody.id_overtime.split(",");
        var response;
        for (let index = 0; index < idOvertime.length; index++) {
            const id_overtime = idOvertime[index];   
            var ot = await OvertimeRepository.dataOvertimeById(req,{id_over_time:id_overtime});
            ot = ot.data;
            if(ot.appv_spr == 1){
              return Response.Error(req,res,`Transaksi gagal di reject, data ini sudah di approved oleh  ${ot.req_spr_name}`);
            }
            var dataOt = {
              appv_spr: 2,
              flag_rejected_appv1 : 1,
              appv_spr_uid:req.auth.employee_id,
              appv_spr_rejectnote:dataBody.reject_note,
              update_by:req.auth.employee_id,
              update_datetime:DateHelper.dateTimeNowJoin(),
            };
            var dataOtHistory = {    
              over_guid : ot.over_guid,               
              otStatus : 'REJECT 1',
              created_by : req.auth.employee_id,
              created_datetime : DateHelper.dateTimeNowJoin()
            }

            response = await OvertimeRepository.updateOvertime(req,dataOt,{id_over_time:id_overtime});
            await OvertimeRepository.insertOtHistory(req,dataOtHistory);  
        }
        if(response.success){    
            return Response.SuccessMessage(res,"Data berhasil di Reject");
        }else{
            return Response.Error(req,res,"Data gagal di Reject");
        }
    } catch (error) {
        return Response.Error(req,res,error,true);
    }
    }

    
}