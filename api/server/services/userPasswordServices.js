const database = require('../src/models')
const Sequelize = require('sequelize');

class PasswordServices {

    // User Signup
    static async createPassword(data) {
        try {
            return await database.user_passwords.create(data);
        } catch (error){
            throw error;
        }
    }
}

module.exports = PasswordServices;