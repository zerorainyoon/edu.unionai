import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, X, HelpCircle, User, ClipboardList } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import mosaicBg from '../assets/background-l1-mosaic.svg';

interface InquiryRecord {
  id: string;
  category: string;
  title: string;
  content: string;
  email: string;
  date: string;
  status: 'pending' | 'answered';
  answer?: string;
  answerDate?: string;
}

const INITIAL_INQUIRIES: InquiryRecord[] = [
  {
    id: 'inq-1',
    category: '수강 신청',
    title: '내일배움카드 발급 중인데 사전 신청해도 문제없나요?',
    content: '현재 국민내일배움카드 온라인 발급을 어제 신청 완료하여 카드를 아직 수령하지 못한 상태입니다. 혹시 교육 신청이 마감되기 전에 WORK.AI 사전 신청서 먼저 작성해서 제출해도 최종 합격 및 카드 연계 처리에 문제가 없을지 여쭙고 싶습니다.',
    email: 'test-user@naver.com',
    date: '2026-06-25',
    status: 'answered',
    answer: '안녕하세요, 대한상공회의소 교육운영팀입니다.\n\n네, 가능합니다! 내일배움카드가 현재 발급 신청 중이시더라도, 교육과정 사전 선발 모집 정원이 조기 마감될 수 있으므로 홈페이지를 통해 수강 신청 서류를 먼저 제출해 주시는 것을 적극 권장합니다.\n\n추후 담당자 면담 진행 단계에서 실물 카드 수령 여부를 확인하고 카드 등록 절차를 별도 안내해 드리므로 신청 자격을 우선 확보하시기 바랍니다. 추가적인 문의 사항이 있으시면 언제든지 편하게 질문 남겨주세요. 감사합니다.',
    answerDate: '2026-06-26'
  },
  {
    id: 'inq-2',
    category: '교육과정',
    title: '교육 장소 및 비대면 훈련 진행 여부 문의',
    content: '직업 훈련 과정의 강의실 교육이 전면 오프라인 통학 교육으로 진행되는지, 아니면 일주일에 1~2회 정도 줌(Zoom) 등을 통한 원격 비대면 하이브리드 교육이 혼합되어 운영되는지 구체적인 출석 수업 일정이 궁금합니다.',
    email: 'korea-dev@gmail.com',
    date: '2026-06-27',
    status: 'pending'
  }
];

