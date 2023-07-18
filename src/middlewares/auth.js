
import jwt from 'jsonwebtoken'
const jwtSecret = process.env.TOKEN;
import Response from '../responses/response';

export default class MiddlewareAuth{
    static async isAuthorized(req,res, next){
        const token = req.headers.authorization;
        if (token) {
            const tokenFinal = token.replace("Bearer ","")
            jwt.verify(tokenFinal, jwtSecret, (err, decodedToken) => {
                if (err) {
                    return Response.Error(req,res,"Not authorized")
                } else {
                    req.auth = decodedToken;
                    next() 
                }
            })
        } else {

            return Response.Error(req,res,"Not authorized, token not available")
        }
    }
}
module.exports = MiddlewareAuth