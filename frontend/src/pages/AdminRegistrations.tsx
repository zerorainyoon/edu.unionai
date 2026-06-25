import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowLeft, RefreshCw, Mail, Phone, Clock } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { api } from '../services/api';
import { courseService } from '../services/courseService';

export const AdminRegistrations: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const getTodayStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filterCoursesByDate = (allCourses: any[]) => {
    const todayStr = getTodayStr();
    return allCourses.filter(c => {
      const eduStart = c.edu_start_date;
      const eduEnd = c.edu_end_date;

      // Align with main page status: Show courses that are open for registration or currently educating
      const isApplying = c.status === '모집중' || c.status === '마감임박';
      const isEducating = eduStart && eduEnd && (eduStart <= todayStr && todayStr <= eduEnd);

      return isApplying || isEducating;
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch courses
      const allCourses = await courseService.getCourses();

      // 2. Filter courses (applying or educating)
      const validCourses = filterCoursesByDate(allCourses);
      setFilteredCourses(validCourses);

      if (validCourses.length > 0) {
        setSelectedCourseId(validCourses[0].id);
      } else {
        setSelectedCourseId('');
      }

      // 3. Fetch registrations
      const data = await api.get<{ response: any[] }>('/course-registrations/');
      const loadedRegs = (data.response || []).map((r: any) => ({
        ...r,
        originalComment: r.comment
      }));
      setRegistrations(loadedRegs);
    } catch (err) {
      console.error(err);
      showToast('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCommentChange = (regId: number, value: string) => {
    setRegistrations(prev =>
      prev.map(r => r.id === regId ? { ...r, comment: value } : r)
    );
  };

  const handleCommentBlur = async (reg: any) => {
    // 코멘트 내용이 실제로 변경되었을 때만 API 호출
    if (reg.comment === reg.originalComment) return;

    try {
      await api.put(`/course-registrations/${reg.id}`, {
        status: reg.status,
        comment: reg.comment ? reg.comment.trim() : null
      });
      showToast('코멘트가 성공적으로 저장되었습니다.');

      // 저장 성공 시 originalComment 동기화
      setRegistrations(prev =>
        prev.map(r => r.id === reg.id ? { ...r, originalComment: reg.comment } : r)
      );
    } catch (err) {
      console.error(err);
      showToast('코멘트 저장 중 오류가 발생했습니다.');
      loadData();
    }
  };

  const handleStatusSelectChange = async (reg: any, newStatus: string) => {
    try {
      // 접수 상태가 변경된 경우 즉시 API 호출
      const targetComment = reg.comment ? reg.comment.trim() : null;

      await api.put(`/course-registrations/${reg.id}`, {
        status: newStatus,
        comment: targetComment
      });
      showToast('접수 상태가 업데이트되었습니다.');

      setRegistrations(prev =>
        prev.map(r => r.id === reg.id ? { ...r, status: newStatus, originalComment: targetComment } : r)
      );
    } catch (err) {
      console.error(err);
      showToast('상태 변경 중 오류가 발생했습니다.');
      loadData();
    }
  };

  const selectedCourse = filteredCourses.find(c => String(c.id) === String(selectedCourseId));

  const filteredRegistrations = registrations.filter(
    (reg) => String(reg.course_id) === String(selectedCourseId)
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-base font-bold text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            이전 페이지로 돌아가기
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-brand-primary bg-white border border-slate-200 shadow-sm px-3.5 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            새로고침
          </button>
        </div>

        {/* Console Container Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in select-text">
          {/* Header */}
          <div className="bg-slate-900 text-white px-8 py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-black text-brand-accent-light uppercase tracking-widest bg-brand-primary/30 px-3 py-1.5 rounded-md mb-3 inline-block">
                  Admin Console
                </span>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2.5">
                  <ClipboardList className="text-brand-accent-light" size={32} />
                  수강 신청 현황 관리
                </h1>
                <p className="text-slate-400 text-base mt-2 font-medium">
                  현재 날짜 기준 모집 중이거나 교육 중인 코스를 선택하고, 수강 신청 및 상세 상담 내역을 모니터링합니다.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl px-5 py-3 border border-white/10 shrink-0 text-left">
                <span className="text-sm font-bold text-slate-400 block mb-0.5">전체 접수 내역</span>
                <span className="text-3xl font-black text-white">{loading ? '...' : registrations.length}건</span>
              </div>
            </div>
          </div>

          {/* Course Selector Section */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <label htmlFor="course-select" className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                대상 교육 과정 선택 (현재 접수 중 또는 교육 진행 중)
              </label>
              <div className="relative">
                <select
                  id="course-select"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 font-extrabold px-4 py-3.5 pr-10 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent cursor-pointer appearance-none text-base transition-all"
                  disabled={filteredCourses.length === 0}
                >
                  {filteredCourses.length === 0 ? (
                    <option value="">현재 진행 중인 교육 과정이 없습니다.</option>
                  ) : (
                    filteredCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.type === 'k-digital' ? 'K-Digital' : 'SeSAC'}] {c.title}
                      </option>
                    ))
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Selected Course Quick Meta Details */}
            {selectedCourse && (
              <div className="flex flex-wrap gap-3 md:self-end">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm shadow-sm">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">모집 기간</span>
                  <span className="font-extrabold text-slate-700">{selectedCourse.applyPeriod}</span>
                </div>
                <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl px-4 py-2.5 text-sm shadow-sm">
                  <span className="block text-xs font-bold text-brand-primary uppercase mb-0.5">선택 코스 신청자</span>
                  <span className="font-black text-brand-primary">{filteredRegistrations.length}명</span>
                </div>
              </div>
            )}
          </div>

          {/* List Content */}
          <div className="p-8 overflow-x-auto min-h-[350px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="animate-spin text-brand-primary mb-3" size={40} />
                <p className="text-slate-500 font-bold text-base">수강 신청 데이터를 불러오는 중...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-100 text-slate-400 p-4.5 rounded-full mb-4">
                  <ClipboardList size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">진행 중인 코스 없음</h3>
                <p className="text-slate-400 text-base font-medium max-w-md">
                  현재 날짜를 기준으로 수강 접수 중이거나 교육 진행 중인 과정이 존재하지 않습니다.
                </p>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-100 text-slate-400 p-4.5 rounded-full mb-4">
                  <ClipboardList size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">신청 내역이 없습니다</h3>
                <p className="text-slate-400 text-base font-medium max-w-md">
                  선택하신 교육 과정에 접수된 수강 신청 또는 상세 상담 요청이 존재하지 않습니다.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-base">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-600">
                      <th className="p-4.5 select-none">신청자</th>
                      <th className="p-4.5 select-none">연락처 / 이메일</th>
                      <th className="p-4.5 select-none">접수 상태</th>
                      <th className="p-4.5 select-none">관리자 코멘트</th>
                      <th className="p-4.5 select-none">신청일시</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4.5">
                          <span className="bg-slate-100 text-slate-800 text-sm font-black px-3 py-1.5 rounded-lg border border-slate-200">
                            {reg.name}
                          </span>
                        </td>
                        <td className="p-4.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Phone size={15} className="text-slate-400" />
                            {reg.phone}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-slate-400 font-semibold mt-1">
                            <Mail size={14} className="text-slate-300" />
                            {reg.email}
                          </div>
                        </td>
                        <td className="p-4.5 text-slate-800 font-bold">
                          <select
                            value={reg.status}
                            onChange={(e) => handleStatusSelectChange(reg, e.target.value)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-extrabold border cursor-pointer focus:outline-none transition-all ${reg.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-2 focus:ring-amber-500'
                                : reg.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-2 focus:ring-emerald-500'
                                  : 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-2 focus:ring-rose-500'
                              }`}
                          >
                            <option value="pending">대기중</option>
                            <option value="approved">승인</option>
                            <option value="rejected">반려</option>
                          </select>
                        </td>
                        <td className="p-4.5 min-w-[320px] max-w-[500px]">
                          <input
                            type="text"
                            value={reg.comment || ''}
                            onChange={(e) => handleCommentChange(reg.id, e.target.value)}
                            onBlur={() => handleCommentBlur(reg)}
                            placeholder="코멘트를 입력하세요 (입력 후 포커스 아웃 시 저장)"
                            className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm border bg-white border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                          />
                        </td>
                        <td className="p-4.5 text-sm text-slate-400 font-semibold">
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-slate-300" />
                            {new Date(reg.created_at).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
