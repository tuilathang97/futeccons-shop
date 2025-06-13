'use client';

import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { Session, User } from '@/db/schema';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
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
  const contextValue = useMemo(
    () => ({ session, user, setSession, setUser }),
    [session, user, setSession, setUser]
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
    }),
    []
  );

  if (context === undefined) {
    return fallbackValue;
  }
  return context;
}