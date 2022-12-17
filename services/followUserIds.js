const Follow = require("../models/follow")

const followUserIds = async (identityUserId) => {
    try {
        // sacar info 
        let following = await Follow.find({ "user": identityUserId })
            .select({ "followed": 1, "_id": 0 })
            .exec();
        let followers = await Follow.find({ "followed": identityUserId })
            .select({ "user": 1, "_id": 0 })
            .exec();
        // procesar array de identificadores
        let followingClean = [];
        let followersClean = [];

        following.forEach(follow => {
            followingClean.push(follow.followed)
        })
        followers.forEach(follow => {
            followersClean.push(follow.user)
        })
        return {
            following: followingClean,
            followers: followersClean
        }
    } catch (e) { return {} }
}

const followThisUser = async (identityUserId, profileUserId) => {
    // sacar info 
    let following = await Follow.findOne({ "user": identityUserId, "followed": profileUserId }).select({ "user": 1,"followed": 1, "_id": 0 })//perfil identificado
    let follower = await Follow.findOne({ "user": profileUserId, "followed": identityUserId }).select({ "user": 1,"followed": 1, "_id": 0 })// perfil de la url
    return {
        following,
        follower
    }
}

module.exports = {
    followUserIds,
    followThisUser
}