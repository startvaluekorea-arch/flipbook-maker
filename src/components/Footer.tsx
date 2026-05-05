import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#2C2C2C] text-[#E0E0E0] py-8 mt-12 w-full">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-xl font-bold text-white mb-4">사회적기업 아름다운사람들</h2>
            <p className="text-sm">서울시 성동구 뚝섬로 1길 25 서울숲한라에코밸리 702호</p>
            <p className="text-sm">
              Tel: 02-6948-9650 <span className="mx-2">|</span> Fax: 02-6948-9649 <span className="mx-2">|</span> e-mail: misa3130@misawell.org
            </p>
            <p className="text-sm mt-4 text-gray-400">
              본 홈페이지의 모든 내용은 저작권법의 보호를 받으므로 무단 복제 및 배포를 금지합니다.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                [Facebook]
              </a>
              <a href="#" className="hover:text-white transition-colors">
                [Twitter]
              </a>
              <a href="#" className="hover:text-white transition-colors">
                [Instagram]
              </a>
            </div>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="https://www.misawell.org/content/service/terms.php" className="hover:text-white transition-colors">이용약관</a>
              <a href="https://www.misawell.org/content/service/privacy.php" className="hover:text-white transition-colors font-bold">개인정보처리방침</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-xs text-gray-400">
          COPYRIGHT 2015 @ MisaWelfare Co. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
