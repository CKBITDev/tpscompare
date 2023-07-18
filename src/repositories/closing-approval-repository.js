
import Database from '../config/database';
import OvertimeQuery from '../query/overtime-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';
import LogErrorHelper from '../helpers/logerror-helper';
import ClosingApprovalQuery from '../query/closing-approval-query';
import FunctionHelper from '../helpers/function-helper';
import ParamRepository from './param-repository';


export default class ClosingApprovalRepository extends BaseRepository{
    static getClassName(){
        return 'ClosingApprovalRepository';
    }
    static async costStatus(req){
        try {   
            const result = await Database.conn(ClosingApprovalQuery.costStatus());
            return ResponseRepo.Success(result);
        }catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
    static async data(req,data){
        try {
            let paramWork = await ParamRepository.paramOvertime("MOT");
            let paramHoliday = await ParamRepository.paramOvertime("MHO");
            
            data.employeeLike = ''; 
            if(data.employee_name){
                data.employeeLike = ` AND b.user_req_name LIKE '%${data.employee_name}%'`;
            }
            
            var result = await Database.conn(ClosingApprovalQuery.data(data));
            
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
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
    
}

    
