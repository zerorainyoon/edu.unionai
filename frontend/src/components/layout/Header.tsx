import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, PlusCircle, ClipboardList, ChevronDown, Settings, HelpCircle, FileText, Search } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';
import intelHeaderLogo from '../../assets/intel-header-logo.svg';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Prevent background scrolling on mobile drawer toggles
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 2. Close mobile drawer on routing shifts
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogoutClick = () => {
    logout();
    setIsOpen(false);
    navigate('/');
    showToast('로그아웃되었습니다.');
  };

  // Nav metadata configurations
  const navItems = [
    { name: '교육 과정', path: '/courses' },
  ];

  const boardMenuItems: MenuItem[] = [
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
    { name: '게시판', path: '/board', icon: FileText },
    // { name: '1:1 문의', path: '/inquiry', icon: MessageSquare },
  ];

  const adminMenuItems: MenuItem[] = [
    { name: '교육과정 등록', path: '/admin/register-course', icon: PlusCircle },
    { name: '교육과정 관리', path: '/admin/courses', icon: Settings },
    { name: '수강 신청 현황', path: '/admin/registrations', icon: ClipboardList },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm w-full select-none">
      {/* Main Navbar container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-8 h-full">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={intelHeaderLogo} alt="Intel Logo" className="h-7 md:h-7 w-auto" />
          </Link>

          {/* PC Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-base transition-all duration-200 hover:bg-slate-50 ${isActive
                    ? 'text-brand-secondary bg-brand-accent-light/50'
                    : 'text-slate-700 hover:text-brand-secondary'
                  }`
                }
              >
                {item.name}
                {location.pathname.startsWith(item.path) && (
                  <span className="absolute bottom-[-16px] left-4 right-4 h-0.75 bg-brand-secondary rounded-full"></span>
                )}
              </NavLink>
            ))}

            {/* PC: Board Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setBoardOpen(true)}
              onMouseLeave={() => setBoardOpen(false)}
            >
              <button className="px-4 py-2 text-base text-slate-700 hover:text-brand-secondary hover:bg-slate-50 transition-all duration-200 flex items-center gap-1 cursor-pointer">
                게시판 <ChevronDown size={14} className={`opacity-60 transition-transform duration-200 ${boardOpen ? 'rotate-180 text-brand-secondary' : ''}`} />
              </button>
              {boardOpen && (
                <div className="absolute top-[80%] left-1/2 w-48 bg-white border border-slate-200 shadow-xl py-2.5 z-50 animate-slide-down select-none">
                  {boardMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setBoardOpen(false)}
                        className="w-full text-left px-4.5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Icon size={15} className="text-slate-400" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* PC: Admin Dropdown */}
            {user?.is_admin && (
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setAdminOpen(true)}
                onMouseLeave={() => setAdminOpen(false)}
              >
                <button className="px-4 py-2 text-base text-slate-700 hover:text-brand-secondary hover:bg-slate-50 transition-all duration-200 flex items-center gap-1 cursor-pointer">
                  관리자 <ChevronDown size={14} className={`opacity-60 transition-transform duration-200 ${adminOpen ? 'rotate-180 text-brand-secondary' : ''}`} />
                </button>
                {adminOpen && (
                  <div className="absolute top-[80%] left-1/2 w-48 bg-white border border-slate-200 shadow-xl py-2.5 z-50 animate-slide-down select-none">
                    {adminMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setAdminOpen(false)}
                          className="w-full text-left px-4.5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-secondary transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Icon size={15} className="text-slate-400" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PC Search box */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 focus-within:bg-white focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-accent-light/50 transition-all w-48 lg:w-128 ml-4">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="교육과정 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-md text-slate-700 w-full placeholder-slate-400"
              />
            </form>
          </nav>
        </div>

        {/* PC Right: Auth / Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 text-base">
                <User size={16} className="text-slate-400" />
                {user.full_name || user.email}
                <span className={`ml-1 text-xs px-2 py-0.5 font-black ${user.is_admin ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                  {user.is_admin ? '관리자' : '일반'}
                </span>
              </span>
              <span className="text-slate-300">|</span>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 text-base font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-base font-semibold text-slate-700 hover:text-brand-secondary hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                로그인
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:text-brand-primary p-2 focus:outline-none select-none w-11 h-11 flex items-center justify-center hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white border-b border-slate-200 shadow-xl font-medium overflow-y-auto max-h-[calc(100vh-4rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-2 pb-6 space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-semibold transition-colors ${isActive
                      ? 'text-brand-secondary bg-brand-accent-light'
                      : 'text-slate-700 hover:text-brand-secondary hover:bg-slate-50'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Board sections */}
              <div className="border-t border-slate-100 pt-3 mt-3 space-y-1 select-none">
                <span className="block px-4 py-1 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  게시판
                </span>
                {boardMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left block px-4 py-2.5 text-base font-semibold text-slate-700 hover:text-brand-secondary hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Icon size={18} className="text-slate-400" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Admin sections */}
              {user?.is_admin && (
                <div className="border-t border-slate-100 pt-3 mt-3 space-y-1 select-none">
                  <span className="block px-4 py-1 text-xs font-bold text-slate-450 uppercase tracking-wider">
                    관리자 메뉴
                  </span>
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="w-full text-left block px-4 py-2.5 text-base font-semibold text-slate-700 hover:text-brand-secondary hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Icon size={18} className="text-slate-400" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Mobile Auth actions */}
              <div className="border-t border-slate-100 pt-4 mt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <User size={16} />
                        {user.full_name || user.email}
                      </span>
                      <span className={`text-xs px-2 py-0.5 font-bold ${user.is_admin ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                        {user.is_admin ? '관리자' : '일반'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-center py-2 text-sm font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-center py-2 text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    로그인
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
