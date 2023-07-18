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
        const query = `SELECT * from employee.at_absent where CreatedUser='${data.employee_id}' AND DateAbsent= '${data.date_absen}'`;
        return query;
    }
    static getPersonelData(data){
        const query = `SELECT a.employee_id, f.user_id report_from_userid
        , concat_ws(' ' ,b.first_name,b.middle_name,b.last_name) report_from 
        , c.job_title_id,c.report_to_title_id
        , concat_ws(' ' ,d.first_name,d.middle_name,d.last_name) direct_report_to
        , e.user_id to_userid, d.level_id level_id, g.depth level_depth
        , c2.report_to_title_id report_to_title_id2
        , concat_ws(' ' ,d2.first_name,d2.middle_name,d2.last_name) direct_report_to2
        , e2.user_id to_userid2, d2.level_id level_id2
        , c3.report_to_title_id report_to_title_id2
        , concat_ws(' ' ,d3.first_name,d3.middle_name,d3.last_name) direct_report_to3
        , e3.user_id to_userid3, d3.level_id level_id3
        , g2.depth level_depth2, g3.depth level_depth3
        FROM user_access.t_user a 
        LEFT JOIN employee.t_personel b on a.employee_id = b.employee_id
        LEFT JOIN employee.t_job_title_detail c on b.job_title_detail_id = c.job_title_detail_id
        LEFT JOIN employee.t_personel d on d.job_title_detail_id = c.report_to_title_id
        LEFT JOIN user_access.t_user e on e.employee_id = d.employee_id
        LEFT JOIN user_access.t_user f on a.employee_id = f.employee_id
        LEFT JOIN employee.t_level g on d.level_id = g.level_id
        LEFT JOIN employee.t_job_title_detail c2 on d.job_title_detail_id=c2.job_title_detail_id
        LEFT JOIN employee.t_personel d2 on d2.job_title_detail_id = c2.report_to_title_id
        LEFT JOIN user_access.t_user e2 on e2.employee_id = d2.employee_id
        LEFT JOIN employee.t_level g2 on d2.level_id = g2.level_id
        LEFT JOIN employee.t_job_title_detail c3 on d2.job_title_detail_id=c3.job_title_detail_id
        LEFT JOIN employee.t_personel d3 on d3.job_title_detail_id = c3.report_to_title_id
        LEFT JOIN user_access.t_user e3 on e3.employee_id = d3.employee_id
        LEFT JOIN employee.t_level g3 on d3.level_id = g3.level_id
        WHERE a.user_id='${data.employee_id}' LIMIT 1 `;
        return query;
    }
}