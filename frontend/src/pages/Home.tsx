import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Target, BookOpen, Star, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const handleApplyClick = () => {
    showToast('맞춤형 교육 신청 서비스는 현재 준비 중입니다.');
  };

  const metrics = [
    { label: '누적 교육 수료생', value: '14,280명+', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: '개설 교육과정', value: '320개+', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
    { label: '기업 협력 네트워크', value: '1,850개사', icon: Target, color: 'text-purple-600 bg-purple-50' },
    { label: '평균 취업률', value: '84.6%', icon: Star, color: 'text-amber-500 bg-amber-50' },
  ];

  const features = [
    {
      title: '100% 국비 지원 무료교육',
      desc: '국민내일배움카드 등을 활용해 교육비 전액을 국가에서 지원하고, 매월 훈련 수당도 지급받을 수 있습니다.',
      badge: '수강료 0원'
    },
    {
      title: '실무 프로젝트 중심 실습',
      desc: '단순한 이론 공부를 넘어 현업 기업의 실제 비즈니스 데이터를 기반으로 현장 중심 프로젝트를 수행합니다.',
      badge: '프로젝트 기반'
    },
    {
      title: '대기업/중견기업 맞춤 채용연계',
      desc: '수료 후 협약 대기업 및 대한상공회의소 회원사를 대상으로 전담 매니저가 1:1 이력서 컨설팅과 면접 추천을 제공합니다.',
      badge: '취업 연계'
    },
    {
      title: '디지털/신기술 최신 트렌드',
      desc: 'AI, 빅데이터, 클라우드, 스마트 팩토리 등 급변하는 신산업 트렌드에 최적화된 최신 커리큘럼을 제공합니다.',
      badge: '신산업 특화'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col select-none">
      {/* Immersive Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary-dark via-brand-primary to-slate-900 text-white py-20 px-6 overflow-hidden md:py-28">
        {/* Soft floating blurred blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-brand-secondary/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-accent/25 blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold tracking-wider mb-6 text-brand-accent-light">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></span>
            대한상공회의소 신기술 핵심 실무 인재 양성
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-6">
            내일을 이끄는 실무 역량,<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">WORK.AI</span>에서 완성하세요
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            정부지원 무료 직무 교육부터 대한상공회의소 우수 협약 기업으로의 채용 연계까지, 당신의 커리어 패스를 디자인해 드립니다.
          </p>

          {/* Dynamic Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex bg-white/95 backdrop-blur shadow-xl overflow-hidden p-1.5 border border-white/30">
            <div className="flex-grow flex items-center px-3">
              <Search className="text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="관심 있는 교육 과정을 입력하세요 (예: AI, 파이썬, 개발)"
                className="w-full bg-transparent border-none text-slate-800 font-medium placeholder-slate-400 focus:outline-none px-2 text-base select-text"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-secondary hover:bg-brand-primary-light text-white font-bold text-base px-6 py-3 transition-all duration-200 shadow active:scale-95 shrink-0"
            >
              과정 검색
            </button>
          </form>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white border border-slate-200 shadow-md grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 overflow-hidden">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="p-6 flex flex-col items-center text-center">
                <div className={`p-3 ${m.color} mb-3`}>
                  <Icon size={22} className="stroke-[2.5]" />
                </div>
                <span className="text-sm font-bold text-slate-400 tracking-wider mb-1">{m.label}</span>
                <span className="text-2xl font-extrabold text-slate-900">{m.value}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Value Pillars / Core Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">
            대한상공회의소 교육 과정만의 특별함
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            취업 성공에 필요한 검증된 커리큘럼과 전문 훈련 시설, 폭넓은 채용 네트워크를 완벽히 구축하였습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-brand-accent-light text-brand-secondary text-xs font-extrabold px-2.5 py-1 tracking-wider">
                    {f.badge}
                  </span>
                  <span className="text-slate-200 group-hover:text-brand-accent-light text-2xl font-black tracking-tight transition-colors duration-300">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Customized Training Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-slate-900 to-brand-primary-dark text-white p-8 md:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-secondary/10 blur-3xl -z-1"></div>

          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <h3 className="text-2xl md:text-3xl font-black leading-snug">
              우리 기업의 디지털 혁신을 위한<br />
              맞춤형 직무 교육을 설계해 드립니다.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              신기술 도입부터 재직자 리스킬링 교육까지, 기업 전용 특화 교육을 대한상공회의소 교육 기획 전문가가 직접 맞춤 설계하고 대행해 드립니다.
            </p>
          </div>

          <button
            onClick={handleApplyClick}
            className="bg-brand-accent text-white hover:bg-brand-secondary font-bold text-base tracking-wider px-6 py-3.5 shadow-lg flex items-center gap-2 group transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            기업 맞춤형 교육 문의
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
