import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <main className="flex min-h-screen flex-col items-center justify-center p-3">{children}</main>
}
