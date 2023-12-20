import {HOST,PORT} from "@env"
import express  from 'express';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import router from "./routes/router"
import cors from "cors"
import { databaseInit } from "./config/database";
import path from "path";


var corsOptions = {
    origin: ['http://' + HOST + ':' + PORT],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
app.set('view engine', 'ejs');
// Specify the directory where your views are located
app.set('views', path.join(__dirname, 'views')); // Change 'views' to your custom directory name


app.use(cors(corsOptions))
databaseInit();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())
//app.use(middlewareLocale);
app.use(router); 
app.listen(PORT)
