const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data.js");
const connectDB = require("./config/db.js");
const colors = require("colors")
const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require("./Routes/chatRoutes.js")
const messageRoutes = require("./Routes/messageRoutes.js")
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
// const { Socket } = require("socket.io");


dotenv.config();

connectDB();
const app = express();

app.use(express.json());    // to accept JSON data


app.get("/",(req,res)=>{
    res.send("App is Running HAhahahah")
});

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);

// app.get("/api/chat",(req,res)=>{
//     res.send(chats);
// });

// app.get("/api/chat/:id",(req,res)=>{
//    // console.log(req.params.id);
//    const singleChat = chats.find(c=>c._id === req.params.id);
//    res.send(singleChat);
// });

const PORT = process.env.PORT || 4513

const server = app.listen(PORT,console.log(`server started on PORT ${PORT}`.yellow.bold))

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup",(userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room:  " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecived) => {
        var chat = newMessageRecived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecived.sender._id) return;

            socket.in(user._id).emit("message recived", newMessageRecived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});