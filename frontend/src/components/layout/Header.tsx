import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, GraduationCap, PlusCircle, ClipboardList, ChevronDown, Settings, HelpCircle, MessageSquare, FileText, ShieldAlert, Search } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';
import intelHeaderLogo from '../../assets/intel-header-logo.svg';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, signup, logout } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handlePlaceholderClick = (e: React.MouseEvent, menuName: string) => {
    e.preventDefault();
    showToast(`'${menuName}' 서비스는 현재 준비 중입니다.`);
    setIsOpen(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      if (authMode === 'login') {
        await login(email.trim(), password.trim());
        showToast('성공적으로 로그인되었습니다.');
        setIsAuthModalOpen(false);
      } else {
        if (!fullName.trim()) {
          showToast('이름을 입력해주세요.');
          return;
        }
        await signup(email.trim(), password.trim(), fullName.trim(), isAdmin);
        showToast('회원가입이 완료되었습니다. 로그인해주세요.');
        setAuthMode('login');
      }
      // Reset inputs
      setEmail('');
      setPassword('');
      setFullName('');
      setIsAdmin(false);
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail || '요청 처리에 실패했습니다.';
      showToast(detail);
    }
  };

  const navItems = [
    { name: '교육 과정', path: '/courses', isPlaceholder: false },
    // { name: '맞춤형교육신청', path: '/custom-training', isPlaceholder: true },
    // { name: '고객센터', path: '/support', isPlaceholder: true },
    // { name: '나의 강의실', path: '/classroom', isPlaceholder: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm w-full select-none">
      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-8 h-full">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={intelHeaderLogo} alt="UnionAI Logo" className="h-7 md:h-7 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 h-full">
            {navItems.map((item) => (
              item.isPlaceholder ? (
                <a
                  key={item.name}
                  href="#"
                  onClick={(e) => handlePlaceholderClick(e, item.name)}
                  className="px-4 py-2 text-base text-slate-600 hover:text-brand-secondary rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  {item.name}
                </a>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-base transition-all duration-200 rounded-lg hover:bg-slate-50 ${isActive
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
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setBoardOpen(true)}
              onMouseLeave={() => setBoardOpen(false)}
            >
              <button className="px-4 py-2 text-base text-slate-700 hover:text-brand-secondary rounded-lg hover:bg-slate-50 transition-all duration-200 flex items-center gap-1 cursor-pointer">
                게시판 <ChevronDown size={14} className={`opacity-60 transition-transform duration-200 ${boardOpen ? 'rotate-180 text-brand-secondary' : ''}`} />
              </button>
              {boardOpen && (
                <div className="absolute top-[80%] left-1/2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2.5 z-50 animate-slide-down select-none">
                  <Link
                    to="/faq"
                    onClick={() => setBoardOpen(false)}
                    className="w-full text-left px-4.5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle size={15} className="text-slate-400" />
                    FAQ
                  </Link>
                  <Link
                    to="/board"
                    onClick={() => setBoardOpen(false)}
                    className="w-full text-left px-4.5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FileText size={15} className="text-slate-400" />
                    게시판
                  </Link>
                  <Link
                    to="/inquiry"
                    onClick={() => setBoardOpen(false)}
                    className="w-full text-left px-4.5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare size={15} className="text-slate-400" />
                    1:1 문의
                  </Link>
                </div>
              )}
            </div>

            {/* Admin Hover Dropdown Menu */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setAdminOpen(true)}
              onMouseLeave={() => setAdminOpen(false)}
            >
              <button className="px-4 py-2 text-base text-slate-700 hover:text-brand-secondary rounded-lg hover:bg-slate-50 transition-all duration-200 flex items-center gap-1 cursor-pointer">
                관리자 <ChevronDown size={14} className={`opacity-60 transition-transform duration-200 ${adminOpen ? 'rotate-180 text-brand-secondary' : ''}`} />
              </button>
              {adminOpen && (
                <div className="absolute top-[80%] left-1/2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2.5 z-50 animate-slide-down select-none">
                  <Link
                    to="/admin/register-course"
                    onClick={() => setAdminOpen(false)}
                    className="w-full text-left px-4.5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle size={15} className="text-slate-400" />
                    교육과정 등록
                  </Link>
                  <Link
                    to="/admin/courses"
                    onClick={() => setAdminOpen(false)}
                    className="w-full text-left px-4.5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Settings size={15} className="text-slate-400" />
                    교육과정 관리
                  </Link>
                  <Link
                    to="/admin/registrations"
                    onClick={() => setAdminOpen(false)}
                    className="w-full text-left px-4.5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ClipboardList size={15} className="text-slate-400" />
                    수강 신청 현황
                  </Link>
                </div>
              )}
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-accent-light/50 transition-all w-48 lg:w-128 ml-4">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="교육과정 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-md font-semibold text-slate-700 w-full placeholder-slate-400"
              />
            </form>
          </nav>
        </div>

        {/* Right Side: Auth / Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 text-base">
                <User size={16} className="text-slate-400" />
                {user.full_name || user.email}
                <span className={`ml-1 text-xs px-2 py-0.5 rounded font-black ${user.is_admin ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                  {user.is_admin ? '관리자' : '일반'}
                </span>
              </span>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => {
                  logout();
                  showToast('로그아웃되었습니다.');
                }}
                className="px-4 py-2 text-base font-semibold text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all duration-200 cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 text-base font-semibold text-slate-700 hover:text-brand-secondary rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                로그인
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-4.5 py-2 text-base font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-xl transition-all duration-200 shadow-sm hover:shadow cursor-pointer active:scale-95"
              >
                회원가입
              </button>
            </div>
          )}
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
              <Link
                to="/faq"
                onClick={() => setIsOpen(false)}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle size={18} className="text-slate-400" />
                FAQ
              </Link>
              <Link
                to="/board"
                onClick={() => setIsOpen(false)}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText size={18} className="text-slate-400" />
                게시판
              </Link>
              <Link
                to="/inquiry"
                onClick={() => setIsOpen(false)}
                className="w-full text-left block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-brand-secondary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare size={18} className="text-slate-400" />
                1:1 문의
              </Link>
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
              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <User size={16} />
                      {user.full_name || user.email}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-black ${user.is_admin ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                      {user.is_admin ? '관리자' : '일반'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      showToast('로그아웃되었습니다.');
                    }}
                    className="w-full text-center py-2.5 rounded-xl text-base font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full text-center py-2.5 rounded-xl text-base font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setAuthMode('signup');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full text-center py-2.5 rounded-xl text-base font-semibold text-brand-secondary border border-brand-secondary/30 hover:bg-brand-accent-light/30 cursor-pointer"
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Glassmorphic Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in select-text">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-800 p-1 transition-colors cursor-pointer select-none"
              type="button"
            >
              <X size={20} />
            </button>

            {/* Modal Title Banner */}
            <div className="bg-slate-900 text-white p-6 pt-8">
              <h2 className="text-xl font-black flex items-center gap-2">
                <GraduationCap className="text-brand-accent-light" size={24} />
                {authMode === 'login' ? 'UnionAI 로그인' : 'UnionAI 회원가입'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {authMode === 'login'
                  ? '계정에 로그인하고 교육생들과 학습 정보를 공유해 보세요.'
                  : 'UnionAI 통합 커뮤니티의 일원이 되어 보세요.'}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">이름 (실명) *</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-semibold"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">이메일 주소 *</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">비밀번호 *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-semibold"
                  required
                />
              </div>

              {authMode === 'signup' && (
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-amber-600" />
                    <span className="text-xs font-black text-slate-700">관리자 계정으로 등록</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-brand-secondary hover:bg-brand-primary text-white rounded-xl font-black text-xs tracking-widest shadow-md hover:shadow active:scale-95 transition-all duration-200 mt-2 cursor-pointer"
              >
                {authMode === 'login' ? '로그인 완료' : '회원 가입 완료'}
              </button>

              {/* Mode switch helper */}
              <div className="pt-3 border-t border-slate-100 text-center select-none">
                <span className="text-slate-400 text-xxs font-bold">
                  {authMode === 'login' ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
                </span>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-brand-secondary hover:text-brand-primary text-xxs font-black underline cursor-pointer ml-1"
                >
                  {authMode === 'login' ? '회원가입 하기' : '로그인 하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
