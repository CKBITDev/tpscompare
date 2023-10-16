import { executeQuery } from '../config/database';
import AbsentQuery from '../query/absent-query';
import ErrorHandler from '../helpers/error-handler';
import ApprovalAbsentQuery from '../query/approval-absent-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';


export default class ApprovalAbsentRepository extends BaseRepository{
    static getClassName(){
        return 'ApprovalAbsentRepository';
    }
    

    static async getViewApproval(req,data){
        try {    
            const result = await executeQuery(ApprovalAbsentQuery.getViewApproval(data));
            return ResponseRepo.Success(result);
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }

    static async getAbsentApprove(req,data){
        try {    
            const result = await executeQuery(ApprovalAbsentQuery.getAbsentApprove(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }
    
}

    
