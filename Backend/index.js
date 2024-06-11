import dotenv from "dotenv";
dotenv.config();

import app from "./server.js";
import mongodb from "mongodb";
import UsersDAO from "./dao/usersDAO.js";
import ContentsDAO from "./dao/contentsDAO.js";
import CronScheduler from "./cronScheduler.js";

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.u3tfrvq.mongodb.net/?retryWrites=true&w=majority`
const port = 8000;

async function updateStatusForExpiredEntries() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
  
      const db = client.db("users");
      const contents = db.collection("contents");
  
      const currentDateTime = new Date();
      const currentDate = currentDateTime.toISOString().split("T")[0];
      const currentTime = `${currentDateTime.getHours()}:${currentDateTime.getMinutes()}`;
  
      const query = {
        publishDate: { $lte: currentDate },
        publishTime: { $lte: currentTime },
        status: { $ne: "published" }
      };
  
      const updateResult = await contents.updateMany(query, {
        $set: { status: "published" }
      });
  
      console.log(`${updateResult.modifiedCount} entries updated to 'published' status.`);
  
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      await client.close();
    }
  }
  

MongoClient.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
)
.catch(err => {
    console.error(err.stack);
    process.exit(1);
})
.then(async client => {
    await UsersDAO.injectDB(client);
    await ContentsDAO.injectDB(client);
    await CronScheduler.injectDB(client);
    await updateStatusForExpiredEntries(); // Call the function to update status upon startup
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
});
