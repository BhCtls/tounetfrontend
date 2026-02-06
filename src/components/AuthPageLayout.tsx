import { BackToHomeButton } from './BackToHomeButton';

interface AuthPageLayoutProps {
    children: React.ReactNode;
    icon: React.ReactNode;
    title: string;
    subtitle?: React.ReactNode;
}

export function AuthPageLayout({ children, icon, title, subtitle }: AuthPageLayoutProps) {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative"
            style={{
                backgroundImage: 'url(/assets/images/backgrounds/bg6.png)',
                backgroundColor: '#f2f2f2'
            }}
        >
            <BackToHomeButton variant="auth" />

            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-primary-600 flex items-center justify-center">
                        {icon}
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
}
