import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Check, X } from 'lucide-react';

export function LicensePage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-top bg-no-repeat font-fwqingyin"
      style={{ 
        backgroundImage: 'url(/assets/images/backgrounds/bg3.png)',
        backgroundColor: '#f2f2f2'
      }}
    >
      {/* Back Link */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-5 left-5 bg-white/90 text-[#667eea] px-4 py-2.5 rounded-[20px] backdrop-blur-md shadow-lg z-50 hover:bg-[#667eea] hover:text-white transition-colors flex items-center gap-1 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        返回主页
      </button>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-[#e0e0e0]/90 backdrop-blur-sm rounded-[15px] p-8 max-w-[900px] mx-auto shadow-lg relative">
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">License Information</h1>
            <p className="text-xl text-gray-600">© Bhctls , 2023-2026</p>
          </div>

          <div className="space-y-6">
            {/* Pure HTML Projects */}
            <div className="bg-[#f8f9fa] rounded-r-lg border-l-4 border-[#27ae60] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#27ae60]" />
                Pure HTML Projects
              </h2>
              <p className="text-gray-700 mb-4">These projects are licensed under the MIT License with no additional terms.</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>You may not attribute or redistribute unmodified versions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>You are free to download, modify, and use for commercial purposes</span>
                </li>
              </ul>
            </div>

            {/* Other Open Source Projects */}
            <div className="bg-[#f8f9fa] rounded-r-lg border-l-4 border-[#f39c12] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#f39c12]" />
                Other Open Source Projects
              </h2>
              <p className="text-gray-700 mb-4">These projects are licensed under the MIT License with additional terms.</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>You may not use unmodified versions for commercial purposes</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>You may not attribute or redistribute unmodified versions</span>
                </li>
              </ul>
            </div>

            {/* Proprietary Projects */}
            <div className="bg-[#f8f9fa] rounded-r-lg border-l-4 border-[#e74c3c] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#e74c3c]" />
                Proprietary Projects
              </h2>
              <p className="text-gray-700 mb-4">The code of these projects is for personal learning use only.</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Code scraping and reverse engineering are not prohibited when done without the author's knowledge</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>You may not use these projects for commercial purposes, attribution, or redistribution without changing the core logic</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-[#ecf0f1] rounded-lg text-gray-600 italic text-sm">
            Note: This license information applies to projects hosted on this domain and related repositories unless otherwise specified in the project's specific license file.
          </div>

        </div>
      </div>
    </div>
  );
}
