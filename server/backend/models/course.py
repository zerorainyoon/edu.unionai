from datetime import date, datetime, timezone
from typing import List, Optional
from sqlmodel import Field, SQLModel, Column, JSON

class CourseBase(SQLModel):
    """
    Shared attributes for Course model.
    """
    tags: List[str] = Field(sa_column=Column(JSON, nullable=False))
    region: str = Field(nullable=False)
    title: str = Field(index=True, nullable=False)
    description: Optional[str] = Field(default=None)
    
    # 교육접수 기간, 교육기간
    apply_start_date: date = Field(nullable=False)
    apply_end_date: date = Field(nullable=False)
    edu_start_date: date = Field(nullable=False)
    edu_end_date: date = Field(nullable=False)

    # 교육시간, 교육비, 환급액
    edu_time: Optional[str] = Field(default=None, nullable=True)
    edu_fee: int = Field(nullable=False)
    refund_amount: int = Field(nullable=False)

class Course(CourseBase, table=True):
    """
    Database Table Entity Model for Course.
    """
    __tablename__: str = "courses"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

class CourseCreate(CourseBase):
    """
    DTO for Course creation requests.
    """
    pass

class CourseResponse(CourseBase):
    """
    DTO for Course responses returned to the client.
    """
    id: int
    created_at: datetime
    updated_at: datetime

class CourseUpdate(SQLModel):
    """
    DTO for updating Course records (all fields are optional for partial updates).
    """
    region: Optional[str] = None
    title: Optional[str] = None
    tags: Optional[List[str]] = None
    description: Optional[str] = None

    # 교육접수 기간, 교육기간
    apply_start_date: Optional[date] = None
    apply_end_date: Optional[date] = None
    edu_start_date: Optional[date] = None
    edu_end_date: Optional[date] = None

    # 교육시간, 교육비, 환급액
    edu_time: Optional[str] = None
    edu_fee: Optional[int] = None
    refund_amount: Optional[int] = None

