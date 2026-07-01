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
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    agreeAll: false,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = /^\d{9,11}$/.test(formData.phone.replace(/[^0-9]/g, ''));

  const isFormValid =
    isEmailValid &&
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
    <div className="bg-white border border-slate-200 shadow-sm p-6 md:p-8 mb-8 animate-fade-in text-slate-800 select-text">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">지원서 작성</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            [{courseTitle}] 과정의 원활한 접수 및 상세 상담을 위해 아래 정보를 정확히 입력해 주세요.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-bold text-slate-500 hover:text-brand-secondary transition-colors flex items-center gap-1.5 cursor-pointer select-none shrink-0"
        >
          <ArrowLeft size={14} /> 취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 flex items-center select-none">
            이메일 주소<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="이메일을 입력해 주세요."
            className={`w-full px-4 py-2.5 border text-sm font-medium focus:outline-none transition-all ${formData.email === ''
              ? 'border-slate-200 focus:border-brand-primary'
              : isEmailValid
                ? 'border-slate-200 focus:border-emerald-500'
                : 'border-rose-300 focus:border-rose-500 bg-rose-50/10'
              }`}
          />
          {!isEmailValid && formData.email !== '' && (
            <p className="text-xs text-rose-500 font-semibold mt-1">올바른 이메일 형식을 입력해 주세요.</p>
          )}
        </div>

        {/* Real Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 select-none">
            이름 (실명)<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="이름을 입력해 주세요."
            className="w-full px-4 py-2.5 border border-slate-200 text-sm font-medium focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* Phone Number Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 select-none">
            사용 중인 휴대폰 번호<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <div className="flex gap-3.5">
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="휴대폰 번호를 입력해 주세요 (숫자만)"
              className={`w-full px-4 py-2.5 border text-sm font-medium focus:outline-none transition-all ${formData.phone === ''
                ? 'border-slate-200 focus:border-brand-primary'
                : isPhoneValid
                  ? 'border-slate-200 focus:border-emerald-500'
                  : 'border-rose-300 focus:border-rose-500 bg-rose-50/10'
                }`}
            />
          </div>
          {!isPhoneValid && formData.phone !== '' && (
            <p className="text-xs text-rose-500 font-semibold mt-1">올바른 휴대폰 번호를 입력해 주세요.</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex flex-col gap-3 bg-slate-50 p-5 border border-slate-200 mt-2 select-none font-medium">
          <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800 text-sm">
            <input
              type="checkbox"
              checked={formData.agreeAll}
              onChange={e => handleAgreeAllChange(e.target.checked)}
              className="w-4 h-4 accent-brand-primary cursor-pointer"
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
                className="w-4 h-4 accent-brand-primary cursor-pointer"
              />
              서비스 이용약관 동의 (필수)
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={formData.agreePrivacy}
                onChange={e => handleTermChange('agreePrivacy', e.target.checked)}
                className="w-4 h-4 accent-brand-primary cursor-pointer"
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
            className="flex-1 py-3 font-bold text-sm text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors select-none cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`flex-[2] py-3 font-bold text-sm text-white transition-all select-none ${isFormValid
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
