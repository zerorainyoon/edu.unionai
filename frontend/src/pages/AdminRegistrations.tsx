import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowLeft, RefreshCw, Mail, Phone, BookOpen, Clock } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { api } from '../services/api';
import { courseService } from '../services/courseService';

export const AdminRegistrations: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [coursesMap, setCoursesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch courses to build title lookup map
      const courses = await courseService.getCourses();
      const cmap: Record<string, string> = {};
      courses.forEach(c => {
        cmap[c.id] = c.title;
      });
      setCoursesMap(cmap);

      // 2. Fetch registrations
      const data = await api.get<{ response: any[] }>('/course-registrations/');
      setRegistrations(data.response || []);
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

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            이전 페이지로 돌아가기
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-primary bg-white border border-slate-200 shadow-sm px-3.5 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
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
                <span className="text-xs font-black text-brand-accent-light uppercase tracking-widest bg-brand-primary/30 px-3 py-1 rounded-md mb-3 inline-block">
                  Admin Console
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
                  <ClipboardList className="text-brand-accent-light" size={28} />
                  수강 신청 현황 관리
                </h1>
                <p className="text-slate-400 text-sm mt-2 font-medium">
                  현재 접수된 모든 과정 수강 신청 및 상세 상담 내역을 모니터링하고 관리합니다.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl px-5 py-3 border border-white/10 shrink-0 text-left">
                <span className="text-xs font-bold text-slate-400 block mb-0.5">총 신청 내역</span>
                <span className="text-2xl font-black text-white">{loading ? '...' : registrations.length}건</span>
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="p-8 overflow-x-auto min-h-[350px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="animate-spin text-brand-primary mb-3" size={36} />
                <p className="text-slate-500 font-bold text-sm">수강 신청 데이터를 불러오는 중...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-100 text-slate-400 p-4.5 rounded-full mb-4">
                  <ClipboardList size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">접수된 신청 내역 없음</h3>
                <p className="text-slate-400 text-sm font-medium max-w-sm">
                  현재 접수된 수강 신청 또는 상세 상담 요청이 존재하지 않습니다.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-500">
                      <th className="p-4.5 select-none">신청자</th>
                      <th className="p-4.5 select-none">연락처 / 이메일</th>
                      <th className="p-4.5 select-none">신청 교육과정</th>
                      <th className="p-4.5 select-none">접수 상태</th>
                      <th className="p-4.5 select-none">신청일시</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4.5">
                          <span className="bg-slate-100 text-slate-800 text-xs font-black px-3 py-1.5 rounded-lg border border-slate-200">
                            {reg.name}
                          </span>
                        </td>
                        <td className="p-4.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Phone size={13} className="text-slate-400" />
                            {reg.phone}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1">
                            <Mail size={12} className="text-slate-300" />
                            {reg.email}
                          </div>
                        </td>
                        <td className="p-4.5">
                          <div className="flex items-start gap-1.5">
                            <BookOpen size={14} className="text-brand-secondary shrink-0 mt-0.5" />
                            <span className="font-bold text-slate-800 line-clamp-2">
                              {coursesMap[reg.course_id] || `과정 ID: ${reg.course_id}`}
                            </span>
                          </div>
                        </td>
                        <td className="p-4.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold ${
                            reg.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              reg.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}></span>
                            {reg.status === 'pending' ? '대기중' : reg.status}
                          </span>
                        </td>
                        <td className="p-4.5 text-xs text-slate-400 font-semibold">
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-300" />
                            {new Date(reg.created_at).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
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
