import { ShareIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { useDeepLink } from '../../hooks/useDeepLink';
import { useThemeStore } from '../../stores/theme';
import { cn } from '../../utils/cn';
import { useState } from 'react';

interface ShareButtonProps {
  route: string;
  title?: string;
  text?: string;
  params?: Record<string, string | number>;
  query?: Record<string, string | number | boolean>;
  variant?: 'button' | 'icon';
  className?: string;
}

export const ShareButton = ({
  route,
  title,
  text,
  params,
  query,
  variant = 'button',
  className,
}: ShareButtonProps) => {
  const { shareRoute, copyRouteLink } = useDeepLink();
  const { theme } = useThemeStore();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await shareRoute(route, { params, query, title, text });
    } catch (error) {
      // Fallback to copy if share fails
      try {
        await copyRouteLink(route, { params, query });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (copyError) {
        console.error('Error sharing:', copyError);
      }
    }
  };

  const handleCopy = async () => {
    try {
      await copyRouteLink(route, { params, query });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        className={cn(
          'p-2 rounded-lg transition-colors',
          theme === 'dark'
            ? 'hover:bg-[#2A2A3E] text-gray-400 hover:text-white'
            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
          className
        )}
        aria-label="Partager"
      >
        <ShareIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className={className}
      >
        <ShareIcon className="h-4 w-4 mr-2" />
        Partager
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className={className}
      >
        <LinkIcon className="h-4 w-4 mr-2" />
        {copied ? 'Copié!' : 'Copier le lien'}
      </Button>
    </div>
  );
};

