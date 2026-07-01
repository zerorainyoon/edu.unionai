import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Target, BookOpen, Star, ArrowRight, ShieldCheck, Gift, Award } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import intelHeaderLogo from '../assets/intel-header-logo.svg';
import pcIntroBg from '../assets/pc-intro-image.avif';
import mobileIntroBg from '../assets/mobile-intro-image.avif';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();


  // Scroll observer logic for dynamic entrance animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleApplyClick = () => {
    showToast('맞춤형 교육 신청 서비스는 현재 준비 중입니다.');
  };

  const selfStartCards = [
    {
      title: 'The BOX 팀빌딩 프로그램',
      category: '팀빌딩',
      desc: '기존 사고의 틀을 이해하고, 보다 확장된 사고로의 변화를 유도합니다.',
      gradient: 'from-blue-650/40 to-indigo-750/70',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&h=560&q=80',
      pastelBg: 'bg-blue-50 text-blue-650 border-blue-100',
    },
    {
      title: 'SDI 업무성향 진단',
      category: '성향 진단',
      desc: '개인의 동기와 강점을 중심으로 갈등 상황까지 다루며, 관계 개선과 협업을 돕습니다.',
      gradient: 'from-amber-600/40 to-red-650/70',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&h=560&q=80',
      pastelBg: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    {
      title: '에니어그램 성격유형 진단',
      category: '성격유형',
      desc: '내 유형의 특성 키워드, 심리적 배경, 삶의 방식 이해 및 성장을 위한 조언을 포함합니다.',
      gradient: 'from-emerald-600/40 to-cyan-650/70',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&h=560&q=80',
      pastelBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'OPIc 대비 과정',
      category: '어학',
      desc: '목표 등급 달성을 위한 맞춤형 학습과 실전 연습을 통해 공인 어학 성적 취득을 지원합니다.',
      gradient: 'from-violet-600/40 to-pink-650/70',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=560&q=80',
      pastelBg: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      title: '원어민 강사 비즈니스 어학 교육',
      category: '비즈니스 어학',
      desc: '실제 업무 상황을 기반으로 영어 커뮤니케이션 역량을 향상시키는 실전형 비즈니스 어학 과정입니다.',
      gradient: 'from-sky-600/40 to-indigo-700/70',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&h=560&q=80',
      pastelBg: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      title: '전문 코치단 면접 코칭',
      category: '면접 코칭',
      desc: '나만의 이야기와 문제해결 경험을 면접에서 무기가 되는 강력한 포트폴리오로 가공합니다.',
      gradient: 'from-rose-600/40 to-red-700/70',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=560&q=80',
      pastelBg: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  const metrics = [
    { label: '누적 교육 수료생', value: '14,280명+', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: '개설 교육과정', value: '320개+', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
    { label: '기업 협력 네트워크', value: '1,850개사', icon: Target, color: 'text-purple-600 bg-purple-50' },
    { label: '평균 취업률', value: '84.6%', icon: Star, color: 'text-amber-500 bg-amber-50' },
  ];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col select-none overflow-x-hidden">

      {/* ==========================================
         Section 1: Immersive Hero Section (#top)
         ========================================== */}
      <section id="top" className="relative overflow-hidden bg-slate-950 pt-42 pb-42 px-4 sm:px-6 lg:px-8 select-none flex items-center justify-center min-h-[340px]">

        {/* Background Responsive AVIF Images (Hard cropped at section border, no fadeout) */}
        <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden="true">
          {/* PC Background (md:block) */}
          <img
            src={pcIntroBg}
            alt="UnionAI PC Background"
            className="hidden md:block w-full h-full object-cover"
          />
          {/* Mobile Background (block md:hidden) */}
          <img
            src={mobileIntroBg}
            alt="UnionAI Mobile Background"
            className="block md:hidden w-full h-full object-cover"
          />
          {/* Flat translucent overlay to ensure white text readability (light 10% opacity) */}
          <div className="absolute inset-0 bg-slate-950/30"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Heading (With white contrast textual styling) */}
          <div className="reveal" style={{ animationDelay: '80ms' }}>
            <h1 className="mx-auto max-w-5xl text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-white flex flex-col items-center gap-2.5">
              <span className="inline-flex items-center justify-center gap-2.5 flex-wrap md:flex-nowrap">
                <img src={intelHeaderLogo} alt="Intel Logo" className="h-6 sm:h-8 md:h-11 w-auto brightness-0 invert object-contain" />
                <span>일하는 방식을 배우는</span>
              </span>
              <span className="block mt-1">
                <span className="relative inline-block">
                  <span className="relative z-10 text-brand-secondary">640시간</span>
                  <span className="absolute inset-x-0 bottom-1.5 z-0 h-3.5 bg-brand-accent/30" aria-hidden="true"></span>
                </span>{' '}
                실무형 IT 인재 양성 캠프
              </span>
            </h1>
          </div>

          {/* Buttons */}
          <div className="reveal relative z-20" style={{ animationDelay: '240ms' }}>
            <div className="mt-10 translate-y-16 flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 bg-brand-secondary hover:bg-brand-primary text-white font-bold text-sm md:text-base tracking-wide shadow-lg hover:shadow-xl active:scale-97 transition-all shrink-0 cursor-pointer"
              >
                지금 지원하기
              </button>
              <a
                href="#belief"
                className="px-6 py-3 border border-slate-550 hover:border-white bg-slate-900/40 hover:bg-slate-900/80 text-slate-200 hover:text-white font-bold text-sm md:text-base tracking-wide transition-all shrink-0"
              >
                프로그램 살펴보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         Section 1.5: Video Showroom (No background images, shifted down)
         ========================================== */}
      <section className="relative bg-[#f8fafc] pt-28 pb-28 px-4 sm:px-6 lg:px-8 select-none z-10">
        <div className="max-w-6xl mx-auto">
          {/* Dynamic Video box with 4-color borders */}
          <div className="reveal" style={{ animationDelay: '320ms' }}>
            <div className="relative mx-auto w-full max-w-4xl">
              <div className="aspect-[16/9] w-full overflow-hidden border border-slate-200/60 bg-slate-950 shadow-2xl">
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                >
                  <source src="https://www.52g.gs/videos/2023_52g.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Bottom 4-color decorative info card (Responsive overlap layout) */}
              <div className="relative md:absolute mt-4 md:mt-0 md:-bottom-8 md:left-4 md:right-4 overflow-hidden bg-white border border-slate-100 shadow-xl">
                <div className="flex h-[4.5px] w-full">
                  <div className="flex-1 bg-brand-secondary"></div>
                  <div className="flex-1 bg-emerald-500"></div>
                  <div className="flex-1 bg-amber-500"></div>
                  <div className="flex-1 bg-rose-500"></div>
                </div>
                <div className="px-4 py-3 text-center">
                  <p className="text-xs md:text-sm font-semibold tracking-wide text-slate-700">
                    UnionAI는 오픈 이노베이션 기술 인재 양성을 리드합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         Section 2: Belief Statement (#belief)
         ========================================== */}
      <section id="belief" className="relative bg-white py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal-on-scroll space-y-6">
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
              우리는 사람의 가능성이<br />
              <span className="text-emerald-600">실전 경험</span> 속에서 발견된다고 믿습니다.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-650 sm:text-base font-medium">
              UnionAI ReBoot Camp는 정답을 주입식으로 알려주는 교육 과정이 아닌,<br />
              직접 비즈니스 문제를 해결하고, 팀원들과 함께 피드백하며 결과를 도출하는<br />
              자기주도적 경험 중심의 학습 시스템으로 설계되었습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
         Section 3: Distinct Experience (#our-way)
         ========================================== */}
      <section id="our-way" className="bg-slate-50 py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          {/* Main Title Section */}
          <div className="reveal-on-scroll text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
              그래서 <span className="text-brand-secondary">우리의 교육</span>은<br />
              일반적인 부트캠프와 다릅니다.
            </h2>
          </div>

          {/* Key Experience 1 */}
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16 mb-24">
            {/* Visual Box (Reveal Left) */}
            <div className="reveal-on-scroll left">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-[420px] bg-emerald-50 border border-emerald-100 shadow-sm p-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
                <div className="relative h-full w-full flex flex-col justify-end p-6 select-none bg-slate-900 text-white border border-slate-800">
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 space-y-2">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider">
                      Experience 01
                    </span>
                    <h4 className="text-base md:text-lg font-bold">비즈니스 현장 프로젝트 훈련</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">대기업 협력 프로젝트 및 신기술 개발 업무환경 이해</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Context Box (Reveal delay) */}
            <div className="reveal-on-scroll space-y-4 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">FIELD PERSPECTIVE</span>
              <h3 className="text-lg md:text-xl font-bold leading-snug tracking-tight text-slate-900">현업 중심의 업무 관점 학습</h3>
              <p className="text-sm leading-relaxed text-slate-650 font-medium">
                단순 개발 언어의 숙련을 넘어 대기업·중견기업 비즈니스 과제를 분석합니다.<br />
                실제 현업 멘토진과의 정기 오피스아워 세션을 통해, 업무에 필요한 기획력과 설계 구조를 직접 익힙니다.
              </p>
            </div>
          </div>

          {/* Key Experience 2 */}
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16 mb-24">
            {/* Visual Box (Reveal Left) */}
            <div className="reveal-on-scroll left md:order-2">
              <div className="relative mx-auto aspect-square w-full max-w-[340px] bg-amber-50 rounded-full border border-amber-100 shadow-sm p-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent"></div>
                <div className="relative h-full w-full rounded-full flex items-center justify-center select-none bg-slate-950 text-white border border-slate-900 p-6 text-center">
                  <div className="absolute inset-0 bg-black/40 rounded-full"></div>
                  <div className="relative z-10 space-y-2">
                    <span className="px-2 py-0.5 bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider">
                      Experience 02
                    </span>
                    <h4 className="text-base font-bold">AX Playground</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">코딩 프리 생성형 AI 업무 툴 설계</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Context Box */}
            <div className="reveal-on-scroll space-y-4 text-center md:text-left md:order-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">DIGITAL TRANSFORMATION</span>
              <h3 className="text-lg md:text-xl font-bold leading-snug tracking-tight text-slate-900">AX (AI Transformation) 실전 실험</h3>
              <p className="text-sm leading-relaxed text-slate-650 font-medium">
                어려운 코딩 지식이 없어도 문제해결에 집중할 수 있도록 돕습니다.<br />
                다양한 API 자동화 도구 및 생성형 AI 인프라를 활용하여 실무 혁신 앱 프로토타입을 신속하게 제작하고 배포하는 실행 문화를 체득합니다.
              </p>
            </div>
          </div>

          {/* Key Experience 3 */}
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            {/* Visual Box (Reveal Left) */}
            <div className="reveal-on-scroll left">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-[420px] bg-blue-50 border border-blue-100 shadow-sm p-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
                <div className="relative h-full w-full flex flex-col justify-end p-6 select-none bg-slate-900 text-white border border-slate-800">
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 space-y-2">
                    <span className="px-2 py-0.5 bg-blue-500 text-white font-extrabold text-[10px] uppercase tracking-wider">
                      Experience 03
                    </span>
                    <h4 className="text-base md:text-lg font-bold">대기업 실무 피드백</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">현업 시니어 멘토단의 산출물 밀착 크리틱</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Context Box */}
            <div className="reveal-on-scroll space-y-4 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">DATA DRIVEN DECISION</span>
              <h3 className="text-lg md:text-xl font-bold leading-snug tracking-tight text-slate-900">대기업 멘토단의 1:1 피드백</h3>
              <p className="text-sm leading-relaxed text-slate-650 font-medium">
                일반 강사의 단순 소스 코드 리뷰를 넘어섭니다.<br />
                IT 시니어 및 현업 PM들로 구성된 전문 위원진이 포트폴리오를 기업 눈높이에 맞게 밀도 높은 피드백으로 완성시켜 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         Section 4: AI & Apps (#ai-result)
         ========================================== */}
      <section id="ai-result" className="bg-white py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="reveal-on-scroll text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary">KEY EXPERIENCE</span>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900 mt-3">
              AI를 활용해 결과를 만듭니다
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mt-4">
              AI는 이론이 아닙니다. 복잡한 코딩 지식을 넘는 가장 강력한 무기입니다.<br />
              오픈 API와 AI Playground를 통해 업무 효율을 10배 높이는 애플리케이션을 완성해 봅니다.
            </p>
          </div>

          <div className="grid items-stretch gap-8 lg:grid-cols-[1.8fr_1fr] lg:gap-12">
            {/* Video Box (Reveal Left) */}
            <div className="reveal-on-scroll left lg:h-full">
              <div className="relative aspect-video w-full overflow-hidden border border-slate-200 bg-slate-950 shadow-lg lg:aspect-auto lg:h-full lg:min-h-[300px]">
                <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto">
                  <source src="https://www.52g.gs/videos/origin_miso-introduction.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Stage Steps List (Reveal right) */}
            <div className="flex flex-col justify-between gap-4 lg:h-full">
              <div className="reveal-on-scroll">
                <article className="border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-500 font-extrabold text-[10px] px-2.5 py-0.5">Step 01</span>
                    <span className="text-xl font-bold text-brand-secondary">문제 정의</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">디자인씽킹 프로세스</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                    현업 비즈니스 이슈를 다각적으로 관찰하고, 해결할 수 있는 진짜 문제를 식별합니다.
                  </p>
                </article>
              </div>

              <div className="reveal-on-scroll">
                <article className="border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-500 font-extrabold text-[10px] px-2.5 py-0.5">Step 02</span>
                    <span className="text-xl font-bold text-brand-secondary">해결안 도출</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">노코드 AI 에이전트 설계</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                    다양한 AI 모델을 엮어 반복적인 수작업 업무를 자동화하는 로직을 구상합니다.
                  </p>
                </article>
              </div>

              <div className="reveal-on-scroll">
                <article className="border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-500 font-extrabold text-[10px] px-2.5 py-0.5">Step 03</span>
                    <span className="text-xl font-bold text-brand-secondary">검증 완료</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">PBL 실무 프로젝트 출품</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                    사용성 높은 프로토타입을 배포하여 실제 해결 성과를 입증하는 완성품을 갖춥니다.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         Section 4.5: Self-Start Carousel Section (#self-start)
         ========================================== */}
      <section id="self-start" className="bg-white py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto relative">

          {/* Header */}
          <div className="reveal-on-scroll flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary">SELF START</span>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
                다시 시작할 수 있는 힘을 만듭니다
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                취업 준비보다 먼저 필요한 것은 다시 도전할 자신감입니다. 자기인식·어학·면접 코칭으로 나의 강점을 발견하고 새로운 시작을 준비합니다.
              </p>
            </div>
          </div>

          {/* Infinite Marquee Area (2 identical sets for seamless looping with edge vignetting mask) */}
          <div className="reveal-on-scroll relative w-full overflow-hidden select-none marquee-mask">

            {/* Scrolling track container */}
            <div className="hover-pause flex gap-6 w-full overflow-hidden py-3">
              {/* Set 1 */}
              <div className="flex gap-6 animate-marquee shrink-0">
                {selfStartCards.map((card, idx) => (
                  <div
                    key={`set1-${idx}`}
                    className="w-[250px] sm:w-[280px] h-[400px] shrink-0 bg-white border border-slate-200 overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300"
                  >
                    {/* Top Visual Area (Clean image with subtle hover contrast overlay) */}
                    <div className="relative h-56 w-full overflow-hidden text-white">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-300 z-5"></div>
                    </div>

                    {/* Bottom Text Area (Combined inside the card frame) */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Pastel category badge inside text zone */}
                        <span className={`inline-block px-2.5 py-0.5 border text-[10px] md:text-xs font-bold rounded-sm tracking-wide mb-3 ${card.pastelBg}`}>
                          {card.category}
                        </span>

                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-secondary transition-colors whitespace-normal">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium mt-2 whitespace-normal">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Set 2 (Duplicate for Seamless Loop) */}
              <div className="flex gap-6 animate-marquee shrink-0" aria-hidden="true">
                {selfStartCards.map((card, idx) => (
                  <div
                    key={`set2-${idx}`}
                    className="w-[250px] sm:w-[280px] h-[400px] shrink-0 bg-white border border-slate-200 overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300"
                  >
                    {/* Top Visual Area (Clean image with subtle hover contrast overlay) */}
                    <div className="relative h-56 w-full overflow-hidden text-white">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-300 z-5"></div>
                    </div>

                    {/* Bottom Text Area */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Pastel category badge inside text zone */}
                        <span className={`inline-block px-2.5 py-0.5 border text-[10px] md:text-xs font-bold rounded-sm tracking-wide mb-3 ${card.pastelBg}`}>
                          {card.category}
                        </span>

                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-secondary transition-colors whitespace-normal">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium mt-2 whitespace-normal">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
         Section 5: Program Benefits (#benefits)
         ========================================== */}
      <section id="benefits" className="bg-slate-50 py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="reveal-on-scroll text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary">BENEFITS</span>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900 mt-3">
              참여 혜택
            </h2>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">
              오직 성장에만 완전 몰입하여 실력을 높일 수 있도록, 아낌없이 전폭 지원합니다.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="reveal-on-scroll">
              <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between h-full hover:shadow-sm transition-all duration-300">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 text-blue-600 w-fit">
                    <Award size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">교육비 전액 국가 지원 (0원)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    수백만 원 상당의 AI 직무 부트캠프 수강료를 고용노동부 국민내일배움카드를 통해 전액 100% 무료 지원합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal-on-scroll">
              <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between h-full hover:shadow-sm transition-all duration-300">
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 text-amber-600 w-fit">
                    <Gift size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">매월 정기 훈련수당 지급</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    매일 성실하게 훈련 과정에 참가하는 수강생분들에게 매달 일정 금액의 교통비 및 훈련 장려 장수당을 직접 지급합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal-on-scroll">
              <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between h-full hover:shadow-sm transition-all duration-300">
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 w-fit">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">1:1 맞춤형 진로 추천</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    커리어 전담 매니저가 직접 이력서 첨삭, 맞춤형 가상 면접 피드백, 상공회의소 회원사 특화 추천 채용 기회를 연계합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="bg-white py-16 px-4 border-t border-b border-slate-100 select-none">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-150 overflow-hidden">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="p-6 flex flex-col items-center text-center">
                  <div className={`p-3 ${m.color} mb-3`}>
                    <Icon size={20} className="stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-slate-450 tracking-wider mb-1">{m.label}</span>
                  <span className="text-lg font-extrabold text-slate-900">{m.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Corporate Customized Training Banner */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-slate-900 to-brand-primary-dark text-white p-8 md:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-secondary/10 blur-3xl -z-1"></div>

          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <h3 className="text-xl md:text-2xl font-bold leading-snug">
              우리 기업의 디지털 혁신을 위한<br />
              맞춤형 직무 교육을 설계해 드립니다.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              신기술 도입부터 재직자 리스킬링 교육까지, 기업 전용 특화 교육을 대한상공회의소 교육 기획 전문가가 직접 맞춤 설계하고 대행해 드립니다.
            </p>
          </div>

          <button
            onClick={handleApplyClick}
            className="bg-brand-secondary text-white hover:bg-brand-accent font-bold text-sm tracking-wider px-6 py-3.5 shadow-lg flex items-center gap-2 group transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shrink-0 cursor-pointer"
          >
            기업 맞춤형 교육 문의
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
export default Home;
