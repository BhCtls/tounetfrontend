import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backText?: string;
  actions?: ReactNode;
  className?: string;
  onBack?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  showBack = true,
  backText = '返回',
  actions,
  className = '',
  onBack,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm shadow-sm ${className}`}>
      <div className="flex items-center gap-4">
        {showBack && (
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backText}
          </Button>
        )}
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'FWQingYin, Arial, sans-serif' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
