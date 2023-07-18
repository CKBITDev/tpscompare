import Database from '../config/database';
import MainQuery from '../query/main-query';
import ParamQuery from '../query/param-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';


import ErrorHandler from '../helpers/error-handler';
export default class ParamRepository extends BaseRepository{
    static async paramOvertime(paramId){
        try {   
            const result = await Database.conn(ParamQuery.paramOvertime(paramId));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0].param_value.toString().split(";"));
              
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error(error);   
        }
    }
 

}

    
