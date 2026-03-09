import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'premium';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
    const variants = {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm active:scale-[0.98]',
        secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 active:scale-[0.98]',
        outline: 'border-2 border-slate-200 bg-white hover:border-brand-500 hover:text-brand-600 text-clinical-slate active:scale-[0.98]',
        ghost: 'bg-transparent hover:bg-brand-50 text-clinical-slate hover:text-brand-700',
        danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-[0.98]',
        premium: 'premium-gradient text-white shadow-premium hover:opacity-90 active:scale-[0.96]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider',
        md: 'px-6 py-3 text-sm font-bold',
        lg: 'px-10 py-5 text-base font-black tracking-tight',
        xl: 'px-12 py-7 text-xl font-black tracking-tighter',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { className?: string, children: React.ReactNode }) => (
    <div
        className={cn('bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden transition-all duration-500', className)}
        {...props}
    >
        {children}
    </div>
);

export const Badge = ({
    children,
    variant = 'success',
    className
}: {
    children: React.ReactNode,
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand',
    className?: string
}) => {
    const styles = {
        success: 'bg-teal-50 text-teal-700 border-teal-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        danger: 'bg-rose-50 text-rose-700 border-rose-100',
        info: 'bg-sky-50 text-sky-700 border-sky-100',
        neutral: 'bg-slate-50 text-slate-600 border-slate-200',
        brand: 'bg-brand-50 text-brand-700 border-brand-100',
    };

    return (
        <span className={cn('px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border whitespace-nowrap', styles[variant], className)}>
            {children}
        </span>
    );
};

export const Input = ({ label, icon: Icon, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: any, error?: string }) => (
    <div className="space-y-2 w-full group">
        {label && <label className="text-[10px] font-black text-clinical-slate uppercase tracking-[0.2em] px-1 group-focus-within:text-brand-600 transition-colors">{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-slate group-focus-within:text-brand-500 transition-colors" size={18} />}
            <input
                className={cn(
                    "w-full bg-clinical-surface border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-500 outline-none transition-all placeholder:text-clinical-slate/30 text-clinical-text font-bold text-sm",
                    Icon ? "pl-12 pr-4 py-4" : "px-5 py-4",
                    error && "border-rose-500 bg-rose-50/30"
                )}
                {...props}
            />
        </div>
        {error && <p className="text-[10px] font-bold text-rose-500 px-1">{error}</p>}
    </div>
);
