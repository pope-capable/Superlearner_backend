const database = require('../src/models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class TeamServices {

    // User Signup
    static async createTeam(data) {
        try {
            return await database.teams.create(data);
        } catch (error){
            throw error;
        }
    }
}

module.exports = TeamServices;