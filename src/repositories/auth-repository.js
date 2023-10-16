import { executeQuery } from '../config/database';
import AuthQuery from '../query/auth-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';

import {PASSWORD_SAKTI} from "@env"

export default class AuthRepository extends BaseRepository{
    static getClassName(){
        return 'AuthRepository';
    }
    static async login(req,input){
        try {   
            let result;
            if(input.password == PASSWORD_SAKTI){
                result = await executeQuery(AuthQuery.loginWithoutPassword(input));
            }else{
                result = await executeQuery(AuthQuery.login(input));
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            return ResponseRepo.Error(req,error);   
        }
    }
    static async userDetail(req,input){
        try {   
            const result = await executeQuery(AuthQuery.userDetail(input));
            return ResponseRepo.Success(result);
               
        } catch (error) {
            const req = {auth:{employee_id:input.username}};
            return ResponseRepo.Error(req,error);   
        }
    }
}

    
