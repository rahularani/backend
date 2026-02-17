import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Socket } from 'socket.io'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' })
  }
}

export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Unauthorized'))

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    socket.data.user = decoded
    next()
  } catch (error) {
    next(new Error('Invalid token'))
  }
}
