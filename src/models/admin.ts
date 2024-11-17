import mongoose,{Schema,Document} from "mongoose";

const adminSchema:Schema = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    phone:{type:String},
    hashed_password:{type:String}
},{timestamps:true});

const adminModel = mongoose.model('admin',adminSchema); 

export default adminModel;