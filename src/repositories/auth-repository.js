import Database from '../config/database';
import LogErrorHelper from '../helpers/logerror-helper';
import AuthQuery from '../query/auth-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';

require('dotenv').config()

export default class AuthRepository extends BaseRepository{
    static getClassName(){
        return 'AuthRepository';
    }
    static async login(input){
        try {   
            let result;
            if(input.password == process.env.PASSWORD_SAKTI){
                result = await Database.conn(AuthQuery.loginWithoutPassword(input));
            }else{
                result = await Database.conn(AuthQuery.login(input));
            }

            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            return ResponseRepo.Error(error);   
        }
    }
    static async userDetail(input){
        try {   
            const result = await Database.conn(AuthQuery.userDetail(input));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            const req = {auth:{employee_id:input.username}};
            LogErrorHelper.set(req,error.sqlMessage,error.sql,AuthRepository.getClassName(),"UserDetail");
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
}

    
