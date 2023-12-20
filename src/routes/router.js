import CompareController from '../controllers/compare-controller';
import MainController from '../controllers/main-controller';
import NewController from '../controllers/new-controller';
const Router = require('express-group-router');
let router = new Router();

router.get("/test", NewController.outbound);


router.get("/deleting", CompareController.deleting);
router.get("/generate", CompareController.generate);

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