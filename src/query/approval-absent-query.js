export default class ApprovalAbsentQuery{
    static getViewApproval(data){
        const query =  `SELECT 
        IDAbsent,
        EmployeeName,
        EmployeeID,
        concat(DateAbsent," ",TimeAbsent) as  DateAbsent,
        concat(DateAbsent," ",TimeAbsentOut) as  DateAbsentOut,
        case 
            when ActivityType != 'Bekerja' then ActivityType 
            when TimeAbsent > StartTime && TimeAbsentOut < EndTime then 'Terlambat Absen | Pulang Cepat'
            when TimeAbsent > StartTime then 'Terlambat Absen'
            when TimeAbsentOut < EndTime  then 'Pulang Cepat'
            else ''
        end
            as Desctription,
            OutsideActivity
        from employee.at_absent where ApporvalBy = '${data.employee_id}' and ApprovalStatus = 0 AND (justificationRemarks IS NOT NULL or OutsideActivity = 'Y')  and DateAbsent >= '${data.month}' ${data.employee_name_like}  ORDER BY DateAbsent DESC`;
        return query;
    }
    static getAbsentApprove(data){
        const query =  `SELECT 
        case when TimeAbsent > StartTime then StartTime
        else ''
        end as 	TimeAbsent,
        case when TimeAbsentOut < EndTime  then StartTime
        else ''
        end as 	TimeAbsentOut
        from employee.at_absent where IDAbsent = '${data.id_absent}'`;
        return query;
    }
   
}