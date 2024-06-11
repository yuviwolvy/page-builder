import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let users;

export default class UsersDAO{
    static async injectDB(conn){
        if(users){
            return;
        }

        try{
            users = await conn.db("users").collection("users");
        } catch(e){
            console.error(`Unable to establish connection handels in usersDAO: ${e}`);
        }
    }

    static async addUser( email, password ){
        try{
            const userDoc = {
                email: email,
                password: password,
            }

            return await users.insertOne(userDoc);
        } catch(e){
            console.error(`Unable to add user: ${e}`);
            return {error: e};
        }
    }

    static async getUserByEmailId( email ){
        try{
            const cursor = await users.find({ email: email});
            return cursor.toArray();
        } catch(e){
            console.error(`Unable to get user: ${e}`);
            return { error: e};
        }
    }
}