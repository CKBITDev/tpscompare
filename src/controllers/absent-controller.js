import Response from '../responses/response';
import MainRepository from '../repositories/main-repositoy';
import Geofence from '../helpers/geofence';
import AbsentQuery from '../query/absent-query';
import AbsentRepository from '../repositories/absent-repositoy';
import TimezoneHelper from '../helpers/timezone-helper';
import DateHelper from '../helpers/date-helper';

export default class AbsentController{
    static async dataActivity(req,res){
        let data = [
            //"Bekerja",
            "Training",
            "Perjalanan Dinas",
            "Meeting Customer",
            "Visit",
        ];
        return Response.Success(res,data);
                
    }
    static async checkIn(req,res){
        try {

            let dataBody = req.body;
            let outsideActivity = "N";
            dataBody.employee_id = req.auth.employee_id;
            
            let employee_id    = req.auth.employee_id;
            let employee_name  = req.auth.fullname;
            let long_lat       = dataBody.long_lat;
            let date_absen     = dataBody.date_absen;
            let time_absen     = dataBody.time_absen;
            let activity_type  = dataBody.activity_type;
            let qr_location_id  = dataBody.qr_location_id;

            let type           = dataBody.type;
            let start_time     = dataBody.start_time;
            let end_time       = dataBody.end_time;
            let curr_location  = dataBody.curr_location;
            let description    = dataBody.description;
            let remark    = dataBody.remark;
            let date_created = DateHelper.dateTimeNow();
            if(!long_lat){
                return Response.Error(req,res,` Clock In gagal di proses karena GPS/Lokasi di smartphone anda belum aktif, silahkan aktifkan GPS/Lokasi anda`);
            }
            if(qr_location_id && qr_location_id != 0){
                const geofence = await Geofence.cekGeofenceLocation(dataBody);
                
                if(!geofence){
                    const location = await AbsentRepository.getLocationQr(req,dataBody);
                    return Response.Error(req,res,`Maaf, anda berada di luar area CKB Group yang sesuai dengan QR code ini: ${location.data.location_name}`);
                }
            }else{
                if(activity_type != "Bekerja"){
                    outsideActivity = "Y";
                }
            }
            let timeZone = await TimezoneHelper.getTimeZone(long_lat);
            let timeAbsenServer = timeZone.waktu;
            let zonaAbsenServer = timeZone.zonaName;
            let dateAbsenServer = date_absen;
            
            let personel = await AbsentRepository.getPersonelData(req,dataBody);
            let absent = await AbsentRepository.getAbsentData(req,dataBody);

            const dateJamAbsent = dateAbsenServer + ' ' + DateHelper.timeFormat(timeAbsenServer);
            const dateJamMasukKerja = dateAbsenServer+' '+ DateHelper.timeFormat(dataBody.start_time); 

            const empApproval = personel.data.to_userid;
            if(absent){
                //const idAbsent = absent.IDAbsent;
                const timeAbsent = absent.data.TimeAbsent;
                return Response.Error(req,res,`Clock In gagal di proses, Hari ini anda sudah Clock In jam ${timeAbsent} ${zonaAbsenServer}`);
               
            }else if(dateJamAbsent > dateJamMasukKerja){
                let startTimeVal = DateHelper.timeFormat(dataBody.start_time,15);

                if((timeAbsenServer > startTimeVal) && remark == ""){
                    return Response.Error(req,res,`Anda telat Clock In, tipe jam kerja anda adalah ${type} anda absen pukul ${timeAbsenServer} ${zonaAbsenServer}, dan jam masuk anda pukul ${start_time} ${zonaAbsenServer} silahkan isikan alasan telat anda untuk minta approval atasan anda`);
                }else{
                    let dataCheckin = {
                        EmployeeID    : employee_id,
                        EmployeeName  : employee_name,
                        LongLat : long_lat,
                        DateAbsent : dateAbsenServer,
                        TimeAbsent : timeAbsenServer,
                        ActivityType : activity_type,
                        TypeShft : type,
                        StartTime : start_time,
                        EndTime : end_time,
                        CurrentLocation : curr_location,
                        Desctription : description,
                        CreatedDate : date_created,
                        CreatedUser : employee_id,
                        StatusData : 1,
                        ApprovalStatus    : 0,
                        ApporvalBy        : empApproval,
                        justificationRemarks : remark, 
                        justificationDate : date_created,
                        TypeHP : 1,
                        qr_location_id : qr_location_id,
                        outsideactivity : outsideActivity
                    }
                    await AbsentRepository.insert(req,dataCheckin);
                }
            }else{

                let dataCheckin = {
                    EmployeeID    : employee_id,
                    EmployeeName  : employee_name,
                    LongLat : long_lat,
                    DateAbsent : dateAbsenServer,
                    TimeAbsent : timeAbsenServer,
                    ActivityType : activity_type,
                    TypeShft : type,
                    StartTime : start_time,
                    EndTime : end_time,
                    CurrentLocation : curr_location,
                    Desctription : description,
                    CreatedDate : date_created,
                    CreatedUser : employee_id,
                    StatusData : 1,
                    ApprovalStatus    : 0,
                    ApporvalBy        : empApproval,
                    TypeHP : 1,
                    qr_location_id : qr_location_id,
                    outsideactivity : outsideActivity
                }

                await AbsentRepository.insert(req,dataCheckin);
            }
            

            return Response.SuccessMessage(res,`Anda Berhasil Clock In Pukul ${timeAbsenServer} ${zonaAbsenServer}, Terimakasih`);
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
        
    }
    static async checkOut(req,res){
        try {

            let dataBody = req.body;
            dataBody.employee_id = req.auth.employee_id;
            
            let employee_id    = req.auth.employee_id;
            let employee_name  = req.auth.fullname;
            let long_lat       = dataBody.long_lat;
            let date_absen     = dataBody.date_absen;
            let time_absen     = dataBody.time_absen;
            let activity_type  = dataBody.activity_type;

            let type           = dataBody.type;
            let start_time     = dataBody.start_time;
            let end_time       = dataBody.end_time;
            let curr_location  = dataBody.curr_location;
            let description    = dataBody.description;
            let remark    = dataBody.remark;
            
            if(!long_lat){
                return Response.Error(req,res,` Clock out gagal di proses karena GPS/Lokasi di smartphone anda belum aktif, silahkan aktifkan GPS/Lokasi anda`);
            }
           
            let timeZone = await TimezoneHelper.getTimeZone(long_lat);
            let timeAbsenServer = timeZone.waktu;
            let zonaAbsenServer = timeZone.zonaName;
            let dateAbsenServer = date_absen;
            
            let personel = await AbsentRepository.getPersonelData(req,dataBody);
            
            let current_date = AbsentController.cekJamPagi(timeAbsenServer, dateAbsenServer);
            dataBody.date_absen = current_date;
            let absent = await AbsentRepository.getAbsentData(req,dataBody);
            
            const empApproval = personel.data.to_userid;
            const dateJamAbsent = dateAbsenServer + ' ' + timeAbsenServer;
            const dateJamSelesaiKerja = dateAbsenServer+' '+ dataBody.start_time; 

            if(!absent){
                return Response.Error(req,res,`Transaksi gagal di proses, Hari ini anda belum melakukan Clock In, silahkan mengisi Justification dimenu kalender untuk memporses absen Clock In anda`);               
            }else if(absent.data.DateAbsentOut){
                return Response.Error(req,res,`Clock Out gagal di proses, Hari ini anda sudah Clock Out jam ${absent.data.TimeAbsentOut} ${zonaAbsenServer}`);               
            }else if(dateJamAbsent < dateJamSelesaiKerja){
                if(remark == ""){
                    return Response.Error(req,res,`Anda Clock Out lebih awal, tipe jam kerja anda adalah ${absent.data.TypeShft},anda absen pukul ${timeAbsenServer} ${zonaAbsenServer} dan jam pulang anda pukul ${absent.data.EndTime} ${zonaAbsenServer} silahkan isikan alasan pulang cepat untuk minta approval atasan anda`);
                }else{
                    let dataCheckout = {
                        DateAbsentOut: dateJamAbsent,
                        TimeAbsentOut:timeAbsenServer,
                        LongLatOut:long_lat,
                        CurrentLocationOut:curr_location,
                        DesctriptionOut:description,
                        StatusData:2,
                        ApprovalStatus:0,
                        ApporvalBy:empApproval,
                        justificationRemarks:absent.justificationRemarks + '|' + remark,
                        justificationDate:DateHelper.dateTimeNow()
                    }
                    var condition = {date_absen:current_date,date_created:employee_id};
                    await AbsentRepository.checkOut(req,dataCheckout,condition);
                }
            }else{

                let dataCheckout = {
                    DateAbsentOut: dateJamAbsent,
                    TimeAbsentOut:timeAbsenServer,
                    LongLatOut:long_lat,
                    CurrentLocationOut:curr_location,
                    DesctriptionOut:description,
                    StatusData:2,
                }
                var condition = {date_absen:current_date,date_created:employee_id};
                
                await AbsentRepository.checkOut(req,dataCheckout,condition);
            }
            

            return Response.SuccessMessage(res,`Anda Berhasil Clock Out Pukul ${timeAbsenServer} ${zonaAbsenServer}, Terimakasih`);
          } catch (error) {
              return Response.Error(req,res,error.message,true);
          }
        
    }
    static  cekJamPagi(clock, currentDate) {
        // Convert the clock string to a Date object
        const clockTime = new Date(`1970-01-01T${clock}Z`);
      
        // Create a Date object for the current date
        const currentDateObj = new Date(currentDate);
      
        // Check if the clock time is between 00:00:00 and 09:00:00
        if (clockTime >= new Date('1970-01-01T00:00:00Z') && clockTime <= new Date('1970-01-01T09:00:00Z')) {
          // Adjust the current date to the previous day
          currentDateObj.setDate(currentDateObj.getDate() - 1);
        }
      
        // Format the current date as YYYY-MM-DD string
        const formattedDate = currentDateObj.toISOString().split('T')[0];
      
        return formattedDate;
      }
   
}