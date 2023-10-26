import Response from '../responses/response';
import OvertimeRepository from '../repositories/overtime-repositoy';
import FunctionHelper from '../helpers/function-helper';
import DateHelper from '../helpers/date-helper';

export default class OvertimeController{
    
    static async hrValidation(req,res){
        try {

            let dataBody = {user_id:req.auth.user_id};
            
            var data = await OvertimeRepository.dataHrDivision(req,dataBody);      
            if(data){
                data = data.data;
                const levels = ['HCA', 'HSS', 'HRS', 'HRG','OHS'];
                if(levels.includes(data.id_div)){
                    return Response.SuccessMessage(res,"");
                }else{
                    return Response.Error(req,res,`Divisi anda adalah "${data.division}",Maaf menu ini hanya bisa diakses oleh Divisi (Human Capital,Asset Management,OHC Support , HR Support Service & HR & GA Business Partner), Terimkasih`);
                }
            }else{
                return Response.Error(req,res,`Divisi anda adalah "${req.auth.divisi}",Maaf menu ini hanya bisa diakses oleh Divisi (Human Capital,Asset Management,OHC Support , HR Support Service & HR & GA Business Partner), Terimkasih`);
            }
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
        
    }
    static async list(req,res){
        try {
            let dataBody = {employee_id:req.auth.employee_id,user_id:req.auth.user_id};
            let data = await OvertimeRepository.dataOvertime(req,dataBody);       
            return Response.Success(res,data.data);
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
        
    }

  
    static async approvalFlow(req,res){
        try {
            let dataBody = {employee_id:req.auth.employee_id};
            var data = await OvertimeRepository.dataApprovalFlow(req,dataBody);     
            return Response.Success(res,data.data);
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
    }

    static async workType(req,res){
        try {
            var data = await OvertimeRepository.dataWorktype(req);     
            return Response.Success(res,data.data);
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
    }

    static async cancelOT(req,res){
        try {

            let dataBody = req.body;
            var dataOtById = await OvertimeRepository.dataOvertimeById(req,dataBody);
            if(!dataOtById){
                return Response.Error(req,res,`overtime id not found`);
            }
            dataOtById = dataOtById.data;
            const guid = dataOtById.over_guid;
            const appvSpr = dataOtById.appv_spr;
            const settlAppvSpr = dataOtById.settl_appv_spr;
            const reqSprName = dataOtById.req_spr_name;
            const settleApvSprName = dataOtById.settl_appv_spr_name;
            if(appvSpr == 1){
                return Response.Error(req,res,`Transaksi gagal di delete, data ini sudah di approved oleh ${reqSprName}  atasan anda`);
            }else if(appvSpr == 2){
                return Response.Error(req,res,`Transaksi gagal di proses, data ini sudah di approved oleh ${reqSprName}  atasan anda`);
            }else if(settlAppvSpr == 2){
                return Response.Error(req,res,`Transaksi gagal di delete, data ini sudah di rejected settle oleh ${settleApvSprName} atasan anda`);
            }
            const dataOt = {
                is_deleted:1,
                update_by:req.auth.employee_id,
                update_datetime:DateHelper.dateTimeNowJoin(),
            }
            const dataOtHistory = {
                over_guid:guid,
                otStatus:"CANCELLED",
                created_by:req.auth.user_id,
                created_datetime:DateHelper.dateTimeNowJoin(),
            }
            await OvertimeRepository.updateOvertime(req,dataOt,{id_over_time:dataBody.id_over_time});
            await OvertimeRepository.insertOtHistory(req,dataOtHistory);
         
            return Response.SuccessMessage(res,`Transaksi berhasil di delete`);
         
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
    }

    static async updateData(req,res){
        try {

            let dataBody = req.body;
            dataBody.user_id = req.auth.user_id;
            //var validateOt = await OvertimeRepository.dataOvertimeByDate(req,dataBody);   
            
            if(dataBody.rdOptionApproval == "" || dataBody.rdOptionApproval == null){
                return Response.Error(req,res,`Silahkan pilih nama approval terlebih dahulu!!`); 
            }
            
            var dataEvent = await OvertimeRepository.dataHoliday(req,dataBody);
            var dataRequestReport = await OvertimeRepository.dataRequestReport(req,dataBody);   
            
            let userIdAtasan = '';
            let namaAtasan = '';
            let fullName = '';
            let emailAtasan = '';
            let holidayDescription = '';
            if(dataEvent){
                dataEvent = dataEvent.data;
                holidayDescription = dataEvent.holiday_description;
            }
            if(dataRequestReport){
                dataRequestReport = dataRequestReport.data;
                userIdAtasan = dataRequestReport.user_id;
                emailAtasan = dataRequestReport.email;
                fullName = dataRequestReport.full_name;
                namaAtasan = dataRequestReport.nama_atasan;
            }
            let dataOt = {
                req_to_jobtitleid:dataBody.rdOptionApproval,
                req_spr_uid:userIdAtasan,
                req_spr_name:namaAtasan,
                escalation_remark:dataBody.escRemarks,
                over_date:dataBody.over_date,
                over_daytype:dataBody.dayType,
                description:dataBody.description,
                update_by:req.auth.user_id,
                time_plan_from:dataBody.time_plan,
                time_plan_to:dataBody.time_plan_end,
                update_datetime:DateHelper.dateTimeNowJoin()
            }
            if(dataBody.work_type){
                dataOt.worktype_code = dataBody.work_type;
            }
            var dataOtById = await OvertimeRepository.dataOvertimeById(req,dataBody);
            if(!dataOtById){
                return Response.Error(req,res,`overtime id not found`);
            }
            dataOtById = dataOtById.data;
            const appvSpr = dataOtById.appv_spr;
            const settlAppvSpr = dataOtById.settl_appv_spr;
            const reqSprName = dataOtById.req_spr_name;
            const settleApvSprName = dataOtById.settl_appv_spr_name;
            if(appvSpr == 1){
                return Response.Error(req,res,`Transaksi gagal di proses, data ini sudah di approved oleh ${reqSprName}`);
            }else if(settlAppvSpr == 1){
                return Response.Error(req,res,`Transaksi gagal di proses, data ini sudah di approved settle oleh  ${settleApvSprName}`);
            }
            await OvertimeRepository.updateOvertime(req,dataOt,{id_over_time:dataBody.id_over_time});
            return Response.SuccessMessage(res,`Transaksi berhasil di simpan, data Over Time anda mengunggu approval atasan anda yaitu  ${namaAtasan}`);
         
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
    }

    static async createdData(req,res){
        try {

            let dataBody = req.body;
            dataBody.user_id = req.auth.user_id;
            var validateOt = await OvertimeRepository.dataOvertimeByDate(req,dataBody);   
            if(validateOt){
                return Response.Error(req,res,`Overtime anda untuk tanggal "${dataBody.over_date}" sudah terdaftar.`);
            }
            if(dataBody.rdOptionApproval == "" || dataBody.rdOptionApproval == null){
                return Response.Error(req,res,`Silahkan pilih nama approval terlebih dahulu!!`); 
            }
            var dataEvent = await OvertimeRepository.dataHoliday(req,dataBody);
            var dataRequestReport = await OvertimeRepository.dataRequestReport(req,dataBody);   
            
            let userIdAtasan = '';
            let namaAtasan = '';
            let fullName = '';
            let emailAtasan = '';
            let holidayDescription = '';
            if(dataEvent){
                dataEvent = dataEvent.data;
                holidayDescription = dataEvent.holiday_description;
            }
            if(dataRequestReport){
                dataRequestReport = dataRequestReport.data;
                userIdAtasan = dataRequestReport.user_id;
                emailAtasan = dataRequestReport.email;
                fullName = dataRequestReport.full_name;
                namaAtasan = dataRequestReport.nama_atasan;
            }
            let area_id = "";
            if(req.auth.area_id){
                area_id = req.auth.area_id;
            }else{
                const parseData = {employee_id:req.auth.employee_id};
                const areaData  = await OvertimeRepository.dataAreaByEmployeeId(req,parseData);
                if(areaData.success){
                    area_id = areaData.data.area_id;
                }
            }
            //dataOvertimeByDate = dataOvertimeByDate
            const guid = FunctionHelper.generateGuid('');
            const dataOt = {
                over_guid:guid,
                user_req_uid:req.auth.user_id,
                user_req_name:req.auth.fullname,
                user_dept:req.auth.department_id,
                user_div:req.auth.division_id,
                user_station:req.auth.station_id,
                user_company:req.auth.company_id,
                user_sap:req.auth.sap_id,
                user_area:area_id,
                user_jobtitleid:req.auth.job_title_detail_id,
                req_to_jobtitleid:dataBody.rdOptionApproval,

                req_spr_uid:userIdAtasan,
                req_spr_name:namaAtasan,
                escalation_remark:dataBody.escRemarks,
                over_date:dataBody.over_date,
                over_dateevent:holidayDescription,
                worktype_code:dataBody.work_type,
                over_daytype:dataBody.dayType,
                description:dataBody.description,
                created_by:req.auth.user_id,
                created_datetime:DateHelper.dateTimeNowJoin(),
                time_plan_from:dataBody.time_plan,
                time_plan_to:dataBody.time_plan_end,
            }
            const dataOtHistory = {
                over_guid:guid,
                otStatus:"NEW",
                created_by:req.auth.user_id,
                created_datetime:DateHelper.dateTimeNowJoin(),
            }

            await OvertimeRepository.insertOvertime(req,dataOt);
            await OvertimeRepository.insertOtHistory(req,dataOtHistory);
            
            return Response.SuccessMessage(res,`Transaksi berhasil di simpan, data Over Time anda mengunggu approval atasan anda yaitu ${namaAtasan}`);
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
    }
    
}