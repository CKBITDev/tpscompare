import AbsentController from '../controllers/absent-controller';
import ApprovalAbsensiController from '../controllers/approval-absensi-controller';
import ApprovalOvertimeController from '../controllers/approval-overtime-controller';
import AuthController from '../controllers/auth-controller';
import CalendarController from '../controllers/calendar-controller';
import ClosingApprovalController from '../controllers/closing-approval-controller';
import MainController from '../controllers/main-controller';
import OvertimeController from '../controllers/overtime-controller';
import OvertimeStatusController from '../controllers/overtime-status-controller';
import ClosingSettlementController from '../controllers/closing-settlement-controller';

import middlewareAuth from '../middlewares/auth';
import HrValidationController from '../controllers/hr-validation-controller';
import TestLogin from '../tests/login/test_login';
const Router = require('express-group-router');
let router = new Router();
const isAuthorized = middlewareAuth.isAuthorized;

router.group("/api/v1/mobile", (router) => {

    router.get("/test", TestLogin.testing);

    router.group([isAuthorized],(router) => {
        router.post("/cek_status_absent", MainController.statusAbsent);
        router.post("/cek_version_app", MainController.cekVersionApp);
        router.get("/get_param_reminder_attendance", MainController.getParamReminderAttendance);
        router.post("/get_data_qrcode", MainController.getQrCode);
        router.post("/save_device", MainController.saveDeviceId);
        

        router.group("/absent", (router) => {
            router.post("/check_in", AbsentController.checkIn);  
            router.post("/check_out", AbsentController.checkOut);  
            router.get("/data_activity", AbsentController.dataActivity);  
        }); 

        router.group("/calendar", (router) => {
            router.post("/load_absent", CalendarController.loadTglAbsent);
            router.post("/add_justification", CalendarController.addJustification);    
        }); 
        router.group("/approval_absensi", (router) => {
            router.get("/view_approval", ApprovalAbsensiController.viewApproval);
            router.post("/view_approval", ApprovalAbsensiController.viewApproval);
            router.post("/approve", ApprovalAbsensiController.approveDataLate);
            router.post("/reject", ApprovalAbsensiController.rejectDataLate);
            router.post("/approve_outside", ApprovalAbsensiController.approveDataOutside);
            router.post("/reject_outside", ApprovalAbsensiController.rejectDataOutside);
        }); 

        router.group("/overtime", (router) => {
            router.get("/hr_validation", OvertimeController.hrValidation);
            router.get("/list", OvertimeController.list);
            router.get("/approval_flow", OvertimeController.approvalFlow);
            router.get("/work_type", OvertimeController.workType);
            router.post("/cancel_ot", OvertimeController.cancelOT);
            router.post("/create", OvertimeController.createdData);
            router.post("/update", OvertimeController.updateData);
        }); 

        router.group("/approval_overtime", (router) => {
            router.get("/list", ApprovalOvertimeController.list);
            router.post("/list", ApprovalOvertimeController.list);
            router.post("/approve", ApprovalOvertimeController.approve);
            router.post("/reject", ApprovalOvertimeController.reject);
        }); 

        router.group("/closing_settlement", (router) => {
            router.get("/list", ClosingSettlementController.list);
            router.post("/ot_param", ClosingSettlementController.otParam);
            router.post("/update", ClosingSettlementController.updateClosing);
            router.post("/reject", ClosingSettlementController.reject);
        }); 

        router.group("/closing_approval", (router) => {
            router.get("/list", ClosingApprovalController.list);
            router.post("/list", ClosingApprovalController.list);
            router.get("/cost_status", ClosingApprovalController.getCostStatus);

            router.post("/approve", ClosingApprovalController.approve);
            router.post("/approve_multiple", ClosingApprovalController.approveMultiple);
            router.post("/reject", ClosingApprovalController.reject);
            
        }); 

        router.group("/overtime_status", (router) => {
            router.get("/list", OvertimeStatusController.list);
            router.post("/list", OvertimeStatusController.list);
        }); 



        router.group("/hr_validation", (router) => {
            router.get("/list", HrValidationController.list);
            router.post("/list", HrValidationController.list);

            router.post("/reject", HrValidationController.reject);
            router.post("/approve", HrValidationController.approve);
        }); 

    }) 
       
    router.post('/login', AuthController.login) 
});

router.get('/', async (req,res)=> {
    return res.send("wellcome to api hris :)")
}) 
// router.group([middlewareAuth.isAuthorized]
let listRoutes = router.init();
module.exports = listRoutes;