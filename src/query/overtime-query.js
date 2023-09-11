export default class OvertimeQuery{
    static dataOvertime(data){
        const query =  `SELECT 
        b.user_req_name, 
        b.over_date,
        b.description,
        b.worktype_code,
        b.ttovertime_pk,
        b.escalation_remark,
        b.time_plan_from as time_plan,
        b.time_plan_to as time_plan_to,
        case 
            when b.is_deleted = 1 then "Deleted"
            when b.appv_spr = 1 then 
                        (
                            case 
                                when b.settl_date != "" then 
                                (
                                    case 
                                        when b.settl_appv_spr = 1 && b.settl_appv_hr = 1 then "Approved - Document Complete"
                                        when b.settl_appv_spr = 1 && b.settl_appv_hr = 2 then "Approved - Document Complete"
                                        when b.settl_appv_spr = 1  then "Closing - Waiting For Superior Approval"
                                        when b.settl_appv_spr = 2 then "Rejected - Document Rejected"
                                        else "Approved - Closing Required"
                                    end
                                )
                                else 	"Approved - Closing Required"
                            end 
                        )
            else "Waiting For Superior Approval"
            end as status_data,
            if(b.over_daytype=1,'Hari Libur','Hari Kerja') over_daytypes,
            CONCAT_WS(" ",d.first_name,d.middle_name,d.last_name) as nama_atasan
                    FROM user_access.t_user a
                    LEFT JOIN employee.ot_overtime b on a.user_id=b.created_by
                    LEFT JOIN employee.t_personel d on d.job_title_detail_id=b.req_to_jobtitleid
                    WHERE b.ttovertime_pk != '' AND b.is_deleted != 1
                    AND a.user_id =  '${data.user_id}' 
                    AND (b.appv_spr = 0)
                    and b.appv_hr=1
                    and b.settl_appv_spr=0
                    and b.settl_appv_hr=0
                    and b.flag_rejected_appv1 is null or b.flag_rejected_appv1 = 0
                    order by b.created_datetime DESC`;
        return query;
    }
    static dataOvertimeApproval(data){
        const query =  `SELECT 
        b.user_req_name, 
        b.over_date,
        b.description,
        b.worktype_code,
        b.ttovertime_pk,
        b.escalation_remark,
        b.time_plan_from as time_plan,
        b.time_plan_to as time_plan_to,
        case 
            when b.is_deleted = 1 then "Deleted"
            when b.appv_spr = 1 then 
                        (
                            case 
                                when b.settl_date != "" then 
                                (
                                    case 
                                        when b.settl_appv_spr = 1 && b.settl_appv_hr = 1 then "Approved - Document Complete"
                                        when b.settl_appv_spr = 1 && b.settl_appv_hr = 2 then "Approved - Document Complete"
                                        when b.settl_appv_spr = 1  then "Closing - Waiting For Superior Approval"
                                        when b.settl_appv_spr = 2 then "Rejected - Document Rejected"
                                        else "Approved - Closing Required"
                                    end
                                )
                                else 	"Approved - Closing Required"
                            end 
                        )
            when b.appv_spr = 2 then "Rejected - Document Rejected"
            else "Waiting For Superior Approval"
            end as status_data,
            if(b.over_daytype=1,'Hari Libur','Hari Kerja') over_daytypes,
            CONCAT_WS(" ",d.first_name,d.middle_name,d.last_name) as nama_atasan
                    FROM user_access.t_user a
                    LEFT JOIN employee.ot_overtime b on a.user_id=b.created_by
                    LEFT JOIN employee.t_personel d on d.job_title_detail_id=b.req_to_jobtitleid
                    WHERE b.ttovertime_pk != '' AND b.is_deleted != 1
                    ${data.employeeLike}
                    AND b.req_spr_uid =  '${data.user_id}' 
                    AND (b.appv_spr = 0)
                    and b.appv_hr=1
                    and b.settl_appv_spr=0
                    and b.settl_appv_hr=0
                    and b.flag_rejected_appv1 is null or b.flag_rejected_appv1 = 0
                    order by b.created_datetime DESC`;
        return query;
    }

    static dataOvertimeByDate(data){
        const query =  `SELECT * from employee.ot_overtime WHERE over_date ='${data.over_date}' and user_req_uid = '${data.user_id}' and is_deleted = 0 `;
        return query;
    }

    static dataOvertimeById(data){
        const query =  `SELECT * from employee.ot_overtime where ttovertime_pk='${data.id_over_time}' `;
       
        return query;
    }

    static dataHoliday(data){
        const query =  `SELECT holiday_date,holiday_type_id,holiday_description FROM  master_param.t_holiday WHERE holiday_date ='${data.over_date}' `;
        return query;
    }

    static dataRequestReport(data){
        const query =  ` select 
        concat_ws(' ',tp.first_name,tp.middle_name,tp.last_name) nama_atasan,
        b.user_id as user_id,
        tp.email as email_atasan,
        b.full_name as full_name
        from employee.t_personel as tp
        left join user_access.t_user b on tp.employee_id=b.employee_id
        where tp.job_title_detail_id='${data.rdOptionApproval}' `
        return query;
    }
    static dataWorktypeByCode(data){
        const query =  `SELECT a.worktype_desc FROM employee.ot_worktype a 
        WHERE a.worktype_code in (${data.worktype_code}) ORDER BY a.worktype_code `;
        return query;
    }

    static dataWorktype(){
        const query =  `SELECT * FROM employee.ot_worktype`;
        return query;
    }

    static dataApprovalFlow(data){
        const query =  `SELECT
            IFNULL(prs.first_name,"") as first_atasan_2,
            IFNULL(prs.middle_name,"") as midd_atasan_2,
            IFNULL(prs.last_name,"") as last_atasan_2,
            IFNULL(jt2.job_title_id,"") as id_atasan_2,
            IFNULL(jt2.job_title_detail_id,"") as id_detail_atasan_2,
            
            IFNULL(prs1.first_name,"") as first_atasan_3,
            IFNULL(prs1.middle_name,"") as midd_atasan_3,
            IFNULL(prs1.last_name,"") as last_atasan_3,
            IFNULL(jt3.job_title_id,"") as id_atasan_3,
            IFNULL(jt3.job_title_detail_id,"") as id_detail_atasan_3,
            
            IFNULL(prs2.first_name,"") as first_atasan_4,
            IFNULL(prs2.middle_name,"") as midd_atasan_4,
            IFNULL(prs2.last_name,"") as last_atasan_4,
            IFNULL(jt4.job_title_id,"") as id_atasan_4,
            IFNULL(jt4.job_title_detail_id,"") as id_detail_atasan_4
                

            FROM
                employee.t_job_title_detail as jt1
            LEFT JOIN employee.t_job_title_detail as jt2 ON jt1.report_to_title_id=jt2.job_title_detail_id
            LEFT JOIN employee.t_job_title_detail as jt3 ON jt2.report_to_title_id=jt3.job_title_detail_id
            LEFT JOIN employee.t_job_title_detail as jt4 ON jt3.report_to_title_id=jt4.job_title_detail_id

            LEFT JOIN employee.t_personel as prs ON jt2.job_title_detail_id=prs.job_title_detail_id
            LEFT JOIN employee.t_personel as prs1 ON jt3.job_title_detail_id=prs1.job_title_detail_id
            LEFT JOIN employee.t_personel as prs2 ON jt4.job_title_detail_id=prs2.job_title_detail_id

            LEFT JOIN employee.t_personel as prs_req ON jt1.job_title_detail_id=prs_req.job_title_detail_id
            

            WHERE prs_req.employee_id = ('${data.employee_id}') LIMIT 1`;
        return query;
    }
    static userHrDivision(data){
        const query = `SELECT t_user.user_id, employee.t_personel.employee_id, concat_ws(' ',employee.t_personel.first_name,employee.t_personel.middle_name,employee.t_personel.last_name) fullname, employee.t_personel.*, employee.t_employment_status.description AS employment_status, employee.t_religion.religion AS religion, employee.t_level.description AS level, employee.t_job_title.description AS job_title, employee.t_job_title.job_title_id AS job_id, employee.t_department.description AS department, employee.t_division.description AS division,employee.t_division.division_id as id_div, master_param.t_area.area_desc AS area, master_param.t_station.station_desc AS location, employee.t_kecamatan.description AS current_kecamatan, employee.t_personel.marital_status_id AS marital_status, employee.t_personel.gender, employee.t_job_title_detail.job_title_detail_id, employee.t_job_title_detail.report_to_title_id, employee.t_personel.level_id,employee.t_personel.sap_id,
        employee.t_personel.department_id, employee.t_personel.email,employee.t_personel.mobile_phone, employee.t_personel.company_id
    FROM employee.t_personel 
    LEFT JOIN employee.t_employment_status ON employee.t_employment_status.employment_status_id = employee.t_personel.employment_status_id 
    LEFT JOIN employee.t_religion ON employee.t_religion.religion_id = employee.t_personel.religion_id 
    LEFT JOIN employee.t_level ON employee.t_personel.level_id = employee.t_level.level_id 
    LEFT JOIN employee.t_division ON employee.t_personel.division_id = employee.t_division.division_id 
    LEFT JOIN employee.t_department ON employee.t_personel.department_id = employee.t_department.department_id 
    LEFT JOIN employee.t_job_title ON employee.t_personel.job_title_id = employee.t_job_title.job_title_id
    LEFT JOIN employee.t_job_title_detail ON employee.t_personel.job_title_detail_id = employee.t_job_title_detail.job_title_detail_id 

    LEFT JOIN master_param.t_area ON employee.t_personel.area_id = master_param.t_area.area_id 
    LEFT JOIN master_param.t_station ON employee.t_personel.station_id = master_param.t_station.station_id 
    LEFT JOIN employee.t_kecamatan ON t_kecamatan.kecamatan_id=t_personel.current_kecamatan_id 
    LEFT JOIN user_access.t_user ON t_user.employee_id = t_personel.employee_id  
    WHERE user_access.t_user.user_id = '${data.user_id}'`;
    return query;
    }

    static insertOvertime(){
        const query =  `insert into employee.ot_overtime set ?`;
        return query;
    }
    static insertOtHistory(){
        const query =  `insert into employee.ot_history set ?`;
        return query;
    }

    static updateOvertime(data){
        const query =  `update employee.ot_overtime set ? where ttovertime_pk = '${data.id_over_time}'`;
        return query;
    }
}