const axios = require('axios');

export default class TimezoneHelper{
    
    static async getTimeZone(latLong) {
        latLong = latLong.replace(" ","")
        const timestamp = Math.floor(Date.now() / 1000);
        const apiKey = 'AIzaSyAQkDuK0Wjte6F98O51mB_Ad-mlMpegeJ4';
        
        const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latLong}&timestamp=${timestamp}&language=id&key=${apiKey}`;
        const response = await axios.get(url);

        const data = response.data;
        const timeNow = new Date(timestamp * 1000 + data.dstOffset * 1000 + data.rawOffset * 1000).toISOString().substr(11, 8);
    
        return {
            waktu: timeNow,
            zonaName: data.timeZoneName
        };
    }
    
}