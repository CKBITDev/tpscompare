import CompareController from '../controllers/compare-controller';
import DeletingController from '../controllers/deleting-controller';
import GenerateCompareController from '../controllers/generate-compare-controller';
import GenerateCompare2Controller from '../controllers/generate-compare2-controller';
import MainController from '../controllers/main-controller';
import NewController from '../controllers/new-controller';
const Router = require('express-group-router');
let router = new Router();

router.get("/test", NewController.outbound);


router.get("/deleting", CompareController.deleting);
router.get("/generate", CompareController.generate);


router.group("/compare-generator", (router) => {
    router.get("/inbound", GenerateCompareController.inbound);
    router.get("/outbound", GenerateCompareController.outbound);
    router.get("/adjustment_x", GenerateCompareController.adjustmentX);
    router.get("/adjustment_y", GenerateCompareController.adjustmentY); 
});
router.group("/compare-generator2", (router) => {
    router.get("/inbound", GenerateCompare2Controller.inbound);
    router.get("/outbound", GenerateCompare2Controller.outbound);
    router.get("/adjustment_x", GenerateCompare2Controller.adjustmentX);
    router.get("/adjustment_y", GenerateCompare2Controller.adjustmentY); 
});

router.group("/compare", (router) => {
    router.get("/inbound", CompareController.inbound); 
    router.get("/outbound", CompareController.outbound); 
    router.get("/adjustment_x", CompareController.adjustmentX);
    router.get("/adjustment_y", CompareController.adjustmentY); 
});

router.get('/', MainController.main) 
// router.group([middlewareAuth.isAuthorized]
let listRoutes = router.init();
module.exports = listRoutes;