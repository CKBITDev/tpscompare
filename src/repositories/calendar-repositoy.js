import Database from '../config/database';
import LogErrorHelper from '../helpers/logerror-helper';
import CalendarQuery from '../query/calendar-query';
import ResponseRepo from '../responses/repo-response';
import ErrorHandler from '../helpers/error-handler';
import BaseRepository from './base-repository';


export default class CalendarRepository extends BaseRepository{
    static getClassName(){
        return 'CalendarRepository';
    }
    static async leaveData(req,data){
        try {    
            const result = await Database.conn(CalendarQuery.leaveQuery(data));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }

    static async workingDayData(req,data){
        try {    
            const result = await Database.conn(CalendarQuery.workingDaysQuery(data));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }
    static async eventData(req,data){
        try {    
            const result = await Database.conn(CalendarQuery.eventDataQuery(data));
            if(result.length == 0){
                return ResponseRepo.Success(result);
            }
            return ResponseRepo.Success(result);
               
        } catch (error) {
            ErrorHandler.RepoHandler(error);
            return ResponseRepo.Error("Something wrong in the server");   
        }
    }

    
}

    
