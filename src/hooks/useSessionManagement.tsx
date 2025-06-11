
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SessionConfig {
  timeoutMinutes: number;
  warningMinutes: number;
  maxConcurrentSessions: number;
}

export const useSessionManagement = (config: SessionConfig = {
  timeoutMinutes: 30,
  warningMinutes: 5,
  maxConcurrentSessions: 3
}) => {
  const { user, signOut } = useAuth();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowTimeoutWarning(false);
  }, []);

  const handleSessionTimeout = useCallback(async () => {
    console.log('Session timed out due to inactivity');
    await signOut();
  }, [signOut]);

  const extendSession = useCallback(() => {
    updateActivity();
    setShowTimeoutWarning(false);
  }, [updateActivity]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [user, updateActivity]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const timeoutMs = config.timeoutMinutes * 60 * 1000;
      const warningMs = config.warningMinutes * 60 * 1000;

      if (timeSinceActivity >= timeoutMs) {
        handleSessionTimeout();
      } else if (timeSinceActivity >= timeoutMs - warningMs) {
        const remaining = Math.ceil((timeoutMs - timeSinceActivity) / 1000);
        setTimeRemaining(remaining);
        setShowTimeoutWarning(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, lastActivity, config, handleSessionTimeout]);

  return {
    showTimeoutWarning,
    timeRemaining,
    extendSession,
    updateActivity,
  };
};
