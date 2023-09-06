export default class AuthQuery{
    static login(data){
        const query =  `SELECT a.* FROM user_access.t_user a
                        LEFT JOIN employee.t_personel b on a.employee_id = b.employee_id
                        WHERE b.employment_status_id in ('PER','CON','OUT')
                            AND a.user_id ='${data.username}' 
                            AND a.password = md5('${data.password}')`;
        return query;
    }
    static loginWithoutPassword(data){
        const query =  `SELECT a.* FROM user_access.t_user a
                        LEFT JOIN employee.t_personel b on a.employee_id = b.employee_id
                        WHERE b.employment_status_id in ('PER','CON','OUT')
                            AND a.user_id ='${data.username}' `;
        return query;
    }
    static userDetail(data){
        
        const query =  `SELECT
                                case 
                                    when  absent.TimeAbsentOut is not null then now()
                                    when absent.TimeAbsent is not null then "check_in"
                                    else ""
                                end as status_absent,
                                 t_user.user_id, 
                                employee.t_personel.employee_id, 
                                concat_ws(' ',employee.t_personel.first_name,employee.t_personel.middle_name,employee.t_personel.last_name) fullname,  
                                employee.t_level.description AS level, 
                                employee.t_department.description AS department,
                                employee.t_personel.division_id as division_id, 
                                employee.t_division.description as division,
                                master_param.t_area.area_desc AS area,  
                                employee.t_personel.level_id,
                                employee.t_personel.sap_id,
                                employee.t_personel.station_id,
                                employee.t_personel.job_title_detail_id,
                            employee.t_personel.department_id, employee.t_personel.email,employee.t_personel.mobile_phone, employee.t_personel.company_id
                        FROM employee.t_personel 
                        LEFT JOIN employee.t_level ON employee.t_personel.level_id = employee.t_level.level_id 
                        LEFT JOIN employee.t_department ON employee.t_personel.department_id = employee.t_department.department_id 
                        LEFT JOIN employee.t_division ON employee.t_personel.division_id = employee.t_division.division_id 
                        LEFT JOIN master_param.t_area ON employee.t_personel.area_id = master_param.t_area.area_id 
                        LEFT JOIN employee.at_absent absent ON employee.t_personel.employee_id = absent.CreatedUser and DateAbsent = now()
                        LEFT JOIN user_access.t_user ON t_user.employee_id = t_personel.employee_id  
                        WHERE employee.t_personel.employee_id ='${data.username}'`;
        return query;
    }

    static userDetailFull(data){
        
        const query =  `SELECT t_user.user_id, employee.t_personel.employee_id, concat_ws(' ',employee.t_personel.first_name,employee.t_personel.middle_name,employee.t_personel.last_name) fullname, employee.t_personel.*, employee.t_employment_status.description AS employment_status, employee.t_religion.religion AS religion, employee.t_level.description AS level, employee.t_job_title.description AS job_title, employee.t_job_title.job_title_id AS job_id, employee.t_department.description AS department, employee.t_division.description AS division, master_param.t_area.area_desc AS area, master_param.t_station.station_desc AS location, employee.t_kecamatan.description AS current_kecamatan, employee.t_personel.marital_status_id AS marital_status, employee.t_personel.gender, employee.t_job_title_detail.job_title_detail_id, employee.t_job_title_detail.report_to_title_id, employee.t_personel.level_id,employee.t_personel.sap_id,
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
                        WHERE employee.t_personel.employee_id ='${data.username}'`;
        return query;
    }
}