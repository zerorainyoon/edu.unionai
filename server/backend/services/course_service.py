from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, col
from backend.models.course import Course, CourseCreate, CourseUpdate

class CourseService:
    """
    Handles business logic and database interactions for Courses.
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, course_id: int) -> Optional[Course]:
        """
        Retrieve a course by its ID.
        """
        statement = select(Course).where(Course.id == course_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_all(self, title: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Course]:
        """
        Retrieve list of courses with pagination and optional title filtering.
        """
        statement = select(Course)
        if title:
            statement = statement.where(col(Course.title).contains(title))
        statement = statement.offset(skip).limit(limit)
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def create(self, course_create: CourseCreate) -> Course:
        """
        Creates a new course record.
        """
        db_course = Course.model_validate(course_create)
        self.session.add(db_course)
        await self.session.commit()
        await self.session.refresh(db_course)
        return db_course

    async def update(self, db_course: Course, course_update: CourseUpdate) -> Course:
        """
        Updates an existing course record partially.
        """
        update_data = course_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_course, key, value)
            
        db_course.updated_at = datetime.now(timezone.utc)
        self.session.add(db_course)
        await self.session.commit()
        await self.session.refresh(db_course)
        return db_course

    async def delete(self, db_course: Course) -> None:
        """
        Deletes a course record.
        """
        await self.session.delete(db_course)
        await self.session.commit()
