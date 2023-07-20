import Database from '../config/database';
import ErrorHandler from '../helpers/error-handler';
import AbsentQuery from '../query/absent-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';


export default class AbsentRepository extends BaseRepository{
    static getClassName(){
        return 'AbsentRepository';
    }
    static async insert(req,data){
        try {    
            const result = await Database.conn(AbsentQuery.insert(),data);
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
    static async checkOut(req,data,condition){
        try {    
            const query = AbsentQuery.checkOut(condition);
            const result = await Database.conn(query,data);
            
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
    static async update(req,data,condition){
        try {    
            const query = AbsentQuery.update(condition);
            const result = await Database.conn(query,data);
            return ResponseRepo.Success(result);
               
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
    static async getLocationQr(req,input){
        try {    
            const result = await Database.conn(AbsentQuery.qrData(input));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }

    static async getPersonelData(req,data){
        try {    
            const result = await Database.conn(AbsentQuery.getPersonelData(data));
            
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }   
            return ResponseRepo.Success(result[0]);
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
    

    static async getAbsentData(req,data){
        try {    
            const result = await Database.conn(AbsentQuery.getDataAbsent(data));
            
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

    
