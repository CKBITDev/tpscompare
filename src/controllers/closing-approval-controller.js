import Response from '../responses/response';
import ClosingApprovalRepository from '../repositories/closing-approval-repository';
import OvertimeRepository from '../repositories/overtime-repositoy';
import DateHelper from '../helpers/date-helper';
export default class ClosingApprovalController{
    
    static async list(req,res){
        try {
            let dataBody = req.body;
            dataBody.employee_id = req.auth.employee_id;
            let data = await ClosingApprovalRepository.data(req,dataBody);       
            return Response.Success(res,data.data);
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
    }
    static async getCostStatus(req,res){
      try {
        let data = await ClosingApprovalRepository.costStatus(req);       
        return Response.Success(res,data.data);
      } catch (error) {
        return Response.Error(req,res,error.message,true);
      }
    }
    static async approve(req,res){
      try {
        let dataBody = req.body;
        dataBody.employee_id = req.auth.employee_id;
        dataBody.id_over_time = dataBody.id_overtime;
  
        var dataOt = await OvertimeRepository.dataOvertimeById(req,dataBody);
        if(!dataOt){
            return Response.Error(req,res,`overtime id not found`);
        }
        dataOt = dataOt.data;
        let settlStartTime = dataBody.DateFrom + " " + dataBody.TimeFrom;
        let settlEndTime = dataBody.DateTo + " " + dataBody.TimeTo;
        
        const total_jam = new Date(`${dataBody.DateFrom} ${dataBody.TimeFrom}`).getTime() - new Date(`${dataBody.DateTo} ${dataBody.TimeTo}`).getTime();
        const total_jam_diff = Math.abs(total_jam / (1000 * 60 * 60));
  
        //const total_jam_shift = new Date(`${dataBody.TimeStart}`).getTime() - new Date(`${dataBody.TimeEnd}`).getTime();
        //const total_jam_shft_diff = Math.abs(total_jam_shift / (1000 * 60 * 60));
  
  
        let settlShifttimestart = DateHelper.dateTimeNow() + " " + dataBody.TimeStart;
        let settlShifttimeend = DateHelper.dateTimeNow() + " " + dataBody.TimeEnd;
  
        if(dataBody.TimeStart > dataBody.TimeEnd){
          let dateSettEnd = DateHelper.increaseDayDate(DateHelper.dateNow(),1); 
          settlShifttimeend = dateSettEnd + " " + dataBody.TimeEnd;
        }
        
        if(dataBody.ShiftType == 0){
          settlShifttimestart = null;
          settlShifttimeend = null;
          if(dataOt.over_daytype == 0){
            if(dataBody.TimeFrom <= dataBody.TimeEnd){
              return Response.Error(req,res,"Transaksi gagal diproses, minimal Time From OT 15 menit setelah jam kerja berakhir");
            }
          } 
          
        }
        if(total_jam_diff < 1){
          return Response.Error(req,res,"Transaksi gagal di proses, karena jam over time anda tidak sesuai aturan yang disepakati, min 1 jam");
        }
  
  
        if(settlStartTime > settlEndTime){
          let dateSettEnd = DateHelper.increaseDayDate(dataBody.DateTo,1); 
          settlEndTime = dateSettEnd + " " + dataBody.TimeTo;
        }
        let costStatusId = 1;
        if(dataBody.cost_status_id){
          costStatusId = dataBody.cost_status_id;
        }
        let dataDb = {
          settl_appv_spr: 1,
          cost_status: costStatusId,
          closing_remarks: dataBody.cost_remark,
          settl_start_time: settlStartTime,
          settl_end_time: settlEndTime,
          settl_shifttimestart: settlShifttimestart,
          settl_shifttimeend: settlShifttimeend,
          settl_shift: dataBody.ShiftType,
          update_by: req.auth.employee_id,
          update_datetime:DateHelper.dateTimeNowJoin() ,
        }
        if(dataBody.work_type){
          dataDb.worktype_code =  dataBody.work_type;
        
        } 
  
        await OvertimeRepository.updateOvertime(req,dataDb,{id_over_time:dataBody.id_over_time});
  
        const dataOtHistory = {
            over_guid:dataOt.over_guid,
            otStatus:"APPROVED 2",
            created_by:req.auth.user_id,
            created_datetime:DateHelper.dateTimeNowJoin(),
        }
  
        await OvertimeRepository.insertOtHistory(req,dataOtHistory);
        return Response.SuccessMessage(res,`Transaksi berhasil di Approved, data Over Time sudah terkirim ke department HRD untuk di validasi Terimkasih`);
     
  
      
      } catch (error) {
        return Response.Error(req,res,error.message,true);
      }
    }
    static async approveMultiple(req,res){
      try{
        const dataBody = req.body;
        let idOvertime = dataBody.id_overtime.split(",");
        var response;
        for (let index = 0; index < idOvertime.length; index++) {
            const id_overtime = idOvertime[index];   
            var ot = await OvertimeRepository.dataOvertimeById(req,{id_over_time:id_overtime});
            ot = ot.data;
            // if(ot.appv_spr == 1){
            //   return Response.Error(req,res,`overtime tidak di temukan`);
            // }
            var dataOt = {
              settl_appv_spr: 1,
              cost_status: 1,
              update_by: req.auth.employee_id,
              update_datetime: DateHelper.dateTimeNowJoin(),
            };
            var dataOtHistory = {    
              over_guid : ot.over_guid,               
              otStatus : 'APPROVED 2',
              created_by : req.auth.employee_id,
              created_datetime : DateHelper.dateTimeNowJoin()
            }

            await OvertimeRepository.updateOvertime(req,dataOt,{id_over_time:id_overtime});
            await OvertimeRepository.insertOtHistory(req,dataOtHistory);  
        } 
          return Response.SuccessMessage(res,"Transaksi berhasil di Approved, data Over Time sudah terkirim ke department HRD untuk di validasi Terimkasih");
      
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
        return Response.SuccessMessage(res,"Transaksi berhasil di reject");
        
      } catch (error) {
          return Response.Error(req,res,error.message,true);
      }
    }

    
}