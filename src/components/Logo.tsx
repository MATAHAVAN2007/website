interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-24',
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <img
      src="/image.png"
      alt="Dream Learn - Learn Towards Success"
      className={`${sizes[size]} w-auto object-contain ${className}`}
    />
  );
}
