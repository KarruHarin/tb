import mongoose,{Schema,Document} from "mongoose";

const categorySchema:Schema = new mongoose.Schema({
    name: {type:String, index:true},
    is_deleted: {type:Boolean,default:false},
    
},{timestamps:true});

const categoryModel = mongoose.model('Category',categorySchema); 

export default categoryModel;