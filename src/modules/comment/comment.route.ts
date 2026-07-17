import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";



const router = Router


// main page of comment create

// create comment route

router.post(
    "/",
    auth(Role.Admin, Role.Author, Role.User)
    
    commentController.createComment
)


// get all comment by author id 

router.get(
    "/author/:authorId",
    commentController.getCommentByAuthorId
)



// get comment by postId

router.get(
    "/:postId",
    commentController.getCommentByPostId
)


//  update comment route

router.patch(
    "/:commentID",
    auth(Role.Admin, Role.Author, Role.User),
    commentController.UpdateComment

)

// delete comment

router.delete(
    "/:commentId",
    auth(Role.Admin, Role.Author, Role.User),
    commentController.deleteComment

)


// moderate comment can do only by author

router.put(
    "/:commentId/moderate",
    auth(Role.Admin),
    commentController.moderateComment
)


export const CommentRoutes = router 
 