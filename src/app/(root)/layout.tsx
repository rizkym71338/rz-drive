import { Fragment, ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { HeaderLayout, Toaster } from '@/components'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  if (!auth().userId) redirect('/sign-in')

  return (
    <Fragment>
      <HeaderLayout />
      {children}
      <Toaster />
    </Fragment>
  )
}
