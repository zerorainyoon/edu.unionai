import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Calendar, MapPin, Tag, Clock, FileText, X, Coins, BookOpen } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../services/api';
import { RichTextEditor } from '../../components/ui/RichTextEditor';

const PREDEFINED_TAGS = [
  'K-Digital',
  '새싹(SeSAC))',
];

export const AdminRegisterCourse: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: '',
    tags: '',
    region: '서울',
    description: '',
    apply_start_date: '2026-07-01',
    apply_end_date: '2026-07-15',
    edu_start_date: '2026-07-20',
    edu_end_date: '2026-08-30',
    edu_time: '매주 월/수 19:30 ~ 21:30',
    edu_fee: 350000,
    refund_amount: 150000,
  });

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        tags: courseForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        region: courseForm.region,
        title: courseForm.title,
        description: courseForm.description,
        apply_start_date: courseForm.apply_start_date,
        apply_end_date: courseForm.apply_end_date,
        edu_start_date: courseForm.edu_start_date,
        edu_end_date: courseForm.edu_end_date,
        edu_time: courseForm.edu_time,
        edu_fee: Number(courseForm.edu_fee),
        refund_amount: Number(courseForm.refund_amount),
      };

      await api.post('/courses/', payload);
      showToast(`'${courseForm.title}' 과정이 성공적으로 등록되었습니다!`);
      navigate('/courses');
    } catch (err) {
      console.error(err);
      showToast('과정 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          이전 페이지로 돌아가기
        </button>

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in select-text">
          {/* Header */}
          <div className="bg-slate-900 text-white px-8 py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
                <PlusCircle className="text-brand-accent-light" size={28} />
                교육과정 등록
              </h1>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                UnionAI 교육과정을 게시합니다. 아래의 세부사항들을 빠짐없이 기입해주세요.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCourseSubmit} className="p-8 space-y-12">
            {/* Section 1: Basic Information */}
            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText size={18} className="text-brand-primary" />
                기본 과정 정보
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="title" className="text-sm font-bold text-slate-700">과정명 *</label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={e => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="예: Physical AI 엔지니어"
                    title="과정명"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tags" className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <Tag size={13} className="text-slate-400" />
                    태그 관리 *
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="tags"
                      type="text"
                      required
                      value={courseForm.tags}
                      onChange={e => setCourseForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="태그를 직접 입력하거나 우측 목록에서 선택해 주세요"
                      title="태그"
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                    />
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        const current = courseForm.tags ? courseForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                        if (!current.includes(val)) {
                          const updated = [...current, val].join(', ');
                          setCourseForm(prev => ({ ...prev, tags: updated }));
                        }
                        e.target.value = '';
                      }}
                      className="px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold focus:outline-none focus:border-brand-primary cursor-pointer max-w-[150px]"
                      defaultValue=""
                    >
                      <option value="" disabled>태그 선택...</option>
                      {PREDEFINED_TAGS.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>

                  {/* Removable Badges */}
                  {courseForm.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 select-none">
                      {courseForm.tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const current = courseForm.tags.split(',').map(t => t.trim()).filter(Boolean);
                              const updated = current.filter(t => t !== tag).join(', ');
                              setCourseForm(prev => ({ ...prev, tags: updated }));
                            }}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="region" className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    교육 지역 *
                  </label>
                  <input
                    id="region"
                    type="text"
                    required
                    value={courseForm.region}
                    onChange={e => setCourseForm(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="예: 서울"
                    title="교육 지역"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Schedules */}
            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Calendar size={18} className="text-brand-primary" />
                모집 및 교육 일정
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="apply_start_date" className="text-sm font-bold text-slate-700">접수 시작일 *</label>
                  <input
                    id="apply_start_date"
                    type="date"
                    required
                    value={courseForm.apply_start_date}
                    onChange={e => setCourseForm(prev => ({ ...prev, apply_start_date: e.target.value }))}
                    placeholder="접수 시작일 (YYYY-MM-DD)"
                    title="접수 시작일"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="apply_end_date" className="text-sm font-bold text-slate-700">접수 종료일 *</label>
                  <input
                    id="apply_end_date"
                    type="date"
                    required
                    value={courseForm.apply_end_date}
                    onChange={e => setCourseForm(prev => ({ ...prev, apply_end_date: e.target.value }))}
                    placeholder="접수 종료일 (YYYY-MM-DD)"
                    title="접수 종료일"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edu_start_date" className="text-sm font-bold text-slate-700">교육 시작일 *</label>
                  <input
                    id="edu_start_date"
                    type="date"
                    required
                    value={courseForm.edu_start_date}
                    onChange={e => setCourseForm(prev => ({ ...prev, edu_start_date: e.target.value }))}
                    placeholder="교육 시작일 (YYYY-MM-DD)"
                    title="교육 시작일"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edu_end_date" className="text-sm font-bold text-slate-700">교육 종료일 *</label>
                  <input
                    id="edu_end_date"
                    type="date"
                    required
                    value={courseForm.edu_end_date}
                    onChange={e => setCourseForm(prev => ({ ...prev, edu_end_date: e.target.value }))}
                    placeholder="교육 종료일 (YYYY-MM-DD)"
                    title="교육 종료일"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="edu_time" className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    교육 시간 및 요일 정보 *
                  </label>
                  <input
                    id="edu_time"
                    type="text"
                    required
                    value={courseForm.edu_time}
                    onChange={e => setCourseForm(prev => ({ ...prev, edu_time: e.target.value }))}
                    placeholder="예: 매주 월/수 19:30 ~ 21:30"
                    title="교육 시간 및 요일 정보"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Fees */}
            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Coins size={18} className="text-brand-primary" />
                교육 비용 및 환급 조건
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edu_fee" className="text-sm font-bold text-slate-700">정상 교육비 (원) *</label>
                  <input
                    id="edu_fee"
                    type="number"
                    required
                    value={courseForm.edu_fee}
                    onChange={e => setCourseForm(prev => ({ ...prev, edu_fee: Number(e.target.value) }))}
                    placeholder="정상 교육비 금액 입력"
                    title="정상 교육비 (원)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="refund_amount" className="text-sm font-bold text-slate-700">환급 대상금액 (원) *</label>
                  <input
                    id="refund_amount"
                    type="number"
                    required
                    value={courseForm.refund_amount}
                    onChange={e => setCourseForm(prev => ({ ...prev, refund_amount: Number(e.target.value) }))}
                    placeholder="환급 대상금액 입력"
                    title="환급 대상금액 (원)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <BookOpen size={18} className="text-brand-primary" />
                교육과정 설명
              </h2>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-bold text-slate-700">과정 상세 소개 *</label>
                <RichTextEditor
                  value={courseForm.description}
                  onChange={html => setCourseForm(prev => ({ ...prev, description: html }))}
                  placeholder="교육 과정의 커리큘럼, 대상자 및 핵심 소개 내용을 입력해주세요."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 rounded-2xl font-bold text-sm text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors select-none cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 rounded-2xl font-bold text-sm text-white bg-brand-primary hover:bg-brand-secondary disabled:bg-slate-400 transition-all shadow-md select-none cursor-pointer"
              >
                {submitting ? '등록 중...' : '과정 등록 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
