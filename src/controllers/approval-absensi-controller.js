import DateHelper from '../helpers/date-helper';
import AbsentRepository from '../repositories/absent-repositoy';
import ApprovalAbsentRepository from '../repositories/approval-absent-repositoy';
import Response from '../responses/response';

export default class ApprovalAbsensiController{

    static async viewApproval(req,res){
        try{
            let dataBody = req.body;
            const today = DateHelper.dateNow();
            const month = DateHelper.increaseMonthDateNow(-1);
            const employee_id = req.auth.employee_id;
            let employee_name = '';
            if(dataBody.employee_name){
                employee_name = dataBody.employee_name;    
            }
            let employee_name_like = "";
            if(employee_name != ""){
                employee_name_like = `AND EmployeeName LIKE '%${employee_name}%'`
            }
            var dataParam = {employee_id:employee_id,employee_name_like:employee_name_like,month:month}
            const data = await ApprovalAbsentRepository.getViewApproval(req,dataParam);
            return Response.Success(res,data.data);
        } catch (error) {
            return Response.Error(req,res,error.message,true);
        }
    }    
    static async rejectDataLate(req,res){
        try{
            const dataBody = req.body;
            let idAbsent = dataBody.IDAbsent.split(",");
            var response;
            for (let index = 0; index < idAbsent.length; index++) {
                const id_absent = idAbsent[index];   
                var data_absent = {
                    ApprovalStatus:2,
                    ApprovalDate:DateHelper.dateTimeNow()
                };
                response = await AbsentRepository.update(req,data_absent,{id_absent:idAbsent});   
            }
            if(response){
                if(response.success){
                    return Response.SuccessMessage(res,"Data berhasil di reject");
                }else{
                    return Response.Error(req,res,"Data gagal di reject");
                }    
            }else{
                return Response.Error(req,res,"Data gagal di reject");
            }
        } catch (error) {
            return Response.Error(req,res,error.message,true);
        }
    }
        
    static async approveDataLate(req,res){
        try{
            const dataBody = req.body;
            let idAbsent = dataBody.IDAbsent.split(",");
            var response;
            for (let index = 0; index < idAbsent.length; index++) {
                const id_absent = idAbsent[index];   
                var absent = await ApprovalAbsentRepository.getAbsentApprove(req,{id_absent:id_absent});
                if(absent){

                    absent = absent.data;
                    var data_absent = {
                        ApprovalStatus:1,
                        ApprovalDate:DateHelper.dateTimeNow(),
                    };
                    if(absent.TimeAbsent){
                        data_absent.TimeAbsent = absent.TimeAbsent;
                    }
                    if(absent.TimeAbsentOut){
                        data_absent.TimeAbsentOut = absent.TimeAbsentOut;
                    }
                    response = await AbsentRepository.update(req,data_absent,{id_absent:idAbsent});   
                }
            }
            if(response){
                if(response.success){
                    return Response.SuccessMessage(res,"Data berhasil di approve");
                }else{
                    return Response.Error(req,res,"Data gagal di approve");
                }    
            }else{
                return Response.Error(req,res,"Data gagal di approve");
            }
        } catch (error) {
            return Response.Error(req,res,error.message,true);
        }
    }

       
    static async rejectDataOutside(req,res){
        try{
            const dataBody = req.body;
            let idAbsent = dataBody.IDAbsent;
            var data_absent = {
                OutsideRejectBy:req.auth.employee_id,
                ApprovalStatus:2,
                OutsideRejectDate: DateHelper.dateTimeNow(),
                OutsideRejectReason: dataBody.reason
            };
            var response = await AbsentRepository.update(req,data_absent,{id_absent:idAbsent});   
            
            if(response){
                if(response.success){
                    return Response.SuccessMessage(res,"Data berhasil di reject");
                }else{
                    return Response.Error(req,res,"Data gagal di reject");
                }    
            }else{
                return Response.Error(req,res,"Data gagal di reject");
            }
        } catch (error) {
            return Response.Error(req,res,error.message,true);
        }
    }
    static async approveDataOutside(req,res){
        try{
            const dataBody = req.body;
            let idAbsent = dataBody.IDAbsent;
            var data_absent = {
                OutsideApprovalBy:req.auth.employee_id,
                ApprovalStatus:2,
                OutsideApprovalDate: DateHelper.dateTimeNow()
            };
            var response = await AbsentRepository.update(req,data_absent,{id_absent:idAbsent});   
            
            
            if(response){
                if(response.success){
                    return Response.SuccessMessage(res,"Data berhasil di approve");
                }else{
                    return Response.Error(req,res,"Data gagal di approve");
                }    
            }else{
                return Response.Error(req,res,"Data gagal di approve");
            }
        } catch (error) {
            return Response.Error(req,res,error.message,true);
        }
    }
}