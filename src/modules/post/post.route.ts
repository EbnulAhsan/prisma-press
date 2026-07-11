import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";







const router = Router()

//  creating all router for post --

router.post(
    "/",
    auth(Role.User, Role.Admin, Role.Author),
    postController.createPost

)

router.get("/", postController.getAllPosts)

router.get(
    "/stats",
    auth(Role.Admin),
    postController.getPostsStats
)

router.get(
    "/my-posts",
    auth(Role.Admin, Role.Author, Role.User),
    postController.getMyPosts
)


router.get("/:postId", postController.getPostById)


router.patch(
    "/:postId",
    auth(Role.Admin, Role.Author, Role.User),
    postController.updatePost

)

router.delete(
    "/:postId",
    auth(Role.Admin, Role.Author, Role.User),
    postController.deletePost

)


export const postRoutes = router





