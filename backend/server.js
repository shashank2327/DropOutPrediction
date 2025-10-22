import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import connectDB from "./src/lib/db.js"
import cors from 'cors'

const app = express();
connectDB()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors({credentials: true}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))




app.get('/', (req, res) => {
    res.send("API WORKING").status(200)
})

app.listen(port, (req, res)=> {
    console.log(`Server started on PORT ${port}`)
}) 