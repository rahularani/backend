import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { sequelize } from './config/database.js'
import authRoutes from './routes/auth.js'
import { authenticateSocket } from './middleware/auth.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { 
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
    credentials: true 
  }
})

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)

io.use(authenticateSocket)
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
})

const PORT = process.env.PORT || 5000

sequelize.sync().then(() => {
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
