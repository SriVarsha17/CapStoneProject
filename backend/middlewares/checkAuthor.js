import { UserTypeModel } from '../models/UserModel.js'

export const checkAuthor = async (req, res, next) => {
    const authorId = req.body?.authorId || req.params?.authorId || req.query?.authorId

    if (!authorId) {
        return res.status(400).json({ message: 'Author ID is required' })
    }

    const author = await UserTypeModel.findById(authorId)
    if (!author || author.role !== 'author') {
        return res.status(404).json({ message: 'Author not found' })
    }

    req.author = author
    next()
};


// import { UserTypeModel } from "../models/UserTypeModel.js";

// export const checkAuthor = async (req, res, next) => {
//   //get author id 
//  const aid = req?.body?.author || req?.params?.authorId;
//  //verify the author 
//   let author = await UserTypeModel.findById(aid);
// //if author not found
//   if(!author){
//     return res.status(401).json({message: "invalid author"});
//   }
//   //if author is found but role is different
//   if ( author.role !== "AUTHOR") {  
//     return res.status(403).json({ message: "Author not found or invalid role" });
//   }
//   //if author is blocked
//   if(!author.isActive){
//     return res.status(403).json({message: "author account is not active"});
//   }
// //forward request to next 
//   next();
// };