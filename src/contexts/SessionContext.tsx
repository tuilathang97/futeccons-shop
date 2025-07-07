'use client';

import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react';
import { Session, User } from '@/db/schema';
import { authClient } from '@/lib/auth-client';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
  session: Session | null;
  user: User | null;
}

export function SessionProvider({ children, session: initialSession, user: initialUser }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session client-side
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        if (sessionData?.data?.session && sessionData?.data?.user) {
          // Convert auth client session/user to our schema types
          const session = {
            ...sessionData.data.session,
            ipAddress: sessionData.data.session.ipAddress ?? null,
            userAgent: sessionData.data.session.userAgent ?? null,
            impersonatedBy: sessionData.data.session.impersonatedBy ?? null,
          };
          
          const user = {
            ...sessionData.data.user,
            number: sessionData.data.user.username ?? null, // Use username as number fallback
            image: sessionData.data.user.image ?? null,
            role: sessionData.data.user.role ?? null,
            banned: sessionData.data.user.banned ?? null,
            banReason: sessionData.data.user.banReason ?? null,
            banExpires: sessionData.data.user.banExpires ?? null,
          };
          
          setSession(session as Session);
          setUser(user as User);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const contextValue = useMemo(
    () => ({ session, user, setSession, setUser, isLoading }),
    [session, user, setSession, setUser, isLoading]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  const fallbackValue = useMemo(
    () => ({
      session: null,
      user: null,
      setSession: () => {},
      setUser: () => {},
      isLoading: false,
    }),
    []
  );

  if (context === undefined) {
    return fallbackValue;
  }
  return context;
}