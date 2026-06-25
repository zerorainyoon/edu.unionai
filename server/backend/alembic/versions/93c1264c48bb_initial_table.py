"""initial table

Revision ID: 93c1264c48bb
Revises: 
Create Date: 2026-06-24 13:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = '93c1264c48bb'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create the 'users' table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment="사용자 고유 식별자"),
        sa.Column('email', sqlmodel.sql.sqltypes.AutoString(), nullable=False, comment="이메일 주소 (로그인 계정)"),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('1'), comment="계정 활성화 상태 (1: 활성, 0: 비활성)"),
        sa.Column('full_name', sqlmodel.sql.sqltypes.AutoString(), nullable=True, comment="사용자 이름"),
        sa.Column('hashed_password', sqlmodel.sql.sqltypes.AutoString(), nullable=False, comment="암호화된 비밀번호 해시"),
        sa.Column('created_at', sa.DateTime(), nullable=False, comment="생성 일시"),
        sa.Column('updated_at', sa.DateTime(), nullable=False, comment="수정 일시"),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Create the 'courses' table
    op.create_table(
        'courses',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment="코스 고유 식별자"),
        sa.Column('tags', sa.JSON(), nullable=False, comment="코스 태그 (문자열 배열)"),
        sa.Column('region', sqlmodel.sql.sqltypes.AutoString(), nullable=False, comment="지역"),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(), nullable=False, comment="코스 제목"),
        sa.Column('description', sqlmodel.sql.sqltypes.AutoString(), nullable=True, comment="코스 상세 설명"),
        
        # 교육접수 기간, 교육기간
        sa.Column('apply_start_date', sa.Date(), nullable=False, comment="교육접수 시작일"),
        sa.Column('apply_end_date', sa.Date(), nullable=False, comment="교육접수 종료일"),
        sa.Column('edu_start_date', sa.Date(), nullable=False, comment="교육 시작일"),
        sa.Column('edu_end_date', sa.Date(), nullable=False, comment="교육 종료일"),

        # 교육시간, 교육비, 환급액
        sa.Column('edu_time', sqlmodel.sql.sqltypes.AutoString(), nullable=True, comment="교육 시간"),
        sa.Column('edu_fee', sa.Integer(), nullable=False, comment="교육비"),
        sa.Column('refund_amount', sa.Integer(), nullable=False, comment="환급액"),
        
        sa.Column('created_at', sa.DateTime(), nullable=False, comment="생성 일시"),
        sa.Column('updated_at', sa.DateTime(), nullable=False, comment="수정 일시"),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_courses_title'), 'courses', ['title'], unique=False)

    # 3. Create the 'course_registrations' table (코스 신청)
    op.create_table(
        'course_registrations',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment="수강 신청 고유 식별자"),
        sa.Column('course_id', sa.Integer(), nullable=False, comment="코스 ID (courses.id 외래키)"),
        sa.Column('email', sqlmodel.sql.sqltypes.AutoString(), nullable=False, comment="이메일 주소"),
        sa.Column('name', sqlmodel.sql.sqltypes.AutoString(), nullable=False, comment="이름"),
        sa.Column('phone', sqlmodel.sql.sqltypes.AutoString(), nullable=False, comment="휴대폰 번호"),
        sa.Column('status', sqlmodel.sql.sqltypes.AutoString(), nullable=False, server_default='pending', comment="수강 신청 상태 (예: pending, approved, rejected)"),
        sa.Column('created_at', sa.DateTime(), nullable=False, comment="생성 일시"),
        sa.Column('updated_at', sa.DateTime(), nullable=False, comment="수정 일시"),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_course_registrations_course_id'), 'course_registrations', ['course_id'], unique=False)


def downgrade() -> None:
    # Drop tables in reverse order to respect foreign key constraints
    op.drop_index(op.f('ix_course_registrations_course_id'), table_name='course_registrations')
    op.drop_table('course_registrations')
    
    op.drop_index(op.f('ix_courses_title'), table_name='courses')
    op.drop_table('courses')
    
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
