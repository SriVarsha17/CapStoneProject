import { Schema,model } from "mongoose";

// Comment schema for user comments on articles
const userCommentSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"},
        comment:{
            type:String}

})

// Article schema with author reference and embedded comments
const articleSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"author is required"]
    },
    title:{
        type:String,
        required:[true,"title is required"]
    },
    category:{
        type:String,
        required:[true,"category is required"]
        
    },
    content:{
        type:String,
        required:[true,"content is required"]
    },
    comments:[userCommentSchema],
    isArticleActive:{
        type:Boolean,
        default:true  // Used for soft delete functionality
    }
 },
 {
    timestamps:true,    
    strict:true,
    versionKey:false
 }
)

export const ArticleTypeModel = model("Article", articleSchema)



