import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import usersModel from "../models/users";

dotenv.config();
const secret:any = process.env.secret


const authRouter = Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role, address } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).send({ message: "All fields are required." });
        }

   
        const existingUser = await usersModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "Email is already registered." });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

    
        const newUser = new usersModel({
            name,
            email,
            hashed_password: hashedPassword,
            phone,
            role,
            address,
        });

        const savedUser = await newUser.save();

        res.status(201).send({ message: "User created successfully", user: savedUser });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred during signup" });
    }
});


authRouter.post('/login', async (req:Request,res:Response) => {

    try {
        const findUser:any = await usersModel.findOne({email:req.body.email})

        if(findUser.role == 1){
            const valid = await bcrypt.compare(req.body.password, findUser.hashed_password);

            if (valid) {

                let token = jwt.sign(
                    {
                       id:findUser?._id, email:findUser?.email,type:findUser?.user_type,name:findUser.name,role: findUser?.role
                    },
                    secret,
                    { expiresIn: "24h" }
                );




                res.send({message:'success','token':token,type:1})
            }
            else {
                res.send({message:'wrong Password'})
            }

        }
        else if(findUser.role == 2){

            const valid = await bcrypt.compare(req.body.password, findUser.hashed_password);

            if (valid) {

                let token = jwt.sign(
                    {
                       id:findUser?._id, email:findUser?.email,type:findUser?.user_type,name:findUser.name,role: findUser?.role
                    },
                    secret,
                    { expiresIn: "24h" }
                );


                res.send({message:'success','token':token,type:2})
            }
            else {
                res.send({message:'wrong Password'})
            }


        }
        else{
            res.send({message:'user not found'})
        }
    }
    catch (err:any) {
        res.send({message:err.message})
    }
})



export default authRouter;
