
import Database from '../config/database';
import OvertimeQuery from '../query/overtime-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';
import LogErrorHelper from '../helpers/logerror-helper';
import HrValidationQuery from '../query/hr-validation-query';
import FunctionHelper from '../helpers/function-helper';
import ParamRepository from './param-repository';

import ErrorHandler from '../helpers/error-handler';

export default class HrValidationRepository extends BaseRepository{
    static getClassName(){
        return 'HrValidationRepository';
    }
    static async data(req,data){
        try {   

            let paramWork = await ParamRepository.paramOvertime("MOT");
            let paramHoliday = await ParamRepository.paramOvertime("MHO");
            let stationCondition = await HrValidationRepository.getDataLocation(req.auth.employee_id);
            data.stationCondition = '';
            if (stationCondition) { 
                data.stationCondition = " and (" + stationCondition  + ")";
            }
            data.employeeLike = ''; 
            if(data.employee_name){
                data.employeeLike = ` AND b.user_req_name LIKE '%${data.employee_name}%'`;
            }
            const queryHr = HrValidationQuery.data(data);
            var result = await Database.conn(queryHr);
            for (let index = 0; index < result.length; index++) {
                const res = result[index];
                const worktypeData = await Database.conn(OvertimeQuery.dataWorktypeByCode({worktype_code:res.worktype_code.toString().replaceAll("|",",").slice(0, -1)}),data);
                let worktype_desc = [];
                worktypeData.forEach(workType => {
                    worktype_desc.push(workType.worktype_desc + "\n");
                });
                result[index].worktype_desc = worktype_desc.join(" - ");

                let getSelisih = await FunctionHelper.selisihJamMenit(res.settl_start_time.toString(),res.settl_end_time.toString(),res.day_type.toString(),paramWork.data,paramHoliday.data)
                
                result[index].total_jam = getSelisih.jam_hours;
                result[index].bg_max_overtime = getSelisih.bg_max_overtime;
                result[index].message_max_overtime = getSelisih.message_max_overtime;
            }
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }
    static async getDataLocation(employeeID){
        const dataLokasiQuery = `
            SELECT *
            FROM employee.t_approval_validator
            WHERE employee_id='${employeeID}'
            AND form_id='LEF'
            AND flag_granted='Y'
        `;

        const dataLokasiResult = await Database.conn(dataLokasiQuery);
        

        let result = '';
        let query = '';
        let or = '';

        dataLokasiResult.forEach(row => {
            let companyId = '';
            let areaId = '';
            let divisionId = '';
            let departmentId = '';
            let stationId = '';

            if (row.company_id != null && row.company_id !== '') {
                companyId = `b.user_company='${row.company_id}'`;
            }
            if (row.area_id != null && row.area_id !== '') {
                if (!(row.company_id != null && row.company_id !== '')) {
                    areaId = `b.user_area='${row.area_id}'`;
                } else {
                    areaId = `AND b.user_area='${row.area_id}'`;
                }
            }
            if (row.division_id != null && row.division_id !== '') {
                if (!(row.company_id != null && row.company_id !== '') && !(row.area_id != null && row.area_id !== '')) {
                    divisionId = `b.user_div='${row.division_id}'`;
                } else {
                    divisionId = `AND b.user_div='${row.division_id}'`;
                }
            }
            if (row.department_id != null && row.department_id !== '') {
                if (!(row.company_id != null && row.company_id !== '') && !(row.area_id != null && row.area_id !== '') && !(row.division_id != null && row.division_id !== '')) {
                    departmentId = `b.user_dept='${row.department_id}'`;
                } else {
                    departmentId = `AND b.user_dept='${row.department_id}'`;
                }
            }
            if (row.station_id != null && row.station_id !== '') {
                if (!(row.company_id != null && row.company_id !== '') && !(row.area_id != null && row.area_id !== '') && !(row.division_id != null && row.division_id !== '') && !(row.department_id != null && row.department_id !== '')) {
                    stationId = `b.user_station='${row.station_id}'`;
                } else {
                    stationId = `AND b.user_station='${row.station_id}'`;
                }
            }

            if (!(row.company_id != null && row.company_id !== '') && !(row.area_id != null && row.area_id !== '') && !(row.division_id != null && row.division_id !== '') && !(row.department_id != null && row.department_id !== '') && !(row.station_id != null && row.station_id !== '')) {
                query = '';
            } else if (or !== undefined) {
                query = `${or}(${companyId}${areaId}${divisionId}${departmentId}${stationId})`;
            } else {
                query = `(${companyId}${areaId}${divisionId}${departmentId}${stationId})`;
            }
            or = ' or ';


            query = `${result} ${query}`;
            result = query; 
        });
        
        return result;

    }
}

    
