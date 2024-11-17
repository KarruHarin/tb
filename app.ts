import express from 'express'
import dotenv from 'dotenv'
import Routers from './src/routes'
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import connectDB from './src/dbConfig';



dotenv.config()




const app = express()
app.use(express.json())
app.use(cors())
connectDB()

app.use('/api/v1/',Routers)
const port = process.env.port
const httpServer = createServer(app);


httpServer.listen(port,() => {console.log(`server is running at port ${port}`)})
