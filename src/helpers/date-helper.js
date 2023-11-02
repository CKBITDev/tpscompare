export default class DateHelper{
    static dateNow(){
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is month 0
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    static dateTimeNow(){
        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
        const day = String(currentDateTime.getDate()).padStart(2, '0');
        const hours = String(currentDateTime.getHours()).padStart(2, '0');
        const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
        const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDateTime;
    }


    static dateTimeNowJoin(){
        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
        const day = String(currentDateTime.getDate()).padStart(2, '0');
        const hours = String(currentDateTime.getHours()).padStart(2, '0');
        const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
        const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

        const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
        return formattedDateTime;
    }

    static timeFormat(timeParse,additionalTime = ''){
        
        var time = new Date("1990-01-02 " + timeParse);
        if(additionalTime){
            time.setMinutes(time.getMinutes() + additionalTime);
        }
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');

        const formatted_time = `${hours}:${minutes}:00`;
        
        return formatted_time;
    }
    static monthFormat(date){
        
        const currentDateTime = new Date(date);
        const year = currentDateTime.getFullYear();
        const month = String(currentDateTime.getMonth() + 1);

        const formattedDateTime = `${year}-${month}`;
        return formattedDateTime;
    }

    static increaseMonthDateNow(monthNumber){
        const currentDate = new Date();
        currentDate.setMonth(monthNumber);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is month 0
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }
    static increaseDayDate(date,dayNumber){
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + dayNumber);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is month 0
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }


 
}