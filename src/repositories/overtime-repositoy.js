
import Database from '../config/database';
import OvertimeQuery from '../query/overtime-query';
import ResponseRepo from '../responses/repo-response';
import BaseRepository from './base-repository';
import LogErrorHelper from '../helpers/logerror-helper';

import ErrorHandler from '../helpers/error-handler';

export default class OvertimeRepository extends BaseRepository{
    static getClassName(){
        return 'OvertimeRepository';
    }
    static async dataOvertime(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.dataOvertime(data));
            for (let index = 0; index < result.length; index++) {
                const res = result[index];
                const worktypeData = await Database.conn(OvertimeQuery.dataWorktypeByCode({worktype_code:res.worktype_code.toString().replaceAll("|",",").slice(0, -1)}),data);
                let worktype_desc = [];
                worktypeData.forEach(workType => {
                    worktype_desc.push(workType.worktype_desc + "\n");
                });
                
                result[index].worktype_desc = worktype_desc.join(" - ");
            }
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }
    static async dataHrDivision(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.userHrDivision(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }

    static async dataRequestReport(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.dataRequestReport(data));
            if(result.length == 0){
                return false;
            }

            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }

    static async dataHoliday(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.dataHoliday(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }
    static async dataWorktype(req){
        try {    
            var result = await Database.conn(OvertimeQuery.dataWorktype());
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            return ResponseRepo.Error(req,error);   
        }
    }
    static async dataApprovalFlow(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.dataApprovalFlow(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }
    static async dataOvertimeByDate(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.dataOvertimeByDate(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }
    static async dataOvertimeById(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.dataOvertimeById(data));
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }
    static async insertOvertime(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.insertOvertime(),data);
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }

    static async insertOtHistory(req,data){
        try {    
            var result = await Database.conn(OvertimeQuery.insertOtHistory(),data);
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }

    static async updateOvertime(req,data,condition){
        try {    
            var result = await Database.conn(OvertimeQuery.updateOvertime(condition),data);
            if(result.length == 0){
                return false;
            }
            return ResponseRepo.Success(result[0]);
               
        } catch (error) {
            
            return ResponseRepo.Error(req,error);   
        }
    }
    
    
}

    
