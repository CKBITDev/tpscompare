import Response from '../responses/response';
import MainRepository from '../repositories/main-repositoy';
import DateHelper from '../helpers/date-helper';

export default class MainController{
    static async statusAbsent(req,res){
        try {
            req.date = DateHelper.dateNow(); 
            const response = await MainRepository.dataAbsent(req);
            if(!response){
              return Response.SuccessMessage(res,"");
            }
            const data = response.data;
            var mes= "";
            if(data.TimeAbsentOut){
              mes = req.date;
            }else if(data.TimeAbsent){
              mes = "check_in";
            }
            return Response.SuccessMessage(res,mes);
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
        
    }
    static async cekVersionApp(req,res){
      try {

          let dataBody = req.body;
          const response = await MainRepository.versionApp(dataBody);
          if(!response){  
            return Response.SuccessMessage(res,"","");
          }
          const data = response.data;
          if(data.param_id){
            return Response.SuccessMessage(res,`versi aplikasi telah berubah menjadi versi ${data.param_value} , silahkan update versi terlebih dahulu`);
          }

          return Response.SuccessMessage(res,"","");
          
        } catch (error) {
          return Response.Error(req,res,error.message,true);
        }
      
  }

  static async getParamReminderAttendance(req,res){
    try {
        const response = await MainRepository.paramReminderAttendance();
        if(!response.success){
          return Response.Error(req,res,response.message)
        }
        const data = response.data;
        const dataValue = data.param_value.split(";");
        const result = {
          reminder_check_in:dataValue[0],
          reminder_check_out:dataValue[1],
          msg_check_in:dataValue[2],
          msg_check_out:dataValue[3],
        }

        return Response.Success(res,result);
        
      } catch (error) {
        return Response.Error(req,res,error.message,true);
      }
    
  }

  static async getQrCode(req,res){
    try {

      let dataBody = req.body;
        const response = await MainRepository.getQrCode(dataBody);
        
        const data = response.data;
      
        return Response.Success(res,data,"Scan data berhasil");
        
      } catch (error) {
        return Response.Error(req,res,error.message,true);
      }
    
  }
  static async saveDeviceId(req,res){
    try {

        let dataBody = req.body;
        if(!dataBody.imei_id){
          return Response.Error(req,res,"Mohon periksa kembali Permission Telephone anda, aktivasi ini gagal dikarekan IMEI anda masih kosong.");
        }
        const response = await MainRepository.dataDevice(dataBody);
        
        const employee_id = req.auth.employee_id;
        if(response.data){
          const dataDevice = response.data;
          const device_id = dataDevice.device_id;
          const employee_id_data = dataDevice.employee_id;
          const aktivasi_date = dataDevice.aktivasi_date;
          const aktivasi_by = dataDevice.aktivasi_by;
          return Response.Error(req,res,`Smartphone anda sudah pernah diaktivasi pada tgl ${aktivasi_date} oleh user ${aktivasi_by}, dikarenakan IMEI anda dengan nomor ${dataBody.imei_id} sudah terdaftar dengan user ${employee_id_data}, silahkan lanjut kemenu absen, atau jika ingin open/reset imei silahkan hub IT`);
        }
        dataBody.employee_id = employee_id;
        const response2 = await MainRepository.dataDeviceEmpId(dataBody);
        
        if(response2.data){
          const dataDevice2 = response2.data;
          const employee_id_data_emp = employee_id;
          const device_id_emp = dataBody.device_id;
          const aktivasi_date_emp = dataDevice2.aktivasi_date;
          const aktivasi_by_emp = dataDevice2.aktivasi_by;

          return Response.Error(req,res,`Smartphone anda sudah pernah diaktivasi pada tgl ${aktivasi_date_emp}  oleh user ${aktivasi_by_emp} , dikarenakan user anda ${employee_id_data_emp}  sudah terdaftar di sistem kami dengan memakai IMEI ${device_id_emp} silahkan lanjut kemenu absen, atau jika ingin open/reset imei silahkan hub IT`);
        }
        const dataArr = {
          device_id: dataBody.imei_id,
          employee_id: employee_id,
          email:dataBody.email_user,
          no_hp:dataBody.hp_user,
          aktivasi_date: DateHelper.dateTimeNowJoin(),
          aktivasi_by: employee_id
        };
        await MainRepository.saveDevice(dataArr);
        
        return Response.SuccessMessage(res,`Selamat IMEI/SN Smartphone anda dengan nomor ${dataBody.imei_id} berhasil di aktivasi silahkan melakukan absen dan menu lainya, terimkasih`);
          
    } catch (error) {
      return Response.Error(req,res,error.message,true);
    }
    
  }
}