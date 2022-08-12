const error = require('../middlewares/error')
const registerController = require('../controllers/register');
const login = require("../controllers/login");
const {paramsId, headerUserId} = require('../middlewares/objectId')
const { userAuth, isLogin } = require('../middlewares/auth');
const { verifyRoles } = require('../middlewares/auth');
const roles_list = require('../config/roles');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' , limits: {fileSize: 500000}})



module.exports = (app) => {

app.post('/user/login', login.userLogin);
// app.post('/user/logout',[userAuth, isLogin], login.userLogout);
app.post('/user/changepassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.changePassword);
app.post('/user/resetpassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.resetPassword);
app.post('/user/updatepassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.updatePassword);
app.post('/user/registration',upload.single('image'), registerController.createUser);
app.get('/user',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), registerController.getAllUser);
app.get('/user/:id', [userAuth, isLogin,paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), registerController.getUser);


app.use(error);

}


