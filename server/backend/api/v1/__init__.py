from fastapi import APIRouter
from backend.api.v1.user import router as user_router
from backend.api.v1.course import router as course_router
from backend.api.v1.course_registration import router as course_registration_router

router = APIRouter(prefix="/v1")
router.include_router(user_router)
router.include_router(course_router)
router.include_router(course_registration_router)
