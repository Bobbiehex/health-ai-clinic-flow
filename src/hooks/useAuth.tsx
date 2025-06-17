
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

type UserProfile = Tables<'users'>;

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; role?: string }) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Defer additional operations to prevent auth callback blocking
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
          // Log successful authentication
          logAction('user_login', 'authentication', session.user.id);
        }, 0);
      } else {
        setProfile(null);
        if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            logAction('user_logout', 'authentication', user?.id || 'unknown');
          }, 0);
        }
      }
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const logAction = async (
    action: string,
    resourceType: string,
    resourceId: string,
    metadata?: any
  ) => {
    try {
      const { error } = await supabase.functions.invoke('audit-logger', {
        body: {
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          metadata,
        },
      });

      if (error) {
        console.error('Audit log error:', error);
      }
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; role?: string }) => {
    try {
      // Security fix: Add proper email redirect URL
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role || 'patient',
          },
        },
      });

      // Log signup attempt
      if (!error) {
        setTimeout(() => {
          logAction('user_signup', 'authentication', data.user?.id || 'unknown');
        }, 0);
      }

      return { data, error };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Log failed login attempts
      if (error) {
        setTimeout(() => {
          logAction('failed_login', 'authentication', email, {
            error_message: error.message,
            timestamp: new Date().toISOString()
          });
        }, 0);
      }

      return { data, error };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    const currentUserId = user?.id;
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
    } else {
      // Log successful logout
      setTimeout(() => {
        logAction('user_logout', 'authentication', currentUserId || 'unknown');
      }, 0);
    }
  };

  const value = {
    user,
    profile,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