export const Inquiry: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(INITIAL_INQUIRIES);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Form State
  const [category, setCategory] = useState('수강 신청');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !email.trim()) {
      showToast('모든 필수 입력 필드를 기입해 주세요.');
      return;
    }

    const newInquiry: InquiryRecord = {
      id: `inq-${Date.now()}`,
      category,
      title: title.trim(),
      content: content.trim(),
      email: email.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setInquiries(prev => [newInquiry, ...prev]);
    showToast('1:1 문의가 안전하게 접수되었습니다.');

    // Clear form
    setTitle('');
    setContent('');
    setEmail('');
  };

  const isAdmin = user?.is_admin === true;

  // Render Inquiry Form Component (Full Width)
  const renderInquiryForm = () => (
    <div className="bg-white border border-slate-200 shadow-xl overflow-hidden animate-fade-in w-full select-text">
      <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 select-none">
          <Send size={15} className="text-brand-primary" />
          온라인 문의 신청서 작성
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">문의 구분 *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-medium cursor-pointer"
            >
              <option value="수강 신청">수강 신청/자격</option>
              <option value="교육과정">교육과정/커리큘럼</option>
              <option value="시스템 장애">홈페이지/시스템 이용</option>
              <option value="기타">기타 문의</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">답변 수신용 이메일 *</label>
            <input
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700">문의 제목 *</label>
          <input
            type="text"
            placeholder="문의의 핵심 요지를 작성해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-medium"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700">문의 내용 상세 *</label>
          <textarea
            rows={6}
            placeholder="훈련 연계, 수당, 일정 등 자세한 질문 내역을 기입해 주시면 더욱 빠르고 정합성 높은 답변을 받아보실 수 있습니다."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-medium leading-relaxed"
            required
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end select-none">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm tracking-wider shadow-md hover:shadow active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Send size={14} />
            1:1 문의 제출하기
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">

        {/* Page Header Banner */}
        <div
          className="relative overflow-hidden bg-[#183544] text-white py-12 px-8 md:py-16 md:px-16 mb-8 shadow-sm animate-fade-in"
          style={{
            backgroundImage: `url(${mosaicBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="relative z-10 w-full text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3 text-white">
              <MessageSquare className="h-8 md:h-9 w-auto text-white stroke-[2]" />
              {isAdmin ? '1:1 문의 현황 관리' : '1:1 온라인 문의'}
            </h1>
            <p className="text-base md:text-lg text-blue-100/90 leading-relaxed break-keep font-medium">
              {isAdmin 
                ? '사용자가 접수한 1:1 온라인 문의 및 상담 신청 내역을 모니터링하고 답변을 검토합니다.'
                : '수강 신청 자격, 국민내일배움카드 연계, 커리큘럼 세부사항 등 교육 과정 전반에 관한 궁금증을 남겨주시면, 전문 상담원이 이메일과 대시보드를 통해 상세히 답변해 드립니다.'
              }
            </p>
          </div>
        </div>

        {/* Conditional Layout: Admin View (Dashboard + Form) vs General User View (Form Only) */}
        {!isAdmin ? (
          /* ==========================================
             1. General User View: Inquiry Form Only
             ========================================== */
          renderInquiryForm()
        ) : (
          /* ==========================================
             2. Admin View: Board List AND Inquiry Form (Both Accessible)
             ========================================== */
          <div className="space-y-12 w-full animate-fade-in">
            {/* Admin Board List */}
            <div className="space-y-4 select-text">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-2 select-none">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList size={16} className="text-brand-primary" />
                  접수된 1:1 온라인 문의 목록 ({inquiries.length})
                </h2>
              </div>

              {inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-bold text-xs">
                            {inq.category}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {inq.date}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base hover:text-brand-secondary transition-colors">
                          {inq.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 select-none">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${inq.status === 'answered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                        >
                          {inq.status === 'answered' ? (
                            <>
                              <CheckCircle2 size={13} />
                              답변 완료
                            </>
                          ) : (
                            <>
                              <Clock size={13} className="animate-pulse" />
                              답변 대기
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 p-8 text-center shadow-sm select-none max-w-md mx-auto">
                  <HelpCircle className="text-slate-350 mx-auto mb-3" size={40} />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">접수된 문의 내역이 없습니다</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                    사용자가 제출한 문의 내역이 아직 존재하지 않습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in select-text">
              {/* Header */}
              <div className="bg-slate-900 text-white p-6 relative">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="absolute right-4 top-4 text-slate-450 hover:text-white p-1 transition-colors cursor-pointer select-none"
                >
                  <X size={20} />
                </button>
                <div className="flex gap-2 items-center mb-2 select-none">
                  <span className="inline-block px-2 py-0.5 text-xs font-semibold tracking-wide bg-brand-primary/20 text-brand-accent-light uppercase">
                    {selectedInquiry.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {selectedInquiry.date}
                  </span>
                </div>
                <h2 className="text-lg font-bold leading-snug pr-8 text-white">{selectedInquiry.title}</h2>
              </div>

              {/* Inquiry details */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* User Inquiry content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-400 flex items-center gap-1 select-none">
                    <User size={13} />
                    질문 내용 ({selectedInquiry.email})
                  </h3>
                  <p className="text-slate-700 text-sm font-medium whitespace-pre-line leading-relaxed pl-1">
                    {selectedInquiry.content}
                  </p>
                </div>

                {/* Operator Response */}
                {selectedInquiry.status === 'answered' && selectedInquiry.answer ? (
                  <div className="pt-5 border-t border-slate-150 space-y-3">
                    <div className="flex items-center justify-between select-none">
                      <h3 className="text-sm font-bold text-brand-primary flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        WORK.AI 운영팀 답변
                      </h3>
                      <span className="text-xs font-bold text-slate-400">
                        {selectedInquiry.answerDate}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-5 border border-slate-200/60">
                      <p className="text-slate-650 text-sm font-medium whitespace-pre-line leading-relaxed">
                        {selectedInquiry.answer}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="pt-5 border-t border-slate-150 flex items-center gap-2 bg-amber-50/50 p-4.5 border border-amber-250/50 select-none">
                    <Clock size={16} className="text-amber-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-amber-800">현재 담당자가 문의 내용을 검토 중입니다.</p>
                      <p className="text-xs font-medium text-amber-600 mt-0.5">최대 24시간 이내에 접수해 주신 이메일로 회신해 드리겠습니다.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button footer */}
              <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-150 select-none">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold text-sm cursor-pointer active:scale-95 transition-all"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Inquiry;
