import { api } from './api';
import type { Course } from '../data/courses';
import { MOCK_COURSES } from '../data/courses';

export interface ApiCourse {
  id: number;
  tags: string[];
  region: string;
  title: string;
  description?: string;
  apply_start_date: string; // "YYYY-MM-DD"
  apply_end_date: string;
  edu_start_date: string;
  edu_end_date: string;
  edu_time?: string;
  edu_fee: number;
  refund_amount: number;
  created_at: string;
  updated_at: string;
}

export interface WrappedResponse<T> {
  messageId: string;
  timestamp: string;
  response: T;
}

const GRADIENTS = [
  { from: '#4F46E5', to: '#06B6D4' }, // Indigo -> Cyan
  { from: '#3B82F6', to: '#8B5CF6' }, // Blue -> Purple
  { from: '#10B981', to: '#059669' }, // Emerald
  { from: '#F59E0B', to: '#D97706' }, // Amber
  { from: '#EF4444', to: '#DC2626' }, // Red
  { from: '#EC4899', to: '#BE185D' }, // Pink
  { from: '#06B6D4', to: '#0891B2' }, // Cyan
  { from: '#8B5CF6', to: '#6D28D9' }, // Purple
];

const mapApiCourseToCourse = (apiCourse: ApiCourse): Course => {
  const CATEGORIES = ['인공지능', '클라우드', '스마트팩토리', '웹개발', '모바일앱', '로봇', '스마트모빌리티', '빅데이터', '데이터공학', 'AI 비즈니스 기획', '산업로봇', '자동화'];
  const matchedCategories = apiCourse.tags.filter(t =>
    CATEGORIES.some(cat => t.includes(cat))
  );
  const category = matchedCategories.join(' / ') || '일반 교육';

  // const REGIONS = ['서울', '경기', '부산', '인천', '광주', '전국'];
  // const matchedRegion = apiCourse.tags.find(t =>
  //   REGIONS.some(reg => t.includes(reg))
  // ) || '서울';
  const location = `${apiCourse.region} / 대한상의 교육관`;

  const fee = apiCourse.edu_fee === 0 ? '무료 (전액 국비 지원)' : `${apiCourse.edu_fee.toLocaleString()}원`;

  const today = new Date();
  const end = new Date(apiCourse.apply_end_date);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let status: '모집중' | '마감임박' | '모집마감' = '모집중';
  if (diffDays < 0) {
    status = '모집마감';
  } else if (diffDays <= 7) {
    status = '마감임박';
  }

  const gradIndex = apiCourse.id % GRADIENTS.length;
  const gradientFrom = GRADIENTS[gradIndex].from;
  const gradientTo = GRADIENTS[gradIndex].to;

  const hasSesac = apiCourse.tags.some(t => {
    const lower = t.toLowerCase();
    return lower.includes('sesac') || lower.includes('새싹');
  });
  const type = hasSesac ? 'sesac' : 'k-digital';

  const institution = apiCourse.tags.find(t => t.includes('원') || t.includes('센터') || t.includes('협회')) || '대한상공회의소';

  const refundInfo = apiCourse.refund_amount > 0
    ? `수료 시 최대 ${apiCourse.refund_amount.toLocaleString()}원 환급 가능`
    : '개인 자부담 0원 (내일배움카드 지원)';

  const duration = `${apiCourse.edu_start_date.replace(/-/g, '.')} ~ ${apiCourse.edu_end_date.replace(/-/g, '.')}`;
  const applyPeriod = `${apiCourse.apply_start_date.replace(/-/g, '.')} ~ ${apiCourse.apply_end_date.replace(/-/g, '.')}`;

  const recommendedRoles = apiCourse.tags.filter(t =>
    !['k-digital', 'sesac', 'k-디지털', '새싹', '국비지원', '정부지원', 'standard', 'bootcamp', 'sesac'].includes(t.toLowerCase())
  );

  return {
    id: String(apiCourse.id),
    title: apiCourse.title,
    category,
    tags: apiCourse.tags,
    duration,
    applyPeriod,
    location,
    fee,
    status,
    gradientFrom,
    gradientTo,
    type,
    institution,
    hours: apiCourse.edu_time || '80시간',
    feeOriginal: `${apiCourse.edu_fee.toLocaleString()}원`,
    refundInfo,
    introHours: '09:00 ~ 18:00 (월~금)',
    introLocation: apiCourse.description || '실습 중심의 최첨단 IT 교육장',
    introPreparation: ['개인 필기도구', '신분증 (첫날 본인 확인용)', '노트북 지참 권장'],
    recommendedRoles: recommendedRoles.length > 0 ? recommendedRoles : ['소프트웨어 개발자'],
    curriculum: [
      {
        moduleName: '교육과정 구성',
        unitName: apiCourse.title,
        topics: [apiCourse.description || '실무 중심 핵심 교육 내용']
      }
    ],
    apply_start_date: apiCourse.apply_start_date,
    apply_end_date: apiCourse.apply_end_date,
    edu_start_date: apiCourse.edu_start_date,
    edu_end_date: apiCourse.edu_end_date,
  };
};

export const courseService = {
  /**
   * 전체 교육과정 리스트 조회 (필터 및 검색 적용 가능)
   * @param search 검색 키워드
   * @param category 분야별 필터
   * @param region 지역별 필터
   */
  getCourses: async (search?: string, _category?: string, _region?: string): Promise<Course[]> => {
    const params = new URLSearchParams();
    if (search) params.append('title', search);
    params.append('skip', '0');
    params.append('limit', '100');

    const data = await api.get<WrappedResponse<ApiCourse[]>>(`/courses/?${params.toString()}`);
    const apiCourses = data.response || [];

    const mapped = apiCourses.map(mapApiCourseToCourse);

    // Save/merge into MOCK_COURSES so CourseDetail page can load them by ID
    mapped.forEach(c => {
      const idx = MOCK_COURSES.findIndex(mc => mc.id === c.id);
      if (idx > -1) {
        MOCK_COURSES[idx] = c;
      } else {
        MOCK_COURSES.push(c);
      }
    });

    return mapped;
  },

  /**
   * 특정 교육과정 상세 조회
   * @param id 교육과정 고유 ID
   */
  getCourseById: async (id: string): Promise<Course> => {
    const data = await api.get<WrappedResponse<ApiCourse>>(`/courses/${id}`);
    const apiCourse = data.response;
    const mapped = mapApiCourseToCourse(apiCourse);

    // Also update MOCK_COURSES cache
    const idx = MOCK_COURSES.findIndex(mc => mc.id === mapped.id);
    if (idx > -1) {
      MOCK_COURSES[idx] = mapped;
    } else {
      MOCK_COURSES.push(mapped);
    }

    return mapped;
  },

  /**
   * 특정 교육과정에 수강신청 제출
   */
  applyCourse: async (
    courseId: string,
    studentInfo: { name: string; phone: string; agreement: boolean }
  ): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>(`/courses/${courseId}/apply`, studentInfo);
  }
};
