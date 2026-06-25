import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface CourseRegistrationProps {
  courseTitle: string;
  onSubmit: (data: { email: string; name: string; phone: string }) => void;
  onCancel: () => void;
}

export const CourseRegistration: React.FC<CourseRegistrationProps> = ({
  courseTitle,
  onSubmit,
  onCancel,
}) => {
  // const [showPassword, setShowPassword] = useState(false);
  // const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    // password: '',
    // passwordConfirm: '',
    name: '',
    phone: '',
    agreeAll: false,
    agreeTerms: false,
    agreePrivacy: false,
  });

  // Validation rules
  // const criteria = {
  //   hasUppercase: /[A-Z]/.test(formData.password),
  //   hasLowercase: /[a-z]/.test(formData.password),
  //   hasDigit: /[0-9]/.test(formData.password),
  //   hasSpecial: /[^A-Za-z0-9]/.test(formData.password),
  //   isMinLength: formData.password.length >= 8,
  // };

  // const isPasswordValid = Object.values(criteria).every(Boolean);
  // const isPasswordMatch = formData.password === formData.passwordConfirm && formData.passwordConfirm !== '';
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = /^\d{9,11}$/.test(formData.phone.replace(/[^0-9]/g, ''));

  const isFormValid =
    isEmailValid &&
    // isPasswordValid &&
    // isPasswordMatch &&
    formData.name.trim().length > 0 &&
    isPhoneValid &&
    formData.agreeTerms &&
    formData.agreePrivacy;

  const handleAgreeAllChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeAll: checked,
      agreeTerms: checked,
      agreePrivacy: checked,
    }));
  };

  const handleTermChange = (field: 'agreeTerms' | 'agreePrivacy', checked: boolean) => {
    setFormData(prev => {
      const nextData = { ...prev, [field]: checked };
      nextData.agreeAll = nextData.agreeTerms && nextData.agreePrivacy;
      return nextData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 mb-8 animate-fade-in text-slate-800 select-text">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">지원서 작성</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-2xl">
            [{courseTitle}] 과정의 원활한 접수 및 상세 상담을 위해 아래 정보를 정확히 입력해 주세요.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-base font-bold text-slate-400 hover:text-brand-secondary transition-colors flex items-center gap-1.5 cursor-pointer select-none shrink-0"
        >
          <ArrowLeft size={16} /> 취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-slate-700 flex items-center select-none">
            이메일 주소<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="이메일을 입력해 주세요."
            className={`w-full px-5 py-3.5 rounded-xl border text-base font-semibold focus:outline-none transition-all ${formData.email === ''
              ? 'border-slate-200 focus:border-brand-primary'
              : isEmailValid
                ? 'border-slate-200 focus:border-emerald-500'
                : 'border-rose-300 focus:border-rose-500 bg-rose-50/10'
              }`}
          />
          {!isEmailValid && formData.email !== '' && (
            <p className="text-sm text-rose-500 font-semibold mt-1">올바른 이메일 형식을 입력해 주세요.</p>
          )}
        </div>

        {/* Password Field */}
        {/* <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-slate-700 select-none">
            비밀번호<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="비밀번호를 입력해 주세요."
              className="w-full px-5 py-3.5 pr-12 rounded-xl border border-slate-200 text-base font-semibold focus:outline-none focus:border-brand-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors select-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-1 select-none">
            {[
              { label: '영문 대문자', met: criteria.hasUppercase },
              { label: '영문 소문자', met: criteria.hasLowercase },
              { label: '숫자', met: criteria.hasDigit },
              { label: '특수문자', met: criteria.hasSpecial },
              { label: '8자 이상', met: criteria.isMinLength },
            ].map((item, idx) => (
              <span
                key={idx}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all border ${formData.password === ''
                    ? 'bg-slate-50 text-slate-400 border-slate-200'
                    : item.met
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
              >
                {item.met ? '✓ ' : ''}{item.label}
              </span>
            ))}
          </div>
        </div> */}

        {/* Password Confirm Field */}
        {/* <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-slate-700 select-none">
            비밀번호 확인<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              value={formData.passwordConfirm}
              onChange={e => setFormData(prev => ({ ...prev, passwordConfirm: e.target.value }))}
              placeholder="비밀번호를 한번 더 입력해 주세요."
              className={`w-full px-5 py-3.5 pr-12 rounded-xl border text-base font-semibold focus:outline-none transition-all ${
                formData.passwordConfirm === ''
                  ? 'border-slate-200 focus:border-brand-primary'
                  : isPasswordMatch
                    ? 'border-slate-200 focus:border-emerald-500'
                    : 'border-rose-300 focus:border-rose-500 bg-rose-50/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors select-none"
            >
              {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {!isPasswordMatch && formData.passwordConfirm !== '' && (
            <p className="text-sm text-rose-500 font-semibold mt-1">비밀번호가 일치하지 않습니다.</p>
          )}
        </div> */}

        {/* Real Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-slate-700 select-none">
            이름 (실명)<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="이름을 입력해 주세요."
            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 text-base font-semibold focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* Phone Number Field */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-slate-700 select-none">
            사용 중인 휴대폰 번호<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <div className="flex gap-3.5">
            {/* <span className="px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-base font-bold flex items-center gap-1.5 select-none">
              🇰🇷 +82
            </span> */}
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="휴대폰 번호를 입력해 주세요 (숫자만)"
              className={`w-full px-5 py-3.5 rounded-xl border text-base font-semibold focus:outline-none transition-all ${formData.phone === ''
                ? 'border-slate-200 focus:border-brand-primary'
                : isPhoneValid
                  ? 'border-slate-200 focus:border-emerald-500'
                  : 'border-rose-300 focus:border-rose-500 bg-rose-50/10'
                }`}
            />
          </div>
          {!isPhoneValid && formData.phone !== '' && (
            <p className="text-sm text-rose-500 font-semibold mt-1">올바른 휴대폰 번호를 입력해 주세요.</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex flex-col gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-2 select-none font-medium">
          <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800 text-base">
            <input
              type="checkbox"
              checked={formData.agreeAll}
              onChange={e => handleAgreeAllChange(e.target.checked)}
              className="w-5 h-5 accent-brand-primary rounded cursor-pointer"
            />
            필수 이용약관 모두 동의
          </label>
          <div className="h-px bg-slate-200 my-1"></div>
          <div className="flex flex-col gap-2.5 pl-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={e => handleTermChange('agreeTerms', e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
              />
              서비스 이용약관 동의 (필수)
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={formData.agreePrivacy}
                onChange={e => handleTermChange('agreePrivacy', e.target.checked)}
                className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
              />
              개인정보 수집 및 이용 동의 (필수)
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-xl font-bold text-base text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors select-none"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`flex-[2] py-4 rounded-xl font-bold text-base text-white transition-all select-none ${isFormValid
              ? 'bg-brand-primary hover:bg-brand-secondary hover:shadow-md cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            작성 완료
          </button>
        </div>
      </form>
    </div>
  );
};
