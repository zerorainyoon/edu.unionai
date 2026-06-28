import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  id: string;
  category: 'admission' | 'course' | 'system' | 'etc';
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'admission',
    question: '국비 지원 교육 과정의 신청 자격은 어떻게 되나요?',
    answer: '국민내일배움카드를 소지하고 계시거나 발급이 가능한 구직자, 대학 졸업예정자, 재직자 등 모두 신청하실 수 있습니다. 상세한 자격 요건은 거주지 관할 고용센터나 고용노동부 HRD-Net 홈페이지를 통해 빠르게 진단 받으실 수 있으며, 대한상공회의소 교육과정은 100% 전액 무료로 진행됩니다.'
  },
  {
    id: 'faq-2',
    category: 'admission',
    question: '수강 신청 후 선발 프로세스가 궁금합니다.',
    answer: '수강 신청이 접수되면 담당자가 개별 연락을 드려 서류 상담 일정을 조율합니다. 간단한 면담 및 기초 테스트를 통해 교육 이수 의지와 취업 적합성을 면밀히 심사한 뒤, 최종 선발 여부를 개별 통지해 드립니다. 모집 정원이 마감되기 전에 미리 접수하시는 것을 권장합니다.'
  },
  {
    id: 'faq-3',
    category: 'course',
    question: '비전공자나 초보자도 수업을 따라갈 수 있을까요?',
    answer: '네, 가능합니다. 대한상공회의소 WORK.AI 교육과정은 기초 이론부터 실무 실습까지 단계별 커리큘럼으로 구성되어 있습니다. 현업 경험이 풍부한 전문 강사진이 개별 피드백과 멘토링을 제공하며, 스터디 그룹 형성을 적극적으로 지원하므로 비전공자 교육생 분들도 성실히 참여하시면 낙오 없이 수료하실 수 있습니다.'
  },
  {
    id: 'faq-4',
    category: 'course',
    question: '교육 기간 중 취업 지원 혜택에는 무엇이 있나요?',
    answer: '교육생 개개인을 위한 맞춤형 커리어 로드맵을 설계해 드립니다. 이력서 및 자기소개서 전문 첨삭, 일대일 모의 면접, 그리고 우수 협약 기업으로의 우선 채용 추천 기회를 연계해 드립니다. 또한 정기적으로 현업 실무자 네트워킹 특강 및 취업 콘서트 프로그램을 무료 제공합니다.'
  },
  {
    id: 'faq-5',
    category: 'system',
    question: '국민내일배움카드는 어떻게 발급받나요?',
    answer: '가까운 관할 고용복지플러스센터에 신분증을 지참하여 직접 방문 신청하시거나, 온라인 고용노동부 HRD-Net 포털 사이트에 접속하셔서 본인 인증 후 간편하게 카드 발급을 신청하실 수 있습니다. 발급 승인까지 영업일 기준 약 1~2주가 소요되므로 교육 시작 전에 여유 있게 신청해 주세요.'
  },
  {
    id: 'faq-6',
    category: 'etc',
    question: '훈련 수당이나 차비, 식비 보조금이 나오나요?',
    answer: '교육 기간 동안 성실하게 출석하신 교육생 분들께는 고용노동부 규정에 따라 월 최대 훈련수당과 식비/교통비 보조금 혜택이 현금 지급됩니다. 출석률 80% 이상을 달성하셔야 훈련 장려금이 정상 지급되며, 개인별 고용 형태나 국민취업지원제도 참여 여부에 따라 상세 수당 금액은 상이할 수 있습니다.'
  }
];

export const FAQ: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilter(searchInput.trim());
    setOpenFaqId(null);
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">

        {/* Banner Section */}
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 mb-20 animate-fade-in relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 mix-blend-overlay"></div>
          <div className="relative z-10 px-8 py-8 md:py-10 text-left select-text">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <HelpCircle className="text-brand-accent-light stroke-[2.5]" size={30} />
              자주 묻는 질문 (FAQ)
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium leading-relaxed break-keep">
              UnionAI 교육과정 및 국비 무료 훈련에 대해 가장 많이 들어오는 문의 사항들을 모았습니다. 궁금한 점을 키워드로 직접 찾아보세요.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-8 max-w-md mx-auto select-none">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="궁금한 사항이나 키워드 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-14 py-3 rounded-xl bg-white text-slate-800 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-bold text-sm tracking-wide transition-all select-text"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearchFilter('');
                  setOpenFaqId(null);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                초기화
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-black rounded-xl text-sm tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95 duration-150 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <Search size={14} />
            검색
          </button>
        </form>



        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-black text-slate-800 hover:text-brand-secondary transition-colors cursor-pointer select-none"
                  >
                    <span className="text-base tracking-tight flex items-start gap-3">
                      <span className="text-brand-primary font-black text-lg select-none">Q.</span>
                      <span className="select-text">{faq.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="text-slate-400 shrink-0" size={20} />
                    ) : (
                      <ChevronDown className="text-slate-400 shrink-0" size={20} />
                    )}
                  </button>

                  {/* Accordion Expand Area */}
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 animate-fade-in select-text">
                      <div className="flex gap-3 leading-relaxed text-sm font-medium text-slate-600">
                        <span className="text-brand-secondary font-black text-lg select-none">A.</span>
                        <p className="flex-1 whitespace-pre-line leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm select-text">
              <HelpCircle className="text-slate-300 mx-auto mb-3" size={48} />
              <p className="text-lg font-black text-slate-700">검색 결과가 존재하지 않습니다.</p>
              <p className="text-sm text-slate-400 mt-1 font-medium">검색 키워드를 바꾸거나 다른 필터 카테고리를 선택해 보세요.</p>
            </div>
          )}
        </div>

        {/* Footer Support Info */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-brand-accent-light p-3 rounded-2xl text-brand-secondary flex items-center justify-center">
              <MessageSquare size={24} className="stroke-[2.5]" />
            </div>
            <div className="text-left select-text">
              <h3 className="font-black text-slate-800">원하시는 답변을 찾기 어려우신가요?</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">상세한 개인 맞춤형 상담을 원하시면 언제든 1:1 온라인 문의를 이용해 주세요.</p>
            </div>
          </div>
          <Link
            to="/inquiry"
            className="px-5 py-3 rounded-xl bg-brand-secondary hover:bg-brand-primary text-white font-bold text-sm tracking-wider shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer text-center whitespace-nowrap"
          >
            1:1 문의하러 가기
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
