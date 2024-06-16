const express = require("express")
const {chats} = require("./data/data")
const connectDB = require("./config/db")
const dotenv = require("dotenv")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const { errorHandler, notFound } = require("./middleware/errorMiddleware")

const app = express()
dotenv.config()
connectDB()

app.use(express.json())  // to accept json data

app.get( "/" , (req,res) => {
    res.send("API is running")
})

app.use("/api/user" , userRoutes)
app.use("/api/chat" , chatRoutes)
app.use("/api/message", messageRoutes)

app.use(notFound)
app.use(errorHandler)

PORT = process.env.PORT || 5000

app.listen(`${PORT}` , console.log(`Server started on port ${PORT}`.yellow.bold))