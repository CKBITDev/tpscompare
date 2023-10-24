export default class AbsentQuery{
    static insert(){
        const query =  `INSERT INTO at_absent SET ?`;
        return query;
    }
    static checkOut(condition){
        const query =  `UPDATE at_absent SET ? where DateAbsent = '${condition.date_absen}' and  CreatedUser = '${condition.date_created}'`;
         return query;
    }
    static update(condition){
        const query =  `UPDATE at_absent SET ? where IDAbsent = '${condition.id_absent}'`;
         return query;
    }
    static qrData(data){
        const query =  `SELECT * from employee.t_location_qr where location_code = '${data.qr_location_id}'`;
        return query;
    }

    static qrDataAll(){
        const query =  `SELECT * from employee.t_location_qr `;
        return query;
    }
    static getDataAbsent(data){
        const query = `SELECT * from employee.at_absent where CreatedUser='${data.user_id}' AND DateAbsent= '${data.date_absen}'`;
        return query;
    }
    static getPersonelData(data){
        const query = `SELECT e.user_id to_userid
        FROM user_access.t_user a 
        LEFT JOIN employee.t_personel b on a.employee_id = b.employee_id
        LEFT JOIN employee.t_job_title_detail c on b.job_title_detail_id = c.job_title_detail_id
        LEFT JOIN employee.t_personel d on d.job_title_detail_id = c.report_to_title_id
        LEFT JOIN user_access.t_user e on e.employee_id = d.employee_id
        WHERE a.user_id='${data.user_id}' LIMIT 1 `;
        return query;
    }
}