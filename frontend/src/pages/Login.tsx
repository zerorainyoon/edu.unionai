import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, ShieldAlert } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { showToast } = useToast();
  const { login, signup } = useAuth();
  const navigate = useNavigate();

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
        navigate('/');
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

  return (
    <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12 sm:py-20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Card */}
        <div className="bg-white border border-slate-200 shadow-2xl overflow-hidden">
          {/* Title Banner */}
          <div className="bg-slate-900 text-white p-6 pt-8">
            <h1 className="text-xl font-black flex items-center gap-2">
              <GraduationCap className="text-brand-accent-light" size={24} />
              {authMode === 'login' ? '관리자 로그인' : 'UnionAI 회원가입'}
            </h1>
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-semibold"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-semibold"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-semibold"
                required
              />
            </div>

            {authMode === 'signup' && (
              <div className="bg-amber-50/50 border border-amber-200/60 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-amber-600" />
                  <span className="text-xs font-black text-slate-700">관리자 계정으로 등록</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-4 h-4 text-brand-primary focus:ring-brand-primary cursor-pointer"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-secondary hover:bg-brand-primary text-white font-black text-xs tracking-widest shadow-md hover:shadow active:scale-95 transition-all duration-200 mt-2 cursor-pointer"
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
    </div>
  );
};
