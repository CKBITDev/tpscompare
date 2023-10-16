import { executeQuery } from '../config/database';
import MainQuery from '../query/main-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';

import ErrorHandler from '../helpers/error-handler';

export default class MainRepository extends BaseRepository{
    static async dataAbsent(input){
        try {   
            input.employee_id = input.auth.employee_id; 
            const result = await executeQuery(MainQuery.dataAbsent(input));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
              
        } catch (error) {
            
            return ResponseRepo.Error(error);   
        }
    }
    static async dataDevice(data){
        try {    
            const result = await executeQuery(MainQuery.getDeviceId(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
              
        } catch (error) {
            
            return ResponseRepo.Error(error);   
        }
    }


    static async saveDevice(data){
        try {    
            const result = await executeQuery(MainQuery.saveDevice(),data);
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
              
        } catch (error) {
            
            return ResponseRepo.Error(error);   
        }
    }

    static async dataDeviceEmpId(data){
        try {    
            const result = await executeQuery(MainQuery.getDeviceIdByEmployeeId(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
              
        } catch (error) {
            
            return ResponseRepo.Error(error);   
        }
    }
    static async versionApp(input){
        try {    
            const result = await executeQuery(MainQuery.versionApp(input));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            
            return ResponseRepo.Error(error);   
        }
    }

    static async paramReminderAttendance(){
        try {    
            const result = await executeQuery(MainQuery.paramReminderAttendance());
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            return ResponseRepo.Error(error);   
        }
    }

    static async getQrCode(input){
        try {    
            const result = await executeQuery(MainQuery.dataQrCode(input));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            return ResponseRepo.Error(error);   
        }
    }
}

    
