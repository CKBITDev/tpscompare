
import AuthRepository from '../repositories/auth-repository'
import Response from '../responses/response';
import jwt from 'jsonwebtoken'
import {TOKEN,JWT_EXPIRED} from "@env"

export default class AuthController{
    static async login(req,res){
        let dataBody = req.body;
        const username = dataBody.username;
        const password = dataBody.password;
        if (!username || !password) {
            return Response.Error(req,res,"username or password can't be empty")
        }
        try {
            const auth = await AuthRepository.login(req,dataBody);
            if (auth.data.length == 0) {
              return Response.Error(req,res,"Username and password wrong")
            } else {
              const response = await AuthRepository.userDetail(req,auth.data[0]);
              if(!response.success){
                return Response.Error(req,res,response.message)
              }
              const data = response.data;
              // var dataString =JSON.stringify(data);
              // var dataUser =  JSON.parse(dataString);
              //======= create jwt token
              const jwtSecret = TOKEN;
              const token = jwt.sign(data,jwtSecret,
                  {expiresIn: JWT_EXPIRED}
              );
              data.token = token;
              //========================
              return Response.Success(res,data,"Login success");
        
            }
          } catch (error) {
            return Response.Error(req,res,error.message,true);
          }
        
    }
}