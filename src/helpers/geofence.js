import  { executeQuery } from "../config/database";
import AbsentQuery from "../query/absent-query";

export default class Geofence {
    static async cekGeofenceLocation(dataBody) {
      let latLong = dataBody.long_lat;
      let qr_location_id = dataBody.qr_location_id;
        let latLong2 = latLong.split(" ");
        let lat, long;
        if (latLong2.length > 2) {
          latLong = latLong.replace(" ", "");
          [lat, long] = latLong.split(",");
        } else {
          [lat, long] = latLong2;
        }
      
        let data;
        if (qr_location_id) {
           data = await executeQuery(AbsentQuery.qrData({qr_location_id:qr_location_id}));
        } else {
           data = await executeQuery(AbsentQuery.qrDataAll());
        }
      
        const location = [parseFloat(lat), parseFloat(long)];
      
        for (const value of data) {
          const latLngArr = value.location_latlng_poly.split(";");
          const locationGeofence = [];
          for (const valueLatLng of latLngArr) {
            const [latLngLat, latLngLon] = valueLatLng.split(",");
            locationGeofence.push([parseFloat(latLngLat), parseFloat(latLngLon)]);
          }
      
          const res = this.checkGeofencePolygon(location, locationGeofence);
      
          if (res) {
            return 1;
          }
        }
      
        return 0;
      }
      
      static checkGeofencePolygon(point, polygon) {
        const latitude = point[0];
        const longitude = point[1];
      
        let inside = false;
        let j = polygon.length - 1;
      
        for (let i = 0; i < polygon.length; i++) {
          const polyLat1 = polygon[i][0];
          const polyLon1 = polygon[i][1];
          const polyLat2 = polygon[j][0];
          const polyLon2 = polygon[j][1];
      
          const intersect =
            (polyLon1 > longitude) !== (polyLon2 > longitude) &&
            latitude < ((polyLat2 - polyLat1) * (longitude - polyLon1)) / (polyLon2 - polyLon1) + polyLat1;
      
          if (intersect) {
            inside = !inside;
          }
      
          j = i;
        }
      
        return inside;
      }
      
}