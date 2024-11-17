import mongoose,{Schema,Document} from "mongoose";

const subcategorySchema:Schema = new mongoose.Schema({
    category_id: {type: mongoose.Schema.Types.ObjectId,ref: "Category",required: true},
    name: {type:String, index:true},
    is_deleted: {type:Boolean,default:false},
    
},{timestamps:true});

const subcategoryModel = mongoose.model('subcategory',subcategorySchema); 

export default subcategoryModel;