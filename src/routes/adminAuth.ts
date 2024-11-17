import { Router,Request,Response } from "express";
import dotenv from 'dotenv'
dotenv.config()
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminModel from "../models/admin";

const secret:any = process.env.secret

console.log(secret);

const AuthRouter = Router();

AuthRouter.post('/login', async (req:Request,res:Response) => {

    try {

        const findAdmin:any = await adminModel.findOne({email:req.body.email})

        if (findAdmin) {
            const valid = await bcrypt.compare(req.body.password, findAdmin.hashed_password);
            
            if (valid) {

                let token = jwt.sign(
                    {
                        email:findAdmin?.email,type:'1',name:findAdmin?.name
                    },
                    'track',
                    { expiresIn: "24h" }
                );


                res.send({message:'success','token':token,})
            }
            else {
                res.send({message:'wrong Password'})
            }
        }
        else {
            res.send({message:'user not found'})
        }

    }
    catch (err:any) {
        res.send({message:err.message})
    }
})

AuthRouter.get('/', async (req, res) => {
    try {
        const response = await adminModel.find()

        res.send({message:response})
    } catch (error) {
        res.send({message : error})
        
    }
})

export default AuthRouter