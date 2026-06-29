from fastapi import APIRouter
from backend.api.v1.user import router as user_router
from backend.api.v1.course import router as course_router
from backend.api.v1.course_registration import router as course_registration_router
from backend.api.v1.auth import router as auth_router
from backend.api.v1.post import router as post_router
from backend.api.v1.comment import router as comment_router

router = APIRouter(prefix="/v1")
router.include_router(user_router)
router.include_router(course_router)
router.include_router(course_registration_router)
router.include_router(auth_router)
router.include_router(post_router)
router.include_router(comment_router)
