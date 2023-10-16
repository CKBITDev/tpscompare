import AuthController from "../../controllers/auth-controller";
import AuthRepository from "../../repositories/auth-repository";
import Logger from "../../utils/logger";

export default class TestLogin{

    static async testingData(result){
        Logger.createLog(result);
    }
    static async testing(req,res){
        const fs = require("fs");
        let dataPromise = [];
        try {
            const dataJson =  fs.readFileSync("./src/tests/login/data.json", "utf8");
            const data = JSON.parse(dataJson);
            data.forEach(dataLogin => {
                req.body = dataLogin
                console.log(dataLogin)
                let promise =  new Promise(function (resolve, reject) {
                    setTimeout(async () => {
                        resolve(await AuthRepository.login(req,req.body))
                    });
                });
                dataPromise.push(promise);
            });
        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
        console.log("dataPromise");
        

        await Promise.all(dataPromise).then(function (values) {
            // values.forEach(value => {
            //     console.log(value.data)
            // });
        });
        return res.send({
            message:"success",
        })
    }
}
