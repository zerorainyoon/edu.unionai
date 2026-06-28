import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft, RefreshCw, Layers, MapPin, Search, Calendar, Tag, Landmark, Clock, FileText } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../services/api';
import { courseService } from '../../services/courseService';
import type { ApiCourse } from '../../services/courseService';
import { CourseCard } from '../../components/ui/CourseCard';
import type { Course } from '../../data/courses';

const CATEGORIES = ['전체', '인공지능', '클라우드', '스마트팩토리', '웹개발', '모바일앱', '로봇'];
const REGIONS = ['전국', '서울', '경기', '부산', '인천', '광주'];

export const AdminCourses: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // List View State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전국');
  const [activeSubTab, setActiveSubTab] = useState('전체 과정');

  // Edit View State
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    tags: 'K-Digital',
    region: '서울',
    description: '',
    apply_start_date: '',
    apply_end_date: '',
    edu_start_date: '',
    edu_end_date: '',
    edu_time: '',
    edu_fee: 0,
    refund_amount: 0,
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses(searchFilter);
      setCourses(data);
    } catch (err) {
      console.error(err);
      showToast('교육 과정 데이터를 불러오는 도중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchFilter]);

  // Load raw course details for editing
  const loadRawCourse = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.get<{ response: ApiCourse }>(`/courses/${id}`);
      const raw = data.response;
      setCourseForm({
        title: raw.title || '',
        tags: Array.isArray(raw.tags) ? raw.tags.join(', ') : (raw.tags || ''),
        region: raw.region || '',
        description: raw.description || '',
        apply_start_date: raw.apply_start_date || '',
        apply_end_date: raw.apply_end_date || '',
        edu_start_date: raw.edu_start_date || '',
        edu_end_date: raw.edu_end_date || '',
        edu_time: raw.edu_time || '',
        edu_fee: raw.edu_fee || 0,
        refund_amount: raw.refund_amount || 0,
      });
    } catch (err) {
      console.error(err);
      showToast('교육과정 상세 정보를 불러오는 중 오류가 발생했습니다.');
      setEditingCourseId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editingCourseId) {
      loadRawCourse(editingCourseId);
    }
  }, [editingCourseId]);

  const handleSubTabClick = (e: React.MouseEvent, tabName: string) => {
    e.preventDefault();
    setActiveSubTab(tabName);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilter(searchInput.trim());
  };

  const handleClearFilters = () => {
    setSelectedCategory('전체');
    setSelectedRegion('전국');
    setSearchInput('');
    setSearchFilter('');
    setActiveSubTab('전체 과정');
  };

  const handleStartEdit = (id: string) => {
    setEditingCourseId(id);
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseId) return;
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

      await api.put(`/courses/${editingCourseId}`, payload);
      showToast(`'${courseForm.title}' 과정이 성공적으로 수정되었습니다.`);
      setEditingCourseId(null);
      fetchCourses();
    } catch (err) {
      console.error(err);
      showToast('과정 수정 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!window.confirm(`'${title}' 과정을 정말로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }
    try {
      await api.delete(`/courses/${id}`);
      showToast(`'${title}' 과정이 성공적으로 삭제되었습니다.`);
      if (editingCourseId === id) {
        setEditingCourseId(null);
      }
      fetchCourses();
    } catch (err) {
      console.error(err);
      showToast('과정 삭제 중 오류가 발생했습니다.');
    }
  };

  // Filter logic matching CourseList
  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      activeSubTab === '전체 과정' ||
      (activeSubTab === 'K-Digital Training' && course.type === 'k-digital') ||
      (activeSubTab === '새싹' && course.type === 'sesac');

    if (!matchesTab) return false;

    const matchesSearch =
      course.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      course.category.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory =
      selectedCategory === '전체' ||
      course.category.replace(/\s+/g, '').includes(selectedCategory) ||
      course.title.replace(/\s+/g, '').includes(selectedCategory);

    const matchesRegion =
      selectedRegion === '전국' ||
      course.location.startsWith(selectedRegion);

    return matchesSearch && matchesCategory && matchesRegion;
  });



  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => editingCourseId ? handleCancelEdit() : navigate(-1)}
          className="group mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          이전 페이지로 돌아가기
        </button>

        {editingCourseId ? (
          /* ========================================================
             1. EDIT MODE: Detailed Course Edit Form View
             ======================================================== */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in select-text">
            {/* Header */}
            <div className="bg-slate-900 text-white px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 mix-blend-overlay"></div>
              <div className="relative z-10">
                <span className="text-xs font-black text-brand-accent-light uppercase tracking-widest bg-brand-primary/30 px-3 py-1 rounded-md mb-3 inline-block">
                  Admin Console / Edit Course
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
                  <Settings className="text-brand-accent-light" size={28} />
                  교육과정 상세 정보 수정
                </h1>
                <p className="text-slate-400 text-sm mt-2 font-medium">
                  교육과정의 세부 속성을 변경하고 저장합니다. 필요한 경우 하단의 삭제 버튼을 사용해 삭제할 수 있습니다.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="animate-spin text-brand-primary mb-3" size={40} />
                <p className="text-slate-500 font-bold text-sm">상세 정보를 불러오는 중...</p>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="p-8 space-y-8">
                {/* Section 1: Basic Information */}
                <div className="space-y-5">
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
                        placeholder="예: (2) FastAPI 실무 마스터 클래스"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="tags" className="text-sm font-bold text-slate-700 flex items-center gap-1">
                        <Tag size={13} className="text-slate-400" />
                        태그 (쉼표로 구분) *
                      </label>
                      <input
                        id="tags"
                        type="text"
                        required
                        value={courseForm.tags}
                        onChange={e => setCourseForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="예: K-Digital, 백엔드, FastAPI"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                      />
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label htmlFor="description" className="text-sm font-bold text-slate-700">과정 상세 소개 *</label>
                      <textarea
                        id="description"
                        required
                        value={courseForm.description}
                        onChange={e => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="교육 과정의 커리큘럼, 대상자 및 핵심 소개 내용을 입력해주세요."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all resize-none select-text"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Schedules */}
                <div className="space-y-5">
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Fees */}
                <div className="space-y-5">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Landmark size={18} className="text-brand-primary" />
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all select-text"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 min-w-[120px] py-4 rounded-2xl font-bold text-sm text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors select-none cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(editingCourseId, courseForm.title)}
                    className="flex-1 min-w-[120px] py-4 rounded-2xl font-bold text-sm text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors select-none cursor-pointer"
                  >
                    과정 삭제하기
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 min-w-[200px] py-4 rounded-2xl font-bold text-sm text-white bg-brand-primary hover:bg-brand-secondary disabled:bg-slate-400 transition-all shadow-md select-none cursor-pointer"
                  >
                    {submitting ? '저장 중...' : '수정 완료'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ========================================================
             2. LIST MODE: Course Filter and Card List View
             ======================================================== */
          <div className="space-y-8 select-text">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
              <div className="bg-slate-900 text-white px-8 py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black text-brand-accent-light uppercase tracking-widest bg-brand-primary/30 px-3 py-1 rounded-md mb-3 inline-block">
                      Admin Console
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
                      <Settings className="text-brand-accent-light" size={28} />
                      교육과정 관리
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium">
                      전체 등록된 교육과정을 상세 검색하고 수정하거나 신속히 삭제할 수 있습니다.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-2xl px-5 py-3 border border-white/10 shrink-0 text-left">
                    <span className="text-xs font-bold text-slate-400 block mb-0.5">전체 등록 과정</span>
                    <span className="text-2xl font-black text-white">{loading ? '...' : courses.length}개</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Education course type subtabs */}
            <div className="border-b border-slate-200 w-full flex overflow-x-auto scrollbar-none gap-2 pb-px select-none">
              {['전체 과정', 'K-Digital Training', '새싹'].map((tab) => {
                const isActive = activeSubTab === tab;
                return (
                  <a
                    key={tab}
                    href="#"
                    onClick={(e) => handleSubTabClick(e, tab)}
                    className={`py-3 px-5 text-base font-bold border-b-2 shrink-0 transition-all duration-200 ${isActive
                      ? 'border-brand-secondary text-brand-secondary'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                  >
                    {tab}
                  </a>
                );
              })}
            </div>

            {/* Filter and Search Console */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6 select-none">
              {/* Category Chips */}
              <div className="flex flex-col md:flex-row gap-3 items-start">
                <span className="text-sm font-bold text-slate-400 mt-2 shrink-0 flex items-center gap-1.5">
                  <Layers size={14} />
                  분야별 필터
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer ${selectedCategory === cat
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Chips */}
              <div className="flex flex-col md:flex-row gap-3 items-start pt-4 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-400 mt-2 shrink-0 flex items-center gap-1.5">
                  <MapPin size={14} />
                  지역별 필터
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer ${selectedRegion === reg
                        ? 'bg-brand-secondary text-white border-brand-secondary shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search bar & Reset buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 items-stretch sm:items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md flex border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50 focus-within:bg-white focus-within:border-brand-accent transition-all">
                  <div className="flex-grow flex items-center px-2">
                    <Search size={16} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="과정명 또는 키워드 입력..."
                      className="w-full bg-transparent border-none text-slate-700 font-medium placeholder-slate-400 focus:outline-none px-2 text-sm select-text"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-primary text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-brand-secondary transition-colors cursor-pointer"
                  >
                    검색
                  </button>
                </form>

                <button
                  onClick={handleClearFilters}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-primary bg-white border border-slate-200 shadow-sm px-3.5 py-2.5 rounded-xl active:scale-95 transition-all cursor-pointer select-none"
                >
                  <RefreshCw size={12} />
                  필터 초기화
                </button>
              </div>
            </div>

            {/* Course Grid Layout */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="animate-spin text-brand-secondary mb-3" size={40} />
                <p className="text-slate-500 font-bold text-sm">교육 과정 리스트를 불러오는 중...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm max-w-md mx-auto animate-fade-in">
                <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-400 mb-4">
                  <Settings size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs mx-auto">
                  선택한 필터 조건에 해당하는 교육 과정이 존재하지 않습니다. 필터를 초기화해 보세요.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-brand-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-secondary transition-colors shadow-sm active:scale-95 duration-200 cursor-pointer"
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isAdmin={true}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteCourse}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
