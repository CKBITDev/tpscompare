import Database from '../config/database';
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
            const result = await Database.conn(ApprovalAbsentQuery.getViewApproval(data));
            
            return ResponseRepo.Success(result);
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }

    static async getAbsentApprove(req,data){
        try {    
            const result = await Database.conn(ApprovalAbsentQuery.getAbsentApprove(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
    
}

    
