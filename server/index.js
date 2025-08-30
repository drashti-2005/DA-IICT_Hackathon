import express from "express";
import { dbConnect } from "./utils/db.utils.js";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import userRoutes from './routes/user.routes.js';


import eventRoutes from "./routes/eventRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);

app.use('/events', eventRoutes);

// app.use(cors({ maxAge: 3600 }));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// app.use(
// 	session({
// 		secret: process.env.SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 	})
// );

//Routes
app.use("/auth", authRoutes);
// app.use("/faculty");
// app.use("/student");
console.log(process.env.PORT);
dbConnect()
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log("http://localhost:5000");
		});
	})
	.catch((err) => {
		console.log(err);
		console.log("DB error");
	});
