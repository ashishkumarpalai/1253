const express = require("express")
const { connection } = require("./db")
require('dotenv').config()

const { userRouter } = require("./routes/user.routes")
const { noteRouter } = require("./routes/note.routes")
const { authenticate } = require("./middlewares/authenticate.middlewares")
const cors=require("cors")
//swagger start
const swaggerUI=require("swagger-ui-express")
const swaggerJsDoc=require("swagger-jsdoc")
//swagger end

const app = express()

app.use(express.json())
app.use(cors())

//open api specifications   ====>   start
const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Learning swagger for first time",
            version:"1.0.0"
        },
        server:[
            {
                url: "http://localhost:9874"
            }
        ]
    },
    apis:["./routes/*.js"]
}
//swagger specs
const swaggerSpec=swaggerJsDoc(options)
//build the UI
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec))
//open api specifications   ====>   end


app.get("/", (req, res) => {
    res.send("home page")
})

app.use("/users", userRouter)
app.use(authenticate)
app.use("/notes", noteRouter)

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("conneccted with DB")
    } catch (err) {
        console.log(err.message)
    }
    console.log(`server is running ${process.env.port}`)
})