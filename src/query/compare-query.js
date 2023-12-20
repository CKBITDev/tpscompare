export default class CompareQuery{
    static insert(){
        const query =  `INSERT INTO at_absent SET ?`;
        return query;
    }
    
}