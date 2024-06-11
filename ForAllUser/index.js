import express from "express";
import cors from "cors";
import path from "path";

const app = express();
const publicPath = path.resolve("/home/ad.rapidops.com/yuvrajsinh.chauhan/Yuvrajsinh-Chauhan/Javascript Final Review Task/ForAllUser","public");
app.use(express.static(publicPath));
app.use(cors());
app.use(express.json());

app.get("/*", async (req,res) => {
    let response = await fetch("http://localhost:8000/api/v1/contents/page" + req.originalUrl);
    let data = await response.text();
    res.send(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;