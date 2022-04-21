const error = require('../middlewares/error')
const registerController = require('../controllers/register');
const login = require("../controllers/login");
const {paramsId, headerUserId} = require('../middlewares/objectId')
const { userAuth, isLogin } = require('../middlewares/auth');
const { verifyRoles } = require('../middlewares/auth');
const roles_list = require('../config/roles');
const userController = require('../controllers/userActions');
const postController = require('../controllers/post');
const community = require('../controllers/community');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



module.exports = (app) => {

app.post('/user/login', login.userLogin);
// app.post('/user/logout',[userAuth, isLogin], login.userLogout);
app.post('/user/changepassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.changePassword);
app.post('/user/resetpassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.resetPassword);
app.post('/user/updatepassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.updatePassword);
app.post('/user/registration',upload.single('image'), registerController.createUser);
app.post('/user/sendfriendrequest/:id',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.sendFriendRequest);
app.post('/user/acceptfriendrequest/:id',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.acceptFriendRequest);
app.post('/user/declinefriendrequest/:id',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.declineFriendRequest);
app.post('/user/unfriend/:id',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.unfriend);
app.get('/user',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), registerController.getAllUser);
app.get('/user/friendlist',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.getFriendList);
app.get('/user/friendrequest',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.getFriendRequest);
app.get('/user/:id', [userAuth, isLogin,paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), registerController.getUser);

//Post

app.post('/myprofile/post',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER),upload.single('image'), postController.createPost);
app.get('/myprofile/post',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), postController.getAllPosts);
app.get('/mycommunity/feed',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), community.getFeed);
app.delete('/myprofile/post/:id',[userAuth, isLogin, paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), postController.deletePost);

app.use(error);

}


