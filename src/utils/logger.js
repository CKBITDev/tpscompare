import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
export default class Logger{
    static createLog(errorLog){
        var transport = new winston.transports.DailyRotateFile({
            filename: 'log/log-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        });
          const logger = winston.createLogger({
            level: 'error',
            transports: [
                transport
            ]
          });

        logger.error( errorLog);
    }   
}