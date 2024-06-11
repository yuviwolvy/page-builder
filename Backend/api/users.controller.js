import UsersDAO from "../dao/usersDAO.js";

export default class UsersController{
    static async apiPostUser(req, res, next){
        try{
            const email = req.body.email;
            const password = req.body.password;

            const userResponse = await UsersDAO.addUser(
                email,
                password,
            )
            res.json({status:"success"});
        } catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiGetUser(req, res, next){
        try{
            let id = req.params.id || {};

            let user = await UsersDAO.getUserByEmailId(id);

            if(user.length == 0){
                res.json({status:"new user"});
            } else {
                res.json(user);
            }

        } catch(e){
            console.log(`api, ${e}`);
            res.status(500).json({error:e.message});
        }
    }
}