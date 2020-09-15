const database = require('../src/models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class UserTeamServices {

    // User Signup
    static async createLink(data) {
        try {
            return await database.user_teams.create(data);
        } catch (error){
            throw error;
        }
    }

    // get all teams user belongs to
    static async getUserTeams(data) {
        try {
            return await database.user_teams.findAll({where: {userId: data.userId, status: data.status}, include: [database.teams]});
        } catch (error){
            throw error;
        }
    }
}

module.exports = UserTeamServices;