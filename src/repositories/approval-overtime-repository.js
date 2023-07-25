
import Database from '../config/database';
import OvertimeQuery from '../query/overtime-query';
import ResponseRepo from '../responses/repo-response';
import ErrorHandler from '../helpers/error-handler';
import BaseRepository from './base-repository';
import LogErrorHelper from '../helpers/logerror-helper';
import ApprovalOvertimeQuery from '../query/approval-overtime-query';

export default class ApprovalOvertimeRepository extends BaseRepository{
    static getClassName(){
        return 'ApprovalOvertimeRepository';
    }
    static async data(req,data){
        try {   
            data.employeeLike = ''; 
            if(data.employee_name){
                data.employeeLike = ` AND b.user_req_name LIKE '%${data.employee_name}%'`;
            }
            var result = await Database.conn(ApprovalOvertimeQuery.data(data));
            for (let index = 0; index < result.length; index++) {
                const res = result[index];
                const worktypeData = await Database.conn(OvertimeQuery.dataWorktypeByCode({worktype_code:res.worktype_code.toString().replaceAll("|",",").slice(0, -1)}),data);
                let worktype_desc = [];
                worktypeData.forEach(workType => {
                    worktype_desc.push(workType.worktype_desc + "\n");
                });
                result[index].worktype_desc = worktype_desc.join(" - ");
            }
            
            return ResponseRepo.Success(result);
               
        } catch (error) {
            return ResponseRepo.Error(req,error);   
        }
    }
    
}

    
