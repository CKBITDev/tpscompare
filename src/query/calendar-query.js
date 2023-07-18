export default class CalendarQuery{
    static leaveQuery(data){
        const query =  `SELECT l.*
        FROM employee.t_leave l
        LEFT JOIN doctrack.t_approval a ON l.doctrack_id = a.doctrack_id
        WHERE l.employee_id = '${data.employee_id}'
          AND a.step_no = 2
          AND a.flag_approved = 'Y'
          AND a.flag_rejected = 'N'
          AND (
            (l.date_from <= '${data.start}' AND l.date_to >= '${data.end}')
            OR (l.date_from >= '${data.start}' AND l.date_from <= '${data.end}')
            OR (l.date_to >= '${data.start}' AND l.date_to <= '${data.end}')
          )`;
        return query;
    }
    static workingDaysQuery(data){
        const query =  `SELECT holiday_date FROM master_param.t_holiday WHERE holiday_date >= '${data.fromDate}' AND 
        holiday_date <= '${data.dateTo}' 
        ${data.whereHolidayType}
        ORDER BY holiday_date
        LIMIT ${data.days}`;
        return query;
    }
    static eventDataQuery(data){
        const query = `SELECT h.*, a.*
        FROM master_param.t_holiday h
        LEFT JOIN employee.at_absent a ON a.DateAbsent = h.holiday_date AND a.EmployeeID = '${data.employee_id}'
        WHERE h.holiday_type_id IN ('PUB', 'DAY', 'CBS')
          AND (a.EmployeeID = '${data.employee_id}' OR a.EmployeeID IS NULL)
          AND YEAR(h.holiday_date) = ${data.year}
          AND MONTH(h.holiday_date) = ${data.month}`
        return query;
    }

    
  
    
   
}