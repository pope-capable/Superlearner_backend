const database = require('../src/models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class DiskServices {

    // User Signup
    static async createDisck(newDisk) {
        try {
            return await database.disk.create(newDisk);
        } catch (error){
            throw error;
        }
    }


    // update user Information
    static async updateDisk(data) {
        try {
            return await database.disk.update(data, {where: {userId: data.userId},
                returning: true,
                plain: true});
        } catch (error) {
            throw error
        }
     }

    // get disk update for one user
    static async findDisk(data) {
        try {
            return await database.disk.findOne({where: {userId: data.userId}});
        } catch (error) {
            throw error
        }
    }

}

module.exports = DiskServices;