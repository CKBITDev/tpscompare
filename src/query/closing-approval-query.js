export default class ClosingApprovalQuery{
    static data(data){
        const query =  `SELECT 
        b.user_req_name, 
        b.over_date,
        b.description,
        b.worktype_code,
        b.ttovertime_pk,
        b.escalation_remark,
        b.time_plan_from as time_plan,
        b.time_plan_to as time_plan_to,
        if(b.settl_shift=1,'Shift','Normal') shift_type,
        b.settl_start_time,
        b.settl_end_time,
        settl_shifttimestart as settl_shifttimestart,
        settl_shifttimeend as settl_shifttimeend,
        0 as total_jam,
        '' asbg_max_overtime,
        '' as message_max_overtime,
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
            if(b.over_daytype=1,'Hari Libur','Hari Kerja') day_type,
            CONCAT_WS(" ",d.first_name,d.middle_name,d.last_name) as nama_atasan
                    FROM user_access.t_user a
                    LEFT JOIN employee.ot_overtime b on a.user_id=b.created_by
                    LEFT JOIN employee.t_personel d on d.job_title_detail_id=b.req_to_jobtitleid
                    WHERE b.ttovertime_pk != '' AND b.is_deleted != 1
                    ${data.employeeLike}
                    AND b.settl_appv_spr_uid =  '${data.employee_id}' 
                    and b.appv_spr=1
                    and b.settl_start_time != ''
                    and b.settl_end_time != ''
                    and b.settl_date != ''
                    and b.settl_appv_spr = 0
                    and b.flag_rejected_appv2 is null or b.flag_rejected_appv2 = 0
                    order by b.created_datetime DESC`;
        return query;
    }
    static costStatus(){
        return `SELECT coststatusId,description FROM employee.ot_coststatus ORDER BY coststatusId`;
    }
    
}