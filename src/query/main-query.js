export default class MainQuery{
    static dataAbsent(data){
        const query =  `SELECT * from at_absent where CreatedUser = '${data.employee_id}' and DateAbsent = '${data.date}'`;
        return query;
    }
    static versionApp(data){
        const query =  `select * from employee.t_params where param_id = 'APP' and param_value > '${data.version_app}'`;
        return query;
    }
    static paramReminderAttendance(){
        const query =  `select * from employee.t_params where param_id = "RAT"`;
        return query;
    }
    static dataQrCode(data){
        const query =  `SELECT * from employee.t_location_qr where location_token = '${data.qr_code}'`;
        return query;
    }
    static getDeviceId(data){
        const query = `SELECT device_id,employee_id,aktivasi_date,aktivasi_by from employee.at_device_privillage where device_id='${data.imei_id}'`
        return query;
    }

    static saveDevice(){
        const query = `insert into employee.at_device_privillage set ?`
        return query;
    }
    static getDeviceIdByEmployeeId(data){
        const query = `SELECT device_id,employee_id,aktivasi_date,aktivasi_by from employee.at_device_privillage where employee_id='${data.employee_id}'`
        return query;
    }
    
}