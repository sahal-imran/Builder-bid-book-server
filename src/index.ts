import 'dotenv/config';
import express from 'express';
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from 'cookie-parser'
import path from "path"
import auth from './routes/auth';
import post from './routes/post';
import bid from './routes/bid';
import user from './routes/user';
import subscription from './routes/subscription';

let PORT = process.env.APP_LISTEN_PORT || 4000;
let MODE = process.env.MODE;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:
            MODE === "production" ? process.env.REQUEST_ORIGIN_PRODUCTION : process.env.REQUEST_ORIGIN_DEVELOPMENT,
        credentials: true, //access-control-allow-credentials:true
    })
);

// Home route
app.get("/", async (req, res) => {
    // res.send(path.join(__dirname, "../index.html"));
    res.send(`Running on port ${PORT}`);
});

const URL: any = MODE === "dev"
    ? process.env.DATABASE_URL_DEVELOPMENT
    : process.env.DATABASE_URL_PRODUCTION
mongoose
    .connect(URL, {
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`app is listing on port ${PORT}`);
        });
        // LogInfo("Path", __dirname)
        app.use(auth);
        app.use(post);
        app.use(bid);
        app.use(user);
        app.use(subscription);
    })
    .catch((err) => {
        console.log(err);
    });