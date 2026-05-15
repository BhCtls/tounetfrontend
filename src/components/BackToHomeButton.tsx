import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BackToHomeButtonProps {
    variant?: 'default' | 'auth';
    className?: string;
}

export function BackToHomeButton({ variant = 'default', className = '' }: BackToHomeButtonProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const tabs = [
        {
            key: 'about',
            label: ['about', 'me'],
            path: '/'
        },
        {
            key: 'home',
            label: ['home', 'page'],
            path: '/desktop'
        },
        {
            key: 'dashboard',
            label: ['Dash', 'board'],
            path: '/dashboard'
        }
    ];

    const baseClasses = "fixed top-4 left-4 z-50 flex flex-col gap-2";
    const variantBaseClasses = variant === 'auth'
        ? "bg-white/90 text-blue-600 hover:bg-blue-600 hover:text-white"
        : "bg-white/90 text-slate-700 hover:bg-slate-900 hover:text-white";
    const variantActiveClasses = variant === 'auth'
        ? "bg-blue-600 text-white"
        : "bg-slate-900 text-white";
    const tabClasses = "w-14 h-14 rounded-2xl shadow-lg backdrop-blur-sm border border-white/70 transition-colors font-semibold text-[11px] leading-tight flex items-center justify-center text-center";

    return (
        <div className={`${baseClasses} ${className}`}>
            {!collapsed && tabs.map((tab) => {
                const isActive = location.pathname === tab.path;

                return (
                    <button
                        key={tab.key}
                        onClick={() => navigate(tab.path)}
                        className={`${tabClasses} ${isActive ? variantActiveClasses : variantBaseClasses}`}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={tab.label.join(' ')}
                    >
                        <span>
                            <span className="block">{tab.label[0]}</span>
                            <span className="block">{tab.label[1]}</span>
                        </span>
                    </button>
                );
            })}

            <button
                onClick={() => setCollapsed((prev) => !prev)}
                className={`${tabClasses} ${variantBaseClasses}`}
                aria-label={collapsed ? '展开' : '收折'}
            >
                <span className="block">
                    <span className="block">{collapsed ? '展' : '收'}</span>
                    <span className="block">{collapsed ? '开' : '折'}</span>
                </span>
            </button>
        </div>
    );
}
