require("dotenv").config()
const http = require("http"),
  { connectDB, disconnectDB } = require("./config/mongodb.config"),
  app = require("./server")

http.createServer(app).listen(process.env.PORT)

connectDB()
  .then(async () => {
    if (process.env.NODE_ENV === "test") {
      console.log("Test Server is running\nDatabase test Connected!")
    } else {
      console.log(`Database ${process.env.NODE_ENV === "" ? "Dev" : process.env.NODE_ENV} Connected!\nServer is listening to port : ${process.env.PORT}`)
    }
  })
  .catch((e) => {
    disconnectDB(e.message)
  })