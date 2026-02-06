import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackToHomeButtonProps {
    variant?: 'default' | 'auth';
    className?: string;
}

export function BackToHomeButton({ variant = 'default', className = '' }: BackToHomeButtonProps) {
    const navigate = useNavigate();

    const baseClasses = "fixed top-5 left-5 z-50 flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transition-all";

    const variantClasses = variant === 'auth'
        ? "bg-white/90 text-blue-600 hover:bg-blue-600 hover:text-white"
        : "bg-white/90 text-[#667eea] hover:bg-[#667eea] hover:text-white";

    return (
        <button
            onClick={() => navigate('/')}
            className={`${baseClasses} ${variantClasses} ${className}`}
        >
            <ArrowLeft className="w-4 h-4" />
            返回主页
        </button>
    );
}
