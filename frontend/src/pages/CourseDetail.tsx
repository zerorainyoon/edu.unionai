import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Award, CheckCircle2, ChevronRight,
  ArrowLeft, BookOpen, AlertCircle, Laptop, UserCheck, ShieldAlert
} from 'lucide-react';
import { MOCK_COURSES } from '../data/courses';
import { useToast } from '../components/ui/Toast';
import { CourseRegistration } from '../components/ui/CourseRegistrationForm';
import { api } from '../services/api';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const course = MOCK_COURSES.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="max-w-md mx-auto my-20 px-6 py-12 bg-white rounded-3xl border border-slate-200 text-center shadow-sm select-none">
        <div className="inline-flex p-4 rounded-full bg-rose-50 text-rose-500 mb-4">
          <AlertCircle size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">과정을 찾을 수 없습니다</h2>
        <p className="text-sm text-slate-500 mb-6">존재하지 않거나 삭제된 교육 과정입니다.</p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 bg-brand-primary text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-secondary transition-colors"
        >
          <ArrowLeft size={14} />
          교육과정 목록으로
        </Link>
      </div>
    );
  }

  const handleEnrollClick = () => {
    if (isEnrolled) {
      showToast('이미 수강신청 완료된 과정입니다.');
      return;
    }
    setShowRegistrationForm(true);
    // Smooth scroll down to the registration form container with an offset
    setTimeout(() => {
      const element = document.getElementById('registration-form-section');
      if (element) {
        const yOffset = -450;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleFormSubmit = async (data: { email: string; name: string; phone: string }) => {
    try {
      await api.post('/course-registrations/', {
        course_id: Number(course.id),
        email: data.email,
        name: data.name,
        phone: data.phone,
      });
      setIsEnrolled(true);
      setShowRegistrationForm(false);
      showToast(`'${course.title}' 수강신청 접수가 성공적으로 완료되었습니다! 담당자가 곧 연락드리겠습니다.`);
    } catch (err) {
      console.error(err);
      showToast('수강신청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumbs & Back navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-brand-secondary transition-colors">홈</Link>
            <ChevronRight size={12} className="text-slate-300" />
            <Link to="/courses" className="hover:text-brand-secondary transition-colors">수강신청</Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">{course.title}</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-brand-secondary transition-colors"
          >
            <ArrowLeft size={12} />
            이전 페이지로
          </button>
        </div>

        {/* Detailed Header Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 md:p-8 mb-8 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight mt-1">
              {course.title}
            </h1>
          </div>

          {/* Grid Layout: Left visual banner, Right specifications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-slate-100 pt-6">

            <style>{`
              .course-dynamic-gradient-${course.id} {
                background-image: linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo});
              }
            `}</style>
            <div
              className={`lg:col-span-5 h-64 rounded-2xl relative overflow-hidden flex items-center justify-center select-none shadow-inner course-dynamic-gradient-${course.id}`}
            >
              <div className="absolute inset-0 bg-black/15"></div>
              {/* Decorative shapes */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-black/5 blur-xl"></div>

              <div className="relative text-center text-white px-6">
                <BookOpen size={48} className="mx-auto mb-4 stroke-[1.5] drop-shadow opacity-90" />
                <span className="text-xs font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/20">
                  KCCI Training Center
                </span>
                <p className="text-base font-bold mt-2 drop-shadow tracking-wide max-w-[200px] mx-auto opacity-95">
                  실무 중심의 디지털 신기술 역량 교육
                </p>
              </div>
            </div>

            {/* Right Column: Spec Sheet & Registration CTA */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[16rem]">
              <div className="divide-y divide-slate-100 text-base">
                <div className="grid grid-cols-3 py-3">
                  <span className="font-bold text-slate-400">교육 기간</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{course.duration}</span>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <span className="font-bold text-slate-400">총 교육 시간</span>
                  <span className="col-span-2 text-slate-800 font-semibold flex items-center gap-1">
                    <Clock size={14} className="text-slate-400" />
                    {course.hours}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <span className="font-bold text-slate-400">정상 교육비</span>
                  <span className="col-span-2 text-slate-400 line-through">{course.feeOriginal}</span>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <span className="font-bold text-slate-400">정부 지원금</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{course.feeOriginal} (전액 지원)</span>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <span className="font-bold text-slate-800">훈련생 자부담</span>
                  <span className="col-span-2 text-brand-secondary font-black text-lg">0원 (100% 무료 수강)</span>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <span className="font-bold text-slate-400">환급 조건</span>
                  <span className="col-span-2 text-slate-500 leading-normal">{course.refundInfo}</span>
                </div>
              </div>

              {/* Registration Action */}
              {!showRegistrationForm && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    disabled={course.status === '모집마감'}
                    className={`w-full py-4 rounded-xl font-bold text-base tracking-widest shadow-md transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 ${course.status === '모집마감'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : isEnrolled
                        ? 'bg-slate-800 text-white hover:bg-slate-900'
                        : 'bg-brand-primary text-white hover:bg-brand-secondary hover:shadow-lg'
                      }`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        수강신청 완료됨 (신청 취소 불가)
                      </>
                    ) : course.status === '모집마감' ? (
                      '모집 종료된 과정입니다'
                    ) : (
                      '수강신청 및 상세 상담 요청'
                    )}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Tab Detail Contents / Registration Form */}
        {showRegistrationForm ? (
          <div id="registration-form-section" className="w-full mb-8">
            <CourseRegistration
              courseTitle={course.title}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowRegistrationForm(false)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Info Columns (Left 2 columns) */}
            <div className="lg:col-span-2 space-y-8">

              {/* 1. 과정소개 (Course introduction details) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-brand-primary rounded-full"></span>
                  과정소개 및 운영 상세
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-slate-400 mb-2 uppercase tracking-wide">일일 훈련 시간대</h4>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 items-center">
                      <Clock size={20} className="text-slate-400 shrink-0" />
                      <span className="text-base text-slate-700 font-semibold">{course.introHours}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-400 mb-2 uppercase tracking-wide">실습 및 강의 장소</h4>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 items-start">
                      <MapPin size={20} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-base text-slate-800 font-bold block">{course.location}</span>
                        <span className="text-sm text-slate-500 mt-1 block leading-relaxed">{course.introLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Preparation checklist */}
                    <div>
                      <h4 className="text-base font-bold text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-1">
                        <Laptop size={16} />
                        지참 및 지참물 가이드
                      </h4>
                      <ul className="space-y-2">
                        {course.introPreparation.map((prep, idx) => (
                          <li key={idx} className="flex gap-2 items-start text-base text-slate-600">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{prep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended roles */}
                    <div>
                      <h4 className="text-base font-bold text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-1">
                        <UserCheck size={16} />
                        추천 진로 및 타겟 직무
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {course.recommendedRoles.map((role, idx) => (
                          <span
                            key={idx}
                            className="bg-brand-accent-light text-brand-secondary text-sm font-bold px-3 py-2 rounded-lg border border-brand-accent-light"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 교육내용 (Syllabus/Curriculum table) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-brand-primary rounded-full"></span>
                  상세 교육과정 커리큘럼
                </h3>

                <div className="space-y-6">
                  {course.curriculum.map((curr, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                    >
                      <div className="bg-slate-900/5 px-4 py-3 flex items-center justify-between border-b border-slate-200 gap-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 text-white text-xs font-black w-5.5 h-5.5 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-base font-black text-slate-800">{curr.moduleName}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-500">Module {idx + 1}</span>
                      </div>

                      <div className="p-4">
                        <span className="text-sm font-bold text-slate-400 block mb-2">과목 / 단위과정명</span>
                        <p className="text-base font-bold text-brand-secondary mb-4">{curr.unitName}</p>

                        <span className="text-sm font-bold text-slate-400 block mb-2">세부 훈련 항목</span>
                        <ul className="space-y-2">
                          {curr.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex gap-2 items-start text-base text-slate-600 leading-normal">
                              <span className="text-slate-300 font-bold shrink-0">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Support Info Sidebar Column (Right 1 column) */}
            <div className="space-y-8">

              {/* 3. 환급 안내 (Refund/Discount guidance) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h4 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={16} className="text-brand-secondary" />
                  기업 훈련 환급 조건 안내
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  대한상공회의소 과정은 국가 인적자원개발 컨소시엄 및 정부 공인 직업훈련 요건을 만족하여 기업 소속 재직자 수강 시 세금 공제 또는 전액 환급이 제공됩니다.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">우선 지원 대상 기업</span>
                    <span className="text-base font-bold text-slate-800 block mt-0.5">100% 전액 지원 (무료)</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">대규모 기업 (대기업)</span>
                    <span className="text-base font-bold text-slate-800 block mt-0.5">훈련비의 80% 지원 (20% 자부담)</span>
                  </div>
                </div>
              </div>

              {/* 4. 유의 사항 (Important general conditions) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-slate-500">
                <h4 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={16} className="text-rose-500" />
                  훈련 참가 시 필수 유의사항
                </h4>
                <ul className="space-y-3 text-sm leading-relaxed">
                  <li className="flex gap-2 items-start">
                    <span className="text-slate-300">•</span>
                    <span>정원 충원 기준(최소 인원)에 미달할 시 개강 일정 또는 운영 장소가 다소 연기 및 변동될 수 있습니다.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-slate-300">•</span>
                    <span>수강 신청 취소는 개강일 기준 최소 3일 전까지 온라인 또는 유선 전화로 직접 신청해 주셔야 합니다.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-slate-300">•</span>
                    <span>고용노동부 지침에 의거하여 대리 출석, 무단 결석이 잦은 경우 훈련 도중 중도 탈락 및 불이익이 발생할 수 있습니다.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default CourseDetail;
