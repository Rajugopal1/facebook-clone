const error = require('../middlewares/error')
const registerController = require('../controllers/register');
const login = require("../controllers/login");
const {paramsId, headerUserId} = require('../middlewares/objectId')
const { userAuth, isLogin } = require('../middlewares/auth');
const { verifyRoles } = require('../middlewares/auth');
const roles_list = require('../config/roles');
const userController = require('../controllers/userActions');
const postController = require('../controllers/post');


module.exports = (app) => {

app.post('/user/login', login.userLogin);
// app.post('/user/logout',[userAuth, isLogin], login.userLogout);
app.post('/user/changepassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.changePassword);
app.post('/user/resetpassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.resetPassword);
app.post('/user/updatepassword',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), login.updatePassword);
app.post('/user/registration', registerController.createUser);
app.post('/user/sendfriendrequest/:id',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.sendFriendRequest);
app.post('/user/acceptfriendrequest/:id',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.acceptFriendRequest);
app.post('/user/declinefriendrequest/:id',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.declineFriendRequest);
app.post('/user/unfriend/:id',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.unfriend);
app.get('/user',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), registerController.getAllUser);
app.get('/user/friendlist',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.getFriendList);
app.get('/user/friendrequest',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), userController.getFriendRequest);
app.get('/user/:id', [userAuth, isLogin,paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), registerController.getUser);

//Post

app.post('/myprofile/post',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), postController.createPost);
app.get('/myprofile/post',[userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), postController.getAllPosts);

app.delete('/myprofile/post/:id',[userAuth, isLogin, paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), postController.deletePost);

//Events
// app.post('/event', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventController.createEvent);
// app.get('/event', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.getAllEvents);
// app.get('/event/byuser', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.getEventsByUserID);
// app.get('/event/invitations', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.invitations);
// app.get('/event/list', [userAuth, isLogin],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.list);
// app.get('/event/:id', [userAuth, isLogin,paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.getEventById);
// app.get('/eventdetails/:id', [userAuth, isLogin, paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), eventDashboard.eventDetails);
// app.patch('/event/:id', [userAuth, isLogin, paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), eventController.updateEvent);
// app.delete('/event/:id', [userAuth, isLogin, paramsId, headerUserId],verifyRoles(roles_list.ADMIN,roles_list.USER), eventController.deletedEvent);

app.use(error);

}


