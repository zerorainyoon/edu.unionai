import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Grid, RefreshCw, AlertCircle } from 'lucide-react';
import { CourseCard } from '../components/ui/CourseCard';
import { useToast } from '../components/ui/Toast';
import type { Course } from '../data/courses';
import { courseService } from '../services/courseService';

const REGIONS = ['전국', '서울', '경기', '부산', '인천', '광주'];

export const CourseList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const searchFilter = searchParams.get('search') || '';
  const [selectedRegion, setSelectedRegion] = useState('전국');
  const [activeSubTab, setActiveSubTab] = useState('전체 과정');

  // API State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state with URL search param on mount or update
  const [searchInput, setSearchInput] = useState(searchFilter);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getCourses(searchFilter);
      setCourses(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '교육 과정 데이터를 불러오는 도중 오류가 발생했습니다.');
      showToast('API 호출 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchInput(searchFilter);
    fetchCourses();
  }, [searchFilter]);

  const handleSubTabClick = (e: React.MouseEvent, tabName: string) => {
    e.preventDefault();
    setActiveSubTab(tabName);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: searchInput.trim() });
  };

  const handleClearFilters = () => {
    setSelectedRegion('전국');
    setSearchInput('');
    setSearchParams({});
    setActiveSubTab('전체 과정'); // Fix: Reset subtab focus to '전체 과정'
  };

  // Filter Logic
  const filteredCourses = courses.filter((course) => {
    // 1. Tab-based Filtering (K-Digital vs SeSAC)
    const matchesTab =
      activeSubTab === '전체 과정' ||
      (activeSubTab === 'K-Digital Training' && course.type === 'k-digital') ||
      (activeSubTab === '새싹(SeSAC)' && course.type === 'sesac');

    if (!matchesTab) return false;

    // 2. Search Keyword Filtering
    const matchesSearch =
      course.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      course.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));

    // 4. Region Filtering
    const matchesRegion =
      selectedRegion === '전국' ||
      course.location.startsWith(selectedRegion);

    return matchesSearch && matchesRegion;
  });

  // Split filtered list by course type
  const kDigitalCourses = filteredCourses.filter(c => c.type === 'k-digital');
  const sesacCourses = filteredCourses.filter(c => c.type === 'sesac');

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in">
          <span className="text-brand-secondary text-sm font-extrabold uppercase tracking-widest bg-brand-accent-light px-3 py-1 rounded-md mb-3 inline-block">
            Education Directory
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            UnionAI 교육 과정
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed break-keep">
            UnionAI가 검증하는 현장 밀착형 실무 교육입니다. 국비 지원 혜택을 받고 성공적인 취업 파트너를 만나보세요.
          </p>
        </div>

        {/* Education course type subtabs */}
        <div className="border-b border-slate-200 mb-8 w-full flex overflow-x-auto scrollbar-none gap-2 pb-px">
          {['전체 과정', 'K-Digital Training', '새싹(SeSAC)'].map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <a
                key={tab}
                href="#"
                onClick={(e) => handleSubTabClick(e, tab)}
                className={`py-3 px-5 text-lg font-bold border-b-2 shrink-0 transition-all duration-200 ${isActive
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col gap-6">
          {/* Region Chips */}
          <span className="text-base font-bold text-slate-400 mt-2 shrink-0 flex items-center gap-1.5">
            <MapPin size={14} />
            지역별 필터
          </span>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold tracking-wide border transition-all duration-200 ${selectedRegion === reg
                  ? 'bg-brand-secondary text-white border-brand-secondary shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {reg}
              </button>
            ))}
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
                className="bg-brand-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-brand-secondary transition-colors"
              >
                검색
              </button>
            </form>

            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-brand-secondary font-bold px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={12} />
              필터 초기화
            </button>
          </div>
        </div>

        {/* Course Count Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <Grid size={14} className="text-slate-400" />
            검색 결과: <span className="text-brand-secondary">{loading ? '...' : filteredCourses.length}</span>건
          </div>
        </div>

        {/* Course Grid View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-12 max-w-xl mx-auto">
            <RefreshCw className="animate-spin text-brand-primary mb-4" size={40} />
            <p className="text-slate-500 font-bold">교육 과정 데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm max-w-xl mx-auto animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-rose-50 text-rose-500 mb-5">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">데이터 로드 실패</h3>
            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={fetchCourses}
              className="bg-brand-primary text-white font-bold text-base px-6 py-3 rounded-xl hover:bg-brand-secondary transition-colors shadow-md active:scale-95 duration-200"
            >
              다시 시도
            </button>
          </div>
        ) : filteredCourses.length > 0 ? (
          activeSubTab === '전체 과정' ? (
            <div className="space-y-12 animate-fade-in">
              {/* K-Digital Section */}
              {kDigitalCourses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-l-4 border-brand-primary pl-3 py-1">
                    <h2 className="text-xl font-extrabold text-slate-800">K-Digital Training 과정</h2>
                    <span className="text-xs text-slate-400 font-semibold mt-1">디지털 신기술 실전형 인재 양성</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {kDigitalCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {/* SeSAC Section */}
              {sesacCourses.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 border-l-4 border-brand-secondary pl-3 py-1">
                    <h2 className="text-xl font-extrabold text-slate-800">새싹 (SeSAC) 교육 과정</h2>
                    <span className="text-xs text-slate-400 font-semibold mt-1">서울형 청년 혁신 교육 아카데미</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sesacCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // For Single Tab View (K-Digital or SeSAC), it is already pre-filtered in filteredCourses!
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 md:p-16 text-center shadow-sm max-w-xl mx-auto animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-400 mb-5">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">검색 결과가 없습니다</h3>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-md mx-auto">
              선택한 카테고리, 지역 및 검색 키워드 '{searchFilter}'에 해당하는 교육 과정이 존재하지 않습니다. 필터를 초기화해 보세요.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-brand-primary text-white font-bold text-base px-6 py-3 rounded-xl hover:bg-brand-secondary transition-colors shadow-md active:scale-95 duration-200"
            >
              필터 초기화
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
