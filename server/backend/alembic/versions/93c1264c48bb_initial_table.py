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
        sa.Column('is_admin', sa.Boolean(), nullable=False, server_default=sa.text('0'), comment="관리자 여부 (1: 관리자, 0: 일반사용자)"),
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
        sa.Column('comment', sa.String(length=1000), nullable=True, comment="관리자 수강 승인/반려 코멘트"),
        sa.Column('created_at', sa.DateTime(), nullable=False, comment="생성 일시"),
        sa.Column('updated_at', sa.DateTime(), nullable=False, comment="수정 일시"),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_course_registrations_course_id'), 'course_registrations', ['course_id'], unique=False)

    # 4. Create the 'posts' table
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment="게시글 고유 식별자"),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(), nullable=False, comment="게시글 제목"),
        sa.Column('content', sa.Text(), nullable=False, comment="게시글 본문"),
        sa.Column('is_private', sa.Boolean(), nullable=False, server_default=sa.text('0'), comment="비공개 여부 (1: 비공개, 0: 공개)"),
        sa.Column('hashed_post_password', sqlmodel.sql.sqltypes.AutoString(), nullable=True, comment="비공개 게시글 비밀번호 해시"),
        sa.Column('user_id', sa.Integer(), nullable=False, comment="작성자 ID (users.id 외래키)"),
        sa.Column('views', sa.Integer(), nullable=False, server_default=sa.text('0'), comment="조회수"),
        sa.Column('created_at', sa.DateTime(), nullable=False, comment="생성 일시"),
        sa.Column('updated_at', sa.DateTime(), nullable=False, comment="수정 일시"),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_posts_title'), 'posts', ['title'], unique=False)
    op.create_index(op.f('ix_posts_user_id'), 'posts', ['user_id'], unique=False)

    # 5. Create the 'comments' table
    op.create_table(
        'comments',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False, comment="댓글 고유 식별자"),
        sa.Column('post_id', sa.Integer(), nullable=False, comment="게시글 ID (posts.id 외래키)"),
        sa.Column('user_id', sa.Integer(), nullable=False, comment="작성자 ID (users.id 외래키)"),
        sa.Column('parent_id', sa.Integer(), nullable=True, comment="부모 댓글 ID (comments.id 외래키)"),
        sa.Column('content', sa.String(length=1000), nullable=False, comment="댓글 내용"),
        sa.Column('created_at', sa.DateTime(), nullable=False, comment="생성 일시"),
        sa.Column('updated_at', sa.DateTime(), nullable=False, comment="수정 일시"),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['parent_id'], ['comments.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_comments_post_id'), 'comments', ['post_id'], unique=False)
    op.create_index(op.f('ix_comments_user_id'), 'comments', ['user_id'], unique=False)
    op.create_index(op.f('ix_comments_parent_id'), 'comments', ['parent_id'], unique=False)

def downgrade() -> None:
    # Drop tables in reverse order to respect foreign key constraints
    op.drop_index(op.f('ix_comments_parent_id'), table_name='comments')
    op.drop_index(op.f('ix_comments_user_id'), table_name='comments')
    op.drop_index(op.f('ix_comments_post_id'), table_name='comments')
    op.drop_table('comments')

    op.drop_index(op.f('ix_posts_user_id'), table_name='posts')
    op.drop_index(op.f('ix_posts_title'), table_name='posts')
    op.drop_table('posts')

    op.drop_index(op.f('ix_course_registrations_course_id'), table_name='course_registrations')
    op.drop_table('course_registrations')

    op.drop_index(op.f('ix_courses_title'), table_name='courses')
    op.drop_table('courses')

    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
