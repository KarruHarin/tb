import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const secret:any = process.env.secret

export const authenticate = (req: any , res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], secret) as any;
    
    req.user = decoded;
    console.log(decoded);
    
    next();
  } catch (error:any) {
    res.status(401).json({ message: error?.message });
  }
};
