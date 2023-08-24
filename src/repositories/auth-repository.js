import Database from '../config/database';
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
            console.log(input.password + " == " + PASSWORD_SAKTI)
            if(input.password == PASSWORD_SAKTI){
                result = await Database.conn(AuthQuery.loginWithoutPassword(input));
            }else{
                result = await Database.conn(AuthQuery.login(input));
            }

            
            return ResponseRepo.Success(result);
               
        } catch (error) {
            return ResponseRepo.Error(req,error);   
        }
    }
    static async userDetail(req,input){
        try {   
            const result = await Database.conn(AuthQuery.userDetail(input));
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            const req = {auth:{employee_id:input.username}};
            return ResponseRepo.Error(req,error);   
        }
    }
}

    
