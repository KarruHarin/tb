import mongoose,{Schema,Document} from "mongoose";

const shippingSchema:Schema = new mongoose.Schema({
    shipping_id : {type:Number, unique:true},
    order_id: {type:Number},
    customer_id: {type:Number},
    delivery_address: {type:String},
    shipping_method: {type:String},
    shipping_amount: {type:Number},
    status: {type:String},
    tracking_number: {type:String},
    is_deleted: {type:Boolean,default:false},
    
},{timestamps:true});

const shippingModel = mongoose.model('shipping',shippingSchema); 

export default shippingModel;