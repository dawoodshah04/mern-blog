import mongoose, { Schema } from "mongoose";

const PostSchema = mongoose.Schema({
    title:String,
    summary:String,
    content:String,
    cover:String,
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true}
},{
    timestamps:true
});

export const Post = mongoose.model('Post', PostSchema);

