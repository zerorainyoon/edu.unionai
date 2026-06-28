import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, X, HelpCircle, User } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

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
  const [activeTab, setActiveTab] = useState<'write' | 'list'>('write');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const { showToast } = useToast();

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

    // Clear form and navigate to list
    setTitle('');
    setContent('');
    setEmail('');
    setActiveTab('list');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Banner Section */}
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 mb-8 animate-fade-in relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 mix-blend-overlay"></div>
          <div className="relative z-10 px-8 py-8 md:py-10 text-left select-text">
            <span className="text-xs font-black text-brand-accent-light uppercase tracking-widest bg-brand-primary/30 px-3 py-1 rounded-md mb-3 inline-block">
              1:1 ONLINE SUPPORT
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <MessageSquare className="text-brand-accent-light stroke-[2.5]" size={30} />
              1:1 온라인 문의
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium leading-relaxed">
              수강 신청 자격, 국민내일배움카드 연계, 커리큘럼 세부사항 등 교육 과정 전반에 관한 궁금증을 남겨주시면, 전문 상담원이 이메일과 대시보드를 통해 상세히 답변해 드립니다.
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-slate-250 mb-8 max-w-md mx-auto select-none">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-3 text-sm font-black cursor-pointer transition-colors border-b-2 text-center ${
              activeTab === 'write'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            문의 접수하기
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-sm font-black cursor-pointer transition-colors border-b-2 text-center ${
              activeTab === 'list'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            내 문의 내역 ({inquiries.length})
          </button>
        </div>

        {/* Tab 1: Form submission */}
        {activeTab === 'write' ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in max-w-3xl mx-auto select-text">
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200">
              <h2 className="text-sm font-black text-slate-700 flex items-center gap-2 select-none">
                <Send size={15} className="text-brand-primary" />
                온라인 문의 신청서 작성
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">문의 구분 *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-bold cursor-pointer"
                  >
                    <option value="수강 신청">수강 신청/자격</option>
                    <option value="교육과정">교육과정/커리큘럼</option>
                    <option value="시스템 장애">홈페이지/시스템 이용</option>
                    <option value="기타">기타 문의</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">답변 수신용 이메일 *</label>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">문의 제목 *</label>
                <input
                  type="text"
                  placeholder="문의의 핵심 요지를 작성해 주세요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">문의 내용 상세 *</label>
                <textarea
                  rows={6}
                  placeholder="훈련 연계, 수당, 일정 등 자세한 질문 내역을 기입해 주시면 더욱 빠르고 정합성 높은 답변을 받아보실 수 있습니다."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium leading-relaxed"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end select-none">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs tracking-wider rounded-xl shadow-md hover:shadow active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <Send size={14} />
                  1:1 문의 제출하기
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Tab 2: Inquiry List */
          <div className="space-y-4 max-w-4xl mx-auto select-text animate-fade-in">
            {inquiries.length > 0 ? (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold text-xxs">
                        {inq.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {inq.date}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-sm hover:text-brand-secondary transition-colors">
                      {inq.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 select-none">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                        inq.status === 'answered'
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
              ))
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm select-none">
                <HelpCircle className="text-slate-300 mx-auto mb-3" size={48} />
                <p className="text-lg font-black text-slate-700">접수된 문의 내역이 없습니다.</p>
                <p className="text-sm text-slate-400 mt-1 font-semibold">궁금한 점이 있다면 첫 번째 탭에서 문의를 제출해 보세요.</p>
              </div>
            )}
          </div>
        )}

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in select-text">
              {/* Header */}
              <div className="bg-slate-900 text-white p-6 relative">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 transition-colors cursor-pointer select-none"
                >
                  <X size={20} />
                </button>
                <div className="flex gap-2 items-center mb-2 select-none">
                  <span className="inline-block px-2.5 py-0.5 rounded-lg text-xxs font-black tracking-wide bg-brand-primary/30 text-brand-accent-light uppercase">
                    {selectedInquiry.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {selectedInquiry.date}
                  </span>
                </div>
                <h2 className="text-base md:text-lg font-black leading-snug pr-8">{selectedInquiry.title}</h2>
              </div>

              {/* Inquiry details */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* User Inquiry content */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-400 flex items-center gap-1 select-none">
                    <User size={13} />
                    질문 내용 ({selectedInquiry.email})
                  </h3>
                  <p className="text-slate-700 text-sm font-semibold whitespace-pre-line leading-relaxed pl-1">
                    {selectedInquiry.content}
                  </p>
                </div>

                {/* Operator Response */}
                {selectedInquiry.status === 'answered' && selectedInquiry.answer ? (
                  <div className="pt-5 border-t border-slate-150 space-y-3">
                    <div className="flex items-center justify-between select-none">
                      <h3 className="text-xs font-black text-brand-primary flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        WORK.AI 운영팀 답변
                      </h3>
                      <span className="text-xxs font-bold text-slate-400">
                        {selectedInquiry.answerDate}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                      <p className="text-slate-650 text-sm font-medium whitespace-pre-line leading-relaxed">
                        {selectedInquiry.answer}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="pt-5 border-t border-slate-150 flex items-center gap-2 bg-amber-50/50 p-4.5 rounded-2xl border border-amber-250/50 select-none">
                    <Clock size={16} className="text-amber-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-black text-amber-800">현재 담당자가 문의 내용을 검토 중입니다.</p>
                      <p className="text-xxs font-medium text-amber-600 mt-0.5">최대 24시간 이내에 접수해 주신 이메일로 회신해 드리겠습니다.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button footer */}
              <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-150 select-none">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-350 text-slate-700 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all"
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
