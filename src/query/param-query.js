export default class ParamQuery{
    static paramOvertime(paramId){
        const query =  `select * from employee.t_params where param_id = '${paramId}'`;
        
        return query;
    }
}