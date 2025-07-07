"use client"

import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

export default function ProgressProviderComponent({ children }: { children: React.ReactNode }) {
    return <ProgressProvider
    color="#FBDB93"
    options={{ showSpinner: false }}
    height='3px'
    shallowRouting
>{children}</ProgressProvider>;
}