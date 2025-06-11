
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileOptimizedProps {
  children: React.ReactNode;
  mobileClassName?: string;
  desktopClassName?: string;
  className?: string;
}

export const MobileOptimized: React.FC<MobileOptimizedProps> = ({
  children,
  mobileClassName = '',
  desktopClassName = '',
  className = ''
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      className,
      isMobile ? mobileClassName : desktopClassName
    )}>
      {children}
    </div>
  );
};

export const MobileGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      'grid gap-4',
      isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      className
    )}>
      {children}
    </div>
  );
};

export const MobileStack: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      'flex',
      isMobile ? 'flex-col space-y-4' : 'flex-row space-x-4',
      className
    )}>
      {children}
    </div>
  );
};
