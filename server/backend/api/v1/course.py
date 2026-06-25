from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.db import get_session
from backend.models.course import CourseCreate, CourseResponse, CourseUpdate
from backend.services.course_service import CourseService

from backend.core.response_wrapper import UnifiedResponseRoute

router = APIRouter(prefix="/courses", tags=["Courses"], route_class=UnifiedResponseRoute)

async def get_course_service(session: AsyncSession = Depends(get_session)) -> CourseService:
    """
    Dependency injection provider for CourseService.
    """
    return CourseService(session)

@router.post(
    "/",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course",
    description="Registers a new course in the system with dates and fee requirements.",
)
async def create_course(
    course_data: CourseCreate,
    service: CourseService = Depends(get_course_service),
) -> CourseResponse:
    """
    API endpoint to create a course.
    """
    course = await service.create(course_data)
    return course  # type: ignore[return-value]

@router.get(
    "/",
    response_model=List[CourseResponse],
    status_code=status.HTTP_200_OK,
    summary="Retrieve courses list",
    description="Fetches a list of courses with support for pagination.",
)
async def get_courses(
    title: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    service: CourseService = Depends(get_course_service),
) -> List[CourseResponse]:
    """
    API endpoint to query a list of courses.
    """
    courses = await service.get_all(title=title, skip=skip, limit=limit)
    return courses  # type: ignore[return-value]

@router.get(
    "/{course_id}",
    response_model=CourseResponse,
    status_code=status.HTTP_200_OK,
    summary="Get course details",
    description="Retrieves details for a specific course using its unique ID.",
)
async def get_course(
    course_id: int,
    service: CourseService = Depends(get_course_service),
) -> CourseResponse:
    """
    API endpoint to retrieve details for a single course. Raises 404 if not found.
    """
    course = await service.get_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    return course  # type: ignore[return-value]

@router.put(
    "/{course_id}",
    response_model=CourseResponse,
    status_code=status.HTTP_200_OK,
    summary="Update course details",
    description="Updates information (partially or fully) for a specific course.",
)
async def update_course(
    course_id: int,
    course_data: CourseUpdate,
    service: CourseService = Depends(get_course_service),
) -> CourseResponse:
    """
    API endpoint to update details for a single course. Raises 404 if not found.
    """
    db_course = await service.get_by_id(course_id)
    if not db_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    updated_course = await service.update(db_course, course_data)
    return updated_course  # type: ignore[return-value]

@router.delete(
    "/{course_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a course",
    description="Removes a course from the system.",
)
async def delete_course(
    course_id: int,
    service: CourseService = Depends(get_course_service),
) -> None:
    """
    API endpoint to delete a course. Raises 404 if not found.
    """
    db_course = await service.get_by_id(course_id)
    if not db_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    await service.delete(db_course)
