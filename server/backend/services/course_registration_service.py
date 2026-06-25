from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from backend.models.course_registration import CourseRegistration, CourseRegistrationCreate, CourseRegistrationUpdate

class CourseRegistrationService:
    """
    Handles business logic and database interactions for Course Registrations.
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, registration_id: int) -> Optional[CourseRegistration]:
        """
        Retrieve a course registration by its ID.
        """
        statement = select(CourseRegistration).where(CourseRegistration.id == registration_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[CourseRegistration]:
        """
        Retrieve list of course registrations with pagination.
        """
        statement = select(CourseRegistration).offset(skip).limit(limit)
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def create(self, registration_create: CourseRegistrationCreate) -> CourseRegistration:
        """
        Creates a new course registration.
        """
        db_registration = CourseRegistration.model_validate(registration_create)
        self.session.add(db_registration)
        await self.session.commit()
        await self.session.refresh(db_registration)
        return db_registration

    async def update(self, db_registration: CourseRegistration, registration_update: CourseRegistrationUpdate) -> CourseRegistration:
        """
        Updates an existing course registration partially.
        """
        update_data = registration_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_registration, key, value)
            
        db_registration.updated_at = datetime.now(timezone.utc)
        self.session.add(db_registration)
        await self.session.commit()
        await self.session.refresh(db_registration)
        return db_registration

    async def delete(self, db_registration: CourseRegistration) -> None:
        """
        Deletes a course registration.
        """
        await self.session.delete(db_registration)
        await self.session.commit()
