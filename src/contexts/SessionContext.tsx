'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
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

  return (
    <SessionContext.Provider value={{ session, user, setSession, setUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    return {
      session: null,
      user: null,
      setSession: () => {},
      setUser: () => {},
    };
  }
  return context;
}