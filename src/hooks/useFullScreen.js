// hooks/useFullscreen.js
import { useState, useEffect, useRef } from 'react';

export const useFullscreen = () => {
  const elementRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setError(null);
    };

    const handleFullscreenError = (e) => {
      setError(e.message || 'Fullscreen error occurred');
    };

    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];
    
    events.forEach(event => {
      document.addEventListener(event, handleFullscreenChange);
    });

    document.addEventListener('fullscreenerror', handleFullscreenError);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange);
      });
      document.removeEventListener('fullscreenerror', handleFullscreenError);
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      // ONLY use elementRef.current, don't fallback to document.documentElement
      const element = elementRef.current;
      
      if (!element) {
        throw new Error('No element attached to fullscreen');
      }

      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error entering fullscreen:', err);
      throw err;
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error exiting fullscreen:', err);
      throw err;
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await exitFullscreen();
      } else {
        await enterFullscreen();
      }
    } catch (err) {
      // Error already handled in enter/exit
      console.error('Toggle fullscreen error:', err);
    }
  };

  return {
    elementRef,
    isFullscreen,
    error,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
};