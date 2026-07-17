import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { commentController } from "./comment.controller";

const router = Router();

router.post(
    "/",
    auth(Role.Admin, Role.Author, Role.User),
    commentController.CreateComment
);

router.get(
    "/author/:authorId",
    commentController.getCommentByAuthorId
);

router.get(
    "/:postId",
    commentController.getCommentByPostID
);

router.patch(
    "/:commentId",
    auth(Role.Admin, Role.Author, Role.User),
    commentController.updateComment
);

router.delete(
    "/:commentId",
    auth(Role.Admin, Role.Author, Role.User),
    commentController.deleteComment
);

router.put(
    "/:commentId/moderate",
    auth(Role.Admin),
    commentController.moderateComment
);


export const commentRoutes = router;