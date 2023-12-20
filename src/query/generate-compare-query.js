export default class GenerateCompareQuery{
    static insert(){
        const query =  `INSERT INTO at_absent SET ?`;
        return query;
    }
    
}