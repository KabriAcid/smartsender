interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/favicon.png"
        alt="SmartSender"
        className={`${sizeMap[size]} rounded-lg`}
      />
      {showText && (
        <span className={`font-semibold ${textSizeMap[size]} text-foreground`}>
          SmartSender
        </span>
      )}
    </div>
  );
};
