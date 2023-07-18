import ParamRepository from '../repositories/param-repository';


export default class FunctionHelper{
    static generateGuid(includeBraces = false) {
        if (typeof require === 'function') {
          const { v4: uuidv4 } = require('uuid');
          
          let guid = uuidv4().replace(/-/g, '');
          if (includeBraces) {
            guid = '{' + guid + '}';
          }
          
          return guid;
        } else {
          // Fallback if the 'uuid' module is not available
          const crypto = require('crypto');
          const { v1: uuidv1 } = require('uuid');
          
          let charid = crypto.randomBytes(16).toString('hex');
          let guid = uuidv1({
            msecs: Date.now(),
            nsecs: process.hrtime()[1],
            random: charid
          }).replace(/-/g, '');
          
          if (includeBraces) {
            guid = '{' + guid + '}';
          }
          
          return guid;
        }
      }
  static async selisihJamMenit(dateStart,dateEnd,day_type,paramWork,paramHoliday){
    
    // hitung selisih start dengan end time
    if(dateStart == null){
      return {
        message_max_overtime:"",
        bg_max_overtime:"",
        jam_hours:"",
      }
    }
    if(dateEnd == null){
      return {
        message_max_overtime:"",
        bg_max_overtime:"",
        jam_hours:"",
      }
    }
    //const settl_start_time_sub = dateStart.slice(11, 19);
    //const settl_end_time_sub = dateEnd.slice(11, 19);
    const waktu_awal = new Date(dateStart).getTime() / 1000;
    const waktu_akhir = new Date(dateEnd).getTime() / 1000;

    // menghitung selisih dengan hasil detik
    const diff = waktu_akhir - waktu_awal;

    // membagi detik menjadi jam
    const jam = Math.floor(diff / 3600);

    // membagi sisa detik setelah dikurangi jam menjadi menit
    const menit = diff - jam * 3600;

    // validasi 1.01 - 1.14 = dihitung 1 jam
    // validasi 1.15 - 1.59 = dihitung 1 jam 30 menit
    let menit_result = "00";
    const menit_selisih = Math.floor(menit / 60);
    if (menit_selisih >= 1 && menit_selisih <= 29) {
      menit_result = "00";
    } else if (menit_selisih >= 30 && menit_selisih <= 59) {
      menit_result = "30";
    }

    const jam_hours = jam + ' jam dan ' + menit_result + ' menit';

    let bg_max_overtime = "";
    let message_max_overtime = "";
    if (day_type === "Hari Kerja") {
      if (FunctionHelper.validateParamOvertime(jam + ':' + menit_result, paramWork)) {
        bg_max_overtime = "red";
        message_max_overtime = paramWork[2];
      }
    } else {
      if (FunctionHelper.validateParamOvertime(jam + ':' + menit_result, paramHoliday)) {
        bg_max_overtime = "red";
        message_max_overtime = paramHoliday[2];
      }
    }

    const data = {
      message_max_overtime:message_max_overtime,
      bg_max_overtime:bg_max_overtime,
      jam_hours:jam_hours,
    }
    return data;
  }
  static validateParamOvertime(time, data) {
    let [hour, minute] = time.split(":");
    let isLimit = false;
  
    if (parseInt(minute) >= 30) {
      hour = parseInt(hour) + 1;
    }
    const limitHour = parseInt(data[0]);
    const uu = data[1];
    const message = data[2];
  
    if (parseInt(hour) > limitHour) {
      isLimit = true;
    }
  
    return isLimit;
  }
      
}