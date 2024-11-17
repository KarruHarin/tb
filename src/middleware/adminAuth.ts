import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const secret:any = process.env.secret

export const authenticateAdmin = (req: any , res: Response, next: NextFunction) => {
  // Your logic to check user authentication
  const token = req.header('Authorization');

  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], secret) as any;

    console.log('decoded' + decoded);
    
    if(decoded?.user_type == 1){
      req.user = decoded;
      next();
    }
    else{
    res.status(401).json({ message: 'un-Authorized' });
    console.log(decoded);
  }
  } catch (error:any) {
    res.status(401).json({ message: error?.message });
  }
};
