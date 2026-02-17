import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hashedPassword, role })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token })
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' })
    
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token })
  } catch (error) {
    res.status(400).json({ error: 'Login failed' })
  }
})

export default router
