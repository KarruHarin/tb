import express from 'express'
import dotenv from 'dotenv'
import Routers from './src/routes'
import { createServer } from 'http';
import connectDB from './src/dbConfig';
import initializeAdminAccount from "./src/utils/adminInitializer";


dotenv.config()
const cors = require('cors');


const app = express()
app.use(express.json())
app.use(cors())
connectDB()

initializeAdminAccount()

app.use('/api/v1/',Routers)
const port = process.env.port
const httpServer = createServer(app);


httpServer.listen(port,() => {console.log(`server is running at port ${port}`)})
