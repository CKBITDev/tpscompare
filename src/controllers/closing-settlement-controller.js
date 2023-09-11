import Response from '../responses/response';
import ClosingSettlementRepository from '../repositories/closing-settlement-repository';
import ParamRepository from '../repositories/param-repository';
import DateHelper from '../helpers/date-helper';
import OvertimeRepository from '../repositories/overtime-repositoy';

export default class ClosingSettlementController{
  
  static async list(req,res){
      try {
          let dataBody = req.body;
          dataBody.user_id = req.auth.user_id;
          let data = await ClosingSettlementRepository.data(req,dataBody);       
          return Response.Success(res,data.data);
        } catch (error) {
          return Response.Error(req,res,error.message,true);
        }
      
  }

  static async reject(req,res){
    try {
      var dataBody = req.body;
      dataBody.id_over_time = dataBody.id_overtime;
      var dataOt = await OvertimeRepository.dataOvertimeById(req,dataBody);
      if(!dataOt){
          return Response.Error(req,res,`overtime id not found`);
      }
      dataOt = dataOt.data;
      if(dataOt.appv_spr == 1){
        return Response.Error(req,res,`Transaksi gagal di reject, data ini sudah di approved oleh ${dataOt.settl_appv_spr_name} atasan anda`);
      }
      let dataDb = {
        settl_appv_hr:2,
        flag_rejected_appv2:1,
        appv_spr_rejectnote:dataBody.reject_note,
        update_by:req.auth.employee_id,
        update_datetime:DateHelper.dateTimeNowJoin(),
      }

      const dataOtHistory = {
        over_guid:dataOt.over_guid,
        otStatus:"REJECT 2",
        created_by:req.auth.user_id,
        created_datetime:DateHelper.dateTimeNowJoin(),
      }
      let response = await OvertimeRepository.updateOvertime(req,dataDb,{id_over_time:dataBody.id_overtime});
      await OvertimeRepository.insertOtHistory(req,dataOtHistory);
      return Response.SuccessMessage(res,`Transaksi berhasil di Rejected`);
       
    } catch (error) {
      return Response.Error(req,res,error.message,true);
    }
  }

  static async otParam(req,res){
      try {
          let dataBody = req.body;
          let paramId;
          if (dataBody.day_type === "Hari Kerja") {
            paramId = "MOT";
          } else {
            paramId = "MHO";
          }

          const DateFrom = dataBody.date_start;
          const DateTo = dataBody.date_end;
          const TimeFrom = dataBody.time_start;
          const TimeTo = dataBody.time_end;

          const dateTimeStart = new Date(`${DateFrom} ${TimeFrom}`).getTime() / 1000;
          const dateTimeTo = new Date(`${DateTo} ${TimeTo}`).getTime() / 1000;

          const total_jam = dateTimeTo - dateTimeStart;
          const hour = Math.abs(total_jam / 3600);
          
          var data = await ParamRepository.paramOvertime(paramId);
          const value = data.data;
      
          const limitHour = parseInt(value[0]);
          const uu = value[1];
          const message = value[2];

          let isLimit = false;
          if (hour > limitHour) {
            isLimit = true;
          }

          let resObj = {};
          if (isLimit) {
            resObj.message = message;
            resObj.diff_hour = hour.toString();
            resObj.limit_hour = limitHour;
            resObj.uu = uu;
            resObj.is_max_ot = true;
          } else {
            resObj.message = "";
            resObj.diff_hour = hour.toString();
            resObj.limit_hour = limitHour;
            resObj.uu = "";
            resObj.is_max_ot = false;
          }
          if (dateTimeStart > dateTimeTo) {
            return Response.Error(req,res,"Waktu mulai tidak bisa lebih dari waktu akhir");
          }       
          return Response.Success(res,resObj);
        } catch (error) {
          return Response.Error(req,res,error.message,true);
        }
      
  }
  static async updateClosing(req,res){
    try {
      let dataBody = req.body;
      dataBody.user_id = req.auth.user_id;
      if(dataBody.rdOptionApproval == "" || dataBody.rdOptionApproval == null){
        return Response.Error(req,res,`Silahkan pilih nama approval terlebih dahulu!!`); 
      }
      var dataRequestReport = await OvertimeRepository.dataRequestReport(req,dataBody); 
      dataRequestReport = dataRequestReport.data;  
      if(dataBody.TimeFrom < "17:30" && dataBody.ShiftType == "0"){
        return Response.Error(req,res,"Waktu mulai lembur harus lebih dari 17:30");
      }
      if((dataBody.DateFrom + " " + dataBody.TimeFrom) > (dataBody.DateTo + " " + dataBody.TimeTo)){
        return Response.Error(req,res,"Tanggal dan Waktu Mulai harus lebih kecil dibandingkan Tanggal dan Waktu Selesai");
      }

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
        // if(dataOt.over_daytype == 0){
        //   return Response.Error(req,res,"Transaksi gagal di proses, karena jam over time anda tidak sesuai aturan yang disepakati, min 1 jam");
        // } 
        if(dataBody.TimeFrom <= dataBody.TimeEnd){
          return Response.Error(req,res,"Transaksi gagal diproses, minimal Time From OT 15 menit setelah jam kerja berakhir");
        }
      }if(total_jam_diff < 1){
        return Response.Error(req,res,"Transaksi gagal di proses, karena jam over time anda tidak sesuai aturan yang disepakati, min 1 jam");
      }


      if(settlStartTime > settlEndTime){
        let dateSettEnd = DateHelper.increaseDayDate(dataBody.DateTo,1); 
        settlEndTime = dateSettEnd + " " + dataBody.TimeTo;
      }

      let dataDb = {
        settl_start_time: settlStartTime,
        settl_end_time:settlEndTime,
        settl_date:DateHelper.dateTimeNowJoin(),
        settl_shifttimestart:settlShifttimestart,
        settl_shifttimeend:settlShifttimeend,
        settl_shift:dataBody.ShiftType,
        settl_appv_spr:0,
        settl_appv_spr_uid:dataRequestReport.user_id,
        settl_appv_spr_name:dataRequestReport.nama_atasan,
        escalation_remark_closing:dataBody.escRemarks,
      } 

      await OvertimeRepository.updateOvertime(req,dataDb,{id_over_time:dataBody.id_over_time});

      const dataOtHistory = {
          over_guid:dataOt.over_guid,
          otStatus:"CLOSING",
          created_by:req.auth.user_id,
          created_datetime:DateHelper.dateTimeNowJoin(),
      }

      await OvertimeRepository.insertOtHistory(req,dataOtHistory);
      return Response.SuccessMessage(res,`Transaksi berhasil di simpan, data Closing Settlement anda menunggu approval atasan anda yaitu ${dataRequestReport.nama_atasan}`);
   

    
    } catch (error) {
      return Response.Error(req,res,error.message,true);
    }
  }

    
}