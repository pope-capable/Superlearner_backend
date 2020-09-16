const UserTeamServices = require('../services/userTeamServices')
const Util = require('../utils/Utils');

const util = new Util();

class UserTeamsController {

    // get all teams a user has joined
    static async getJoinedTeams(req, res) {
        if (!req.params.userId) {
            util.setError(400, 'Please provide Valid details');
            return util.send(res);
        }

        try {
            var data = {status: "joined", userId: req.params.userId}
            UserTeamServices.getUserTeams(data).then(joinedTeams => {
                util.setSuccess(200, "Joined Teams", joinedTeams);
                return util.send(res);
            }).catch(err => {
                util.setError(400, 'Error getting teams');
                return util.send(res);
            })
        } catch (error) {
            console.log("MEEK", error)
            util.setError(400, 'An error occurred, please try again');
            return util.send(res);
        }
    }

    // get pending invitations
    static async getPendingTeams(req, res) {
        if (!req.params.userId) {
            util.setError(400, 'Please provide Valid details');
            return util.send(res);
        }

        try {
            var data = {status: "waiting", userId: req.params.userId}
            UserTeamServices.getUserTeams(data).then(pendingTeams => {
                util.setSuccess(200, "Pending Teams", pendingTeams);
                return util.send(res);
            }).catch(err => {
                util.setError(400, 'Error getting teams');
                return util.send(res);
            })
        } catch (error) {
            util.setError(400, 'An error occurred, please try again');
            return util.send(res);
        }
    }
}

module.exports = UserTeamsController;
