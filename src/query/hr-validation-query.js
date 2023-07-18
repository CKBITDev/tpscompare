export default class HrValidationQuery{
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
        b.settl_appv_spr_name as nama_atasan,
        DATE_FORMAT(settl_shifttimestart,"%H:%i") as settl_shifttimestart,
        DATE_FORMAT(settl_shifttimeend,"%H:%i") as settl_shifttimeend,
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
            if(b.over_daytype=1,'Hari Libur','Hari Kerja') day_type 
                    FROM employee.ot_overtime b
                    WHERE b.ttovertime_pk != '' 
                    AND b.is_deleted != 1
                    AND (b.settl_appv_spr = 1) 
                    AND b.settl_appv_hr NOT IN (1,2) 
                    ${data.stationCondition}
                    ${data.employeeLike}
                    order by b.created_datetime DESC
                    LIMIT 10 OFFSET ${data.offset}`;
        return query;
    }
    
}