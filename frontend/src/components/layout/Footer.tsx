import React from 'react';
import { ShieldCheck, FileText, Phone, Mail } from 'lucide-react';
import { useToast } from '../ui/Toast';
import intelHeaderLogo from '../../assets/intel-header-logo.svg';

export const Footer: React.FC = () => {
  const { showToast } = useToast();

  const handleLinkClick = (e: React.MouseEvent, linkName: string) => {
    e.preventDefault();
    showToast(`'${linkName}' 약관/문서 준비 중입니다.`);
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center select-none">
              <img src={intelHeaderLogo} alt="Intel Logo" className="h-6 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm break-keep">
              Intel은 디지털 신기술 분야의 실전형 인재를 양성하고, 산업 수요 맞춤형 직무 교육을 통해 구직자의 취업 성공과 재직자의 역량 강화를 지원하는 교육 플랫폼입니다.
            </p>
          </div>

          {/* Quick Contact info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase text-slate-300 tracking-wider">고객 안내 및 상담</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-slate-500" />
                <span>대표전화: <strong className="text-slate-300">02-6050-3114</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-slate-500" />
                <span>이메일: <span className="text-slate-300">workai-support@korcham.net</span></span>
              </div>
            </div>
          </div>

          {/* Policy Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase text-slate-300 tracking-wider">법적 고지 및 약관</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, '개인정보처리방침')}
                className="text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <ShieldCheck size={12} />
                개인정보처리방침
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, '이용약관')}
                className="hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                <FileText size={12} />
                이용약관
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, '이메일무단수집거부')}
                className="hover:text-slate-300 transition-colors"
              >
                이메일무단수집거부
              </a>
            </div>
          </div>
        </div>

        {/* Corporate bottom detail */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-slate-600">
          <div className="space-y-1">
            <p>서울 금천구 가산디지털2로 143 UnionAI | 사업자등록번호: 104-82-01234</p>
            <p>Copyright © 2026 UnionAI. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/40 px-3 py-1.5 border border-slate-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-500">Service Status: Normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
