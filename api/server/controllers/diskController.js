const DiskServices = require('../services/diskServices')
const Util = require('../utils/Utils');

const util = new Util();

class DiskController {

    // get disk reading for a user
    static async getUserDisk(req, res) {
        if (!req.params.userId) {
            util.setError(400, 'Please provide Valid details');
            return util.send(res);
        }

        try {
            DiskServices.findDisk(req.params).then(diskRecord => {
                let percentageUsed = Math.floor((diskRecord.used/diskRecord.allocated) * 100)
                util.setSuccess(200, "Joined Teams", {diskRecord, percentageUsed});
                return util.send(res);
            }).catch(err => {
                util.setError(400, 'Error getting disk usage');
                return util.send(res);
            })
        } catch (error) {
            util.setError(400, 'An error occurred, please try again');
            return util.send(res);
        }
    }

    // update disk usage
    static async updateDiskUsage(req, res) {
        if(!req.body.userId){
            util.setError(400, 'Request Incorrect')
            return util.send(res);
        }
        try {
            DiskServices.updateDisk(req.body).then(diskUpdated => {
                util.setSuccess(200, 'Disk Usage updated', diskUpdated)
                return util.send(res);
            }).catch(err => {
                util.setError(400, 'Error updating disk usage');
                return util.send(res);
            })
        } catch (error) {
            util.setError(400, 'An error occurred, please try again');
            return util.send(res);
        }
    }
}

module.exports = DiskController;
