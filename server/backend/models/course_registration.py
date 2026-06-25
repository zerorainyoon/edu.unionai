from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel

class CourseRegistrationBase(SQLModel):
    """
    Shared attributes for Course Registration model.
    """
    course_id: int = Field(foreign_key="courses.id", nullable=False, index=True)
    email: str = Field(nullable=False)
    name: str = Field(nullable=False)
    phone: str = Field(nullable=False)
    status: str = Field(default="pending", nullable=False)

class CourseRegistration(CourseRegistrationBase, table=True):
    """
    Database Table Entity Model for Course Registration.
    """
    __tablename__: str = "course_registrations"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

class CourseRegistrationCreate(CourseRegistrationBase):
    """
    DTO for Course Registration creation requests.
    """
    pass

class CourseRegistrationResponse(SQLModel):
    """
    DTO for Course Registration responses returned to the client.
    """
    id: int
    course_id: int
    email: str
    name: str
    phone: str
    status: str
    created_at: datetime
    updated_at: datetime

class CourseRegistrationUpdate(SQLModel):
    """
    DTO for updating Course Registration records.
    """
    course_id: Optional[int] = None
    email: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
