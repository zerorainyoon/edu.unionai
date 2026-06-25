from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.db import get_session
from backend.models.course_registration import CourseRegistrationCreate, CourseRegistrationResponse, CourseRegistrationUpdate
from backend.services.course_registration_service import CourseRegistrationService
from backend.core.response_wrapper import UnifiedResponseRoute

router = APIRouter(prefix="/course-registrations", tags=["Course Registrations"], route_class=UnifiedResponseRoute)

async def get_registration_service(session: AsyncSession = Depends(get_session)) -> CourseRegistrationService:
    """
    Dependency injection provider for CourseRegistrationService.
    """
    return CourseRegistrationService(session)

@router.post(
    "/",
    response_model=CourseRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course registration",
    description="Submits a new course registration application.",
)
async def create_registration(
    registration_data: CourseRegistrationCreate,
    service: CourseRegistrationService = Depends(get_registration_service),
) -> CourseRegistrationResponse:
    """
    API endpoint to submit a course registration.
    """
    registration = await service.create(registration_data)
    return registration  # type: ignore[return-value]

@router.get(
    "/",
    response_model=List[CourseRegistrationResponse],
    status_code=status.HTTP_200_OK,
    summary="Retrieve all course registrations",
    description="Fetches a list of course registrations with support for pagination.",
)
async def get_registrations(
    skip: int = 0,
    limit: int = 100,
    service: CourseRegistrationService = Depends(get_registration_service),
) -> List[CourseRegistrationResponse]:
    """
    API endpoint to query registrations list.
    """
    registrations = await service.get_all(skip=skip, limit=limit)
    return registrations  # type: ignore[return-value]

@router.get(
    "/{registration_id}",
    response_model=CourseRegistrationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get course registration details",
    description="Retrieves details for a specific course registration using its unique ID.",
)
async def get_registration(
    registration_id: int,
    service: CourseRegistrationService = Depends(get_registration_service),
) -> CourseRegistrationResponse:
    """
    API endpoint to retrieve details for a single course registration. Raises 404 if not found.
    """
    registration = await service.get_by_id(registration_id)
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course registration not found",
        )
    return registration  # type: ignore[return-value]

@router.put(
    "/{registration_id}",
    response_model=CourseRegistrationResponse,
    status_code=status.HTTP_200_OK,
    summary="Update course registration details",
    description="Updates information (partially or fully) for a specific course registration.",
)
async def update_registration(
    registration_id: int,
    registration_data: CourseRegistrationUpdate,
    service: CourseRegistrationService = Depends(get_registration_service),
) -> CourseRegistrationResponse:
    """
    API endpoint to update details for a single course registration. Raises 404 if not found.
    """
    db_registration = await service.get_by_id(registration_id)
    if not db_registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course registration not found",
        )
    updated_registration = await service.update(db_registration, registration_data)
    return updated_registration  # type: ignore[return-value]

@router.delete(
    "/{registration_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a course registration",
    description="Removes a course registration from the system.",
)
async def delete_registration(
    registration_id: int,
    service: CourseRegistrationService = Depends(get_registration_service),
) -> None:
    """
    API endpoint to delete a course registration. Raises 404 if not found.
    """
    db_registration = await service.get_by_id(registration_id)
    if not db_registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course registration not found",
        )
    await service.delete(db_registration)
