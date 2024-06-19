const express = require("express")
const {chats} = require("./data/data")
const connectDB = require("./config/db")
const dotenv = require("dotenv")
const colors = require("colors")
const path = require("path")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const { errorHandler, notFound } = require("./middleware/errorMiddleware")

const app = express()
dotenv.config()
connectDB()

app.use(express.json()) 
app.use(cors())

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
  
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
  } else {
    app.get("/", (req, res) => {
      res.send("API is running..");
    });
  }

app.use("/api/user" , userRoutes)
app.use("/api/chat" , chatRoutes)
app.use("/api/message", messageRoutes)

app.use(notFound)
app.use(errorHandler)

PORT = process.env.PORT || 5000

const server = app.listen(`${PORT}` , console.log(`Server started on port ${PORT}`.yellow.bold))

const io = require("socket.io")(server , {
    pingTimeout: 60000,
    cors: {
        origin: "https://chat-app-mern-oomt.onrender.com",
    },  
})

io.on("connection" , (socket) => {
    console.log("connected to socket.io")

    socket.on("setup" , (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("chat connect" , (r) => {
        socket.join(r)
        console.log("chatId : " + r)
    })

    socket.on("typing" , (r) => socket.in(r).emit("typing"))
    socket.on("stop typing" , (r) => socket.in(r).emit("stop typing"))   

    socket.on("New Message" , (NewMessageReceived) => {
        var chat = NewMessageReceived.chat
        if(!chat.users) return console.log("users of this chat are undefined")
        
        chat.users.forEach((user) => {
           if(user._id == NewMessageReceived.sender._id) return         
           socket.in(user._id).emit("message received" , NewMessageReceived)
        });
    })

    socket.off("setup" , () => {
        socket.leave(userData._id)
    })
})