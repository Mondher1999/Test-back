import  express  from "express";
import { body } from "express-validator";
import {  getAllUsers,createUser,deleteOnce, getOnce, IsActivated, logIn, patchOnce, register, resetPass,UpdatePass, UpdateProfile} from "../controllers/user.js";
import {sendConfirmationEmail} from "../middlewares/nodemailer.js"
import { verifyUser } from "../controllers/user.js";
import VerifyToken from "../middlewares/verifyToken.js"; 
import multer from "multer";

const router = express.Router();

 ///////////////////////////////////////
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/profile');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
  });
  const upload = multer({ storage: storage });
//////////////////////////////////////////

/////////////////////////////////////////////////////////
router.route('/register').post(register); 
router.route('/login').post(logIn);
router.route('/verify').post(verifyUser);
router.route('/reset').post(resetPass);
router.patch('/updatepass/:email',UpdatePass);
router.get('/getAllUsers', getAllUsers);
router.post('/adduser', createUser);
router.put('/updateprofile/:id',UpdateProfile);








router.route('/status').post(IsActivated);
router
    .route('/:id')
    .get(VerifyToken, getOnce)
    .patch(VerifyToken, patchOnce)
    .delete(VerifyToken, deleteOnce);
////////////////////////////////////////////////////////



export default router;
