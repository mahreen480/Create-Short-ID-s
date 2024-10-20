const { getUser } = require("../service/auth");

async function restrictToLoggedInToUserOnly(req,res,next){
    //if userid not found
    const userUid = req.cookies?.uid;
    if(!userUid) return res.redirect("./login")

    //if user not found
    const user = getUser(userUid);
    if(!user) return res.redirect("./login")

        //user and userid both are found
        req.user = user;
        next();
}

module.exports={
    restrictToLoggedInToUserOnly
}