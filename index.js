const express = require("express");
const app = express();
const path = require("path")
// const cookieParser = require("cookie-parser")

const connectToDb = require("./connection.js")
const mongoURI = `mongodb+srv://nitesh:mynkpass@cluster0.fgdwga9.mongodb.net/mytododb`
// const mongoURI = `mongodb://127.0.0.1:27017/tododb`
connectToDb(mongoURI).catch(err=>console.log(err))
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const userRouter = require("./routes/userroutes");


// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.text({ type: "text/plain" }));
// app.use(cookieParser());
app.use(express.text());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

app.use("/api/user", userRouter);

// app.use("/api/todos", todoRouter);

app.get("/",(req,res)=>{
    app.use(express.static(path.resolve(__dirname,"frontend","dist")))
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
