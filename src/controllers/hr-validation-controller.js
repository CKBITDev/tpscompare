import Response from '../responses/response';
import HrValidationRepository from '../repositories/hr-validation-repository';
import OvertimeRepository from '../repositories/overtime-repositoy';
import DateHelper from '../helpers/date-helper';
export default class HrValidationController{
  
  static async list(req,res){
      try {
          let dataBody = req.body;
          if(!req.body.offset){
            dataBody.offset = 0;
          }
          dataBody.employee_id = req.auth.employee_id;
          let data = await HrValidationRepository.data(req,dataBody);       
          return Response.Success(res,data.data);
        } catch (error) {
          return Response.Error(req,res,error.message,true);
        }
      
  }

  static async  approve(req,res){
    try{
      const dataBody = req.body;
      let idOvertime = dataBody.id_overtime.split(",");
      var response;
      for (let index = 0; index < idOvertime.length; index++) {
          const id_overtime = idOvertime[index];   
          var ot = await OvertimeRepository.dataOvertimeById(req,{id_over_time:id_overtime});
          ot = ot.data;
          var dataOt = {
            settl_appv_hr: 1,
            settl_appv_hr_uid: req.auth.employee_id,
            settl_appv_hr_name:ot.settl_appv_hr_name,
            update_by: req.auth.employee_id,
            update_datetime: DateHelper.dateTimeNowJoin(),
          };
          var dataOtHistory = {    
            over_guid : ot.over_guid,               
            otStatus : 'VALIDATION',
            created_by : req.auth.employee_id,
            created_datetime : DateHelper.dateTimeNowJoin()
          }

          response = await OvertimeRepository.updateOvertime(req,dataOt,{id_over_time:id_overtime});
          await OvertimeRepository.insertOtHistory(req,dataOtHistory);  
      } 
        return Response.SuccessMessage(res,"Transaksi berhasil di Approved");
    
    } catch (error) {
        return Response.Error(req,res,error.message,true);
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
          // if(ot.appv_spr == 1){
          //   return Response.Error(req,res,`Transaksi gagal di reject, data ini sudah di approved oleh ${ot.req_spr_name} atasan anda`);
          // }
          var dataOt = {
            settl_appv_spr: 2,
            flag_rejected_appv2: 1,
            appv_spr_rejectnote : dataBody.reject_note,
            update_by: req.auth.employee_id,
            update_datetime: DateHelper.dateTimeNowJoin(),
          };
          var dataOtHistory = {    
            over_guid : ot.over_guid,               
            otStatus : 'REJECT 2',
            created_by : req.auth.employee_id,
            created_datetime : DateHelper.dateTimeNowJoin()
          }

          response = await OvertimeRepository.updateOvertime(req,dataOt,{id_over_time:id_overtime});
          await OvertimeRepository.insertOtHistory(req,dataOtHistory);  
      }
      return Response.SuccessMessage(res,"Transaksi berhasil di Rejected");
      
    } catch (error) {
        return Response.Error(req,res,error.message,true);
    }
  }

    
}