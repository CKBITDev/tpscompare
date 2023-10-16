
import { executeQuery } from '../config/database';
import OvertimeQuery from '../query/overtime-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';
import LogErrorHelper from '../helpers/logerror-helper';
import OvertimeStatusQuery from '../query/overtime-status-query';
import FunctionHelper from '../helpers/function-helper';
import ParamRepository from './param-repository';


import ErrorHandler from '../helpers/error-handler';

export default class OvertimeStatusRepository extends BaseRepository{
    static getClassName(){
        return 'OvertimeStatusRepository';
    }
    static async dataOvertime(req,data){
        try {   
            data.employeeLike = ''; 
            if(data.employee_name){
                data.employeeLike = ` AND b.user_req_name LIKE '%${data.employee_name}%'`;
            }
            let paramWork = await ParamRepository.paramOvertime("MOT");
            let paramHoliday = await ParamRepository.paramOvertime("MHO");
           

            var result = await executeQuery(OvertimeStatusQuery.dataOvertime(data));

            for (let index = 0; index < result.length; index++) {
                const res = result[index];
                const worktypeData = await executeQuery(OvertimeQuery.dataWorktypeByCode({worktype_code:res.worktype_code.toString().replaceAll("|",",").slice(0, -1)}),data);
                let worktype_desc = [];
                worktypeData.forEach(workType => {
                    worktype_desc.push(workType.worktype_desc + "\n");
                });
                
                result[index].worktype_desc = worktype_desc.join(" - ");
                result[index].worktype_desc = worktype_desc.join(" - ");
                let getSelisih = await FunctionHelper.selisihJamMenit(res.settl_start_time,res.settl_end_time,res.day_type,res.day_type.toString(),paramWork.data,paramHoliday.data)
                
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
    
}

    
