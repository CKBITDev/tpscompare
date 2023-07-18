
import AuthRepository from '../repositories/auth-repository'
import Response from '../responses/response';
import jwt from 'jsonwebtoken'

export default class AuthController{
    static async login(req,res){
        let dataBody = req.body;
        const username = dataBody.username;
        const password = dataBody.password;
        if (!username || !password) {
            return Response.Error(req,res,"username or password can't be empty")
        }
        try {
            const auth = await AuthRepository.login(dataBody);

            if (auth.data.length == 0) {
              return Response.Error(req,res,"Username and password wrong")
            } else {

              const response = await AuthRepository.userDetail(dataBody);
              if(!response.success){
                return Response.Error(req,res,response.message)
              }
              const data = response.data;
              // var dataString =JSON.stringify(data);
              // var dataUser =  JSON.parse(dataString);
              //======= create jwt token
              const jwtSecret = process.env.TOKEN;
              const maxAge = process.env.SESSION_TIMEOUT * 60 * 60;
              const token = jwt.sign(data,jwtSecret,
                  {expiresIn: maxAge}
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