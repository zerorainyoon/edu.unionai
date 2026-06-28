import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogIn, ExternalLink, GraduationCap, PlusCircle, ClipboardList, ChevronDown, Settings, HelpCircle, MessageSquare, FileText } from 'lucide-react';
import { useToast } from '../ui/Toast';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();
  const location = useLocation();

  const handlePlaceholderClick = (e: React.MouseEvent, menuName: string) => {
    e.preventDefault();
    showToast(`'${menuName}' 서비스는 현재 준비 중입니다.`);
    setIsOpen(false);
  };

  const navItems = [
    { name: 'WORK.AI', path: '/', isPlaceholder: false },
    { name: '교육 과정', path: '/courses', isPlaceholder: false },
    // { name: '맞춤형교육신청', path: '/custom-training', isPlaceholder: true },
    // { name: '고객센터', path: '/support', isPlaceholder: true },
    // { name: '나의 강의실', path: '/classroom', isPlaceholder: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm w-full select-none">
      {/* Top Utility Bar (Desktop Only) */}
      <div className="hidden md:flex border-b border-slate-100 bg-slate-50 text-xs text-slate-500 py-2.5 px-6 justify-between items-center w-full">
        <div className="flex gap-4">
          <a
            href="https://www.korcham.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            대한상공회의소 바로가기
            <ExternalLink size={10} />
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => handlePlaceholderClick(e, '로그인')}
            className="hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <LogIn size={11} />
            로그인
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={(e) => handlePlaceholderClick(e, '회원가입')}
            className="hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <User size={11} />
            회원가입
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-primary text-white p-2 rounded-xl group-hover:bg-brand-secondary transition-colors duration-200">
              <GraduationCap size={24} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-brand-primary tracking-tight leading-none">
                WORK.AI
              </span>
              <span className="text-xs font-bold text-slate-400 mt-0.5 tracking-wider">
                대한상공회의소
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 h-full">
          {navItems.map((item) => (
            item.isPlaceholder ? (
              <a
                key={item.name}
                href="#"
                onClick={(e) => handlePlaceholderClick(e, item.name)}
                className="px-4 py-2 text-lg font-bold text-slate-600 hover:text-brand-secondary rounded-lg hover:bg-slate-50 transition-all duration-200"
              >
                {item.name}
              </a>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-lg font-bold transition-all duration-200 rounded-lg hover:bg-slate-50 ${isActive
                    ? 'text-brand-secondary bg-brand-accent-light/50'
                    : 'text-slate-700 hover:text-brand-secondary'
                  }`
                }
              >
                {item.name}
                {((item.path === '/' && location.pathname === '/') || (item.path !== '/' && location.pathname.startsWith(item.path))) && (
                  <span className="absolute bottom-[-16px] left-4 right-4 h-0.75 bg-brand-secondary rounded-full"></span>
                )}
              </NavLink>
            )
          ))}

          {/* Board Hover Dropdown Menu */}
          <div className="relative group h-full flex items-center">
            <button className="px-4 py-2 text-lg font-bold text-slate-700 hover:text-brand-secondary rounded-lg hover:bg-slate-50 transition-all duration-200 flex items-center gap-1 cursor-pointer">
              게시판 <ChevronDown size={14} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2.5 z-50 animate-fade-in select-none">
              <button
                onClick={(e) => handlePlaceholderClick(e, 'FAQ')}
                className="w-full text-left px-4.5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
              >
                <HelpCircle size={15} className="text-slate-400" />
                FAQ
              </button>
              <button
                onClick={(e) => handlePlaceholderClick(e, '게시판')}
                className="w-full text-left px-4.5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
              >
                <FileText size={15} className="text-slate-400" />
                게시판
              </button>
              <button
                onClick={(e) => handlePlaceholderClick(e, '1:1 문의')}
                className="w-full text-left px-4.5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
              >
                <MessageSquare size={15} className="text-slate-400" />
                1:1 문의
              </button>
            </div>
          </div>

          {/* Admin Hover Dropdown Menu */}
          <div className="relative group h-full flex items-center">
            <button className="px-4 py-2 text-lg font-bold text-slate-700 hover:text-brand-secondary rounded-lg hover:bg-slate-50 transition-all duration-200 flex items-center gap-1 cursor-pointer">
              관리자 <ChevronDown size={14} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2.5 z-50 animate-fade-in select-none">
              <Link
                to="/admin/register-course"
                className="w-full text-left px-4.5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle size={15} className="text-slate-400" />
                교육과정 등록
              </Link>
              <Link
                to="/admin/courses"
                className="w-full text-left px-4.5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Settings size={15} className="text-slate-400" />
                교육과정 관리
              </Link>
              <Link
                to="/admin/registrations"
                className="w-full text-left px-4.5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ClipboardList size={15} className="text-slate-400" />
                수강 신청 현황
              </Link>
            </div>
          </div>
        </nav>

        {/* Action Button (Desktop Only) */}
        <div className="hidden md:block">
          {/* <button
            onClick={(e) => handlePlaceholderClick(e, '맞춤형 상담 신청')}
            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm tracking-wider px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95"
          >
            상담 및 신청하기
          </button> */}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:text-brand-primary p-2 focus:outline-none select-none w-11 h-11 flex items-center justify-center rounded-lg hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-inner animate-fade-in font-medium">
          <div className="px-4 pt-2 pb-6 space-y-1.5">
            {navItems.map((item) => (
              item.isPlaceholder ? (
                <a
                  key={item.name}
                  href="#"
                  onClick={(e) => handlePlaceholderClick(e, item.name)}
                  className="block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-lg font-semibold rounded-xl transition-colors ${isActive
                      ? 'text-brand-secondary bg-brand-accent-light'
                      : 'text-slate-700 hover:text-brand-secondary hover:bg-slate-50'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              )
            ))}

            {/* Mobile Board menu */}
            <div className="border-t border-slate-100 pt-3 mt-3 space-y-1 select-none">
              <span className="block px-4 py-1 text-xs font-black text-slate-400 uppercase tracking-wider">
                게시판
              </span>
              <button
                onClick={(e) => handlePlaceholderClick(e, 'FAQ')}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
              >
                <HelpCircle size={18} className="text-slate-400" />
                FAQ
              </button>
              <button
                onClick={(e) => handlePlaceholderClick(e, '게시판')}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
              >
                <FileText size={18} className="text-slate-400" />
                게시판
              </button>
              <button
                onClick={(e) => handlePlaceholderClick(e, '1:1 문의')}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
              >
                <MessageSquare size={18} className="text-slate-400" />
                1:1 문의
              </button>
            </div>

            {/* Mobile Admin menu */}
            <div className="border-t border-slate-100 pt-3 mt-3 space-y-1 select-none">
              <span className="block px-4 py-1 text-xs font-black text-slate-400 uppercase tracking-wider">
                관리자 메뉴
              </span>
              <Link
                to="/admin/register-course"
                onClick={() => setIsOpen(false)}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle size={18} className="text-slate-400" />
                교육과정 등록
              </Link>
              <Link
                to="/admin/courses"
                onClick={() => setIsOpen(false)}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Settings size={18} className="text-slate-400" />
                교육과정 관리
              </Link>
              <Link
                to="/admin/registrations"
                onClick={() => setIsOpen(false)}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ClipboardList size={18} className="text-slate-400" />
                수강 신청 현황
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex flex-col gap-2">
              <button
                onClick={(e) => handlePlaceholderClick(e, '로그인')}
                className="w-full text-center py-2.5 rounded-xl text-base font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50"
              >
                로그인
              </button>
              <button
                onClick={(e) => handlePlaceholderClick(e, '맞춤형 상담 신청')}
                className="w-full text-center py-2.5 rounded-xl text-base font-semibold text-white bg-brand-primary hover:bg-brand-secondary shadow-sm"
              >
                상담 및 신청하기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
