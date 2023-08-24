import {HOST,PORT} from "@env"
import express  from 'express';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import router from "./routes/router"
import cors from "cors"
import database from "./config/database";
import { loggers } from "winston";
import Logger from "./utils/logger";


var corsOptions = {
    origin: ['http://' + HOST + ':' + PORT],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())
//app.use(middlewareLocale);
app.use(router); 
var server = app.listen(PORT, async function () {

    Logger.createLog("test")
    const res = await database.conn('select * from t_personel limit 1');
    console.log(res)
    var host = HOST
    var port = PORT
    console.log("app listening at http://%s:%s", host, port)
})
