import { BackToHomeButton } from './BackToHomeButton';

interface PageLayoutProps {
    children: React.ReactNode;
    backgroundImage?: string;
    showBackButton?: boolean;
    className?: string;
}

export function PageLayout({
    children,
    backgroundImage = 'bg1.png',
    showBackButton = true,
    className = ''
}: PageLayoutProps) {
    return (
        <div
            className={`min-h-screen bg-cover bg-top bg-no-repeat bg-fixed font-fwqingyin m-0 ${className}`}
            style={{
                backgroundImage: `url(/assets/images/backgrounds/${backgroundImage})`,
                backgroundColor: '#f2f2f2'
            }}
        >
            {showBackButton && <BackToHomeButton />}
            {children}
        </div>
    );
}
