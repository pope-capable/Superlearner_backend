const UserServices = require('../services/userServices')
const PasswordServices = require('../services/userPasswordServices')
const TeamServices = require('../services/teamServices')
const UserTeamServices = require('../services/userTeamServices')
const Diskservices = require('../services/diskServices')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const Util = require('../utils/Utils');
const DiskServices = require('../services/diskServices')

const util = new Util();

class UserController {

    // user signup process
    static async signUp(req, res) {
        var newuser = req.body
        if (!req.body.email || !req.body.user_name || !req.body.password) {
            util.setError(400, 'Please provide Valid details');
            return util.send(res);
        }
        
        let hashedPassword = await bcrypt.hash(req.body.password, 10).then(function(hash) {
            return hash
           });

        try {
            // create user record
            UserServices.signup(newuser).then(userCreated => {
                // create user password record
                PasswordServices.createPassword({userId: userCreated.id, password: hashedPassword}).then(passwordCreated => {
                    // create team
                    TeamServices.createTeam({name: `${userCreated.user_name}'s team`, }).then(teamCreated => {
                        // associate user to team in user team
                        UserTeamServices.createLink({userId: userCreated.id, teamId: teamCreated.id, isAdmin: true, status: "joined"}).then(linkCreated => {
                            // create user disk record
                            DiskServices.createDisck({userId: userCreated.id}).then(diskCreated => {
                                util.setSuccess(200, "User Created", userCreated);
                                return util.send(res);
                            }).catch(err => {
                                util.setError(400, 'disk creation failed');
                                return util.send(res);
                            })
                        }).catch(err => {
                            util.setError(400, 'User - team linking failed');
                            return util.send(res);
                        })
                    }).catch(err => {
                        util.setError(400, 'User team creation failed');
                        return util.send(res);
                    })
                }).catch(err => {
                    util.setError(400, 'User Creation incomplete');
                    return util.send(res);
                })
            }).catch(err => {
                util.setError(400, 'User Creation Failed');
                return util.send(res);
            })
        } catch (error) {
            util.setError(400, 'An error occurred, please try again');
            return util.send(res);
        }
    }

    // user login process 
    static async login(req, res) {
        if(!req.body.identifier || !req.body.password){
            util.setError(400, 'Request Incorrect')
            return util.send(res);
        }
        try {
            UserServices.findUser(req.body).then(userFound => {
                var user = JSON.parse(JSON.stringify(userFound))
                var password = user.user_password.password
                bcrypt.compare(req.body.password, password).then(function(result) {
                    if(result){
                        jwt.sign({user}, 'Serendipity?2050Rocks!', { expiresIn: '24h' }, (err, token) => {
                            delete user.user_password
                            var data = {user, token}
                              util.setSuccess(200, 'user authenticated', data)
                              return util.send(res);
                            })         
                      }
                      else{
                        util.setError(401, 'Incorrect Password')
                        return util.send(res);
                      }
                });
            }).catch(err => {
                util.setError(400, 'No record matches username or email');
                return util.send(res);
            })
        } catch (error) {
            util.setError(400, 'An error occurred, please try again');
            return util.send(res);
        }
    }

    // update User information
    static async updateUserInfo(req, res) {
        if(!req.body.userId){
            util.setError(400, 'Request Incorrect')
            return util.send(res);
        }
        try {
            UserServices.updateUser(req.body).then(userUpdated => {
                util.setSuccess(200, 'user information updated', userUpdated)
                return util.send(res);
            }).catch(err => {
                util.setError(400, 'Error updating user information');
                return util.send(res);
            })
        } catch (error) {
            util.setError(400, 'An error occurred, please try again');
            return util.send(res);
        }
    }
}

module.exports = UserController;
