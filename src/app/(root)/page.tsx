'use client'

import { UserButton } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { Button } from '@/components'
import { api } from '@/libs'

export default function AppPage() {
  const files = useQuery(api.files.getFiles)
  const createFile = useMutation(api.files.createFile)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-3">
      <UserButton afterSignOutUrl="/sign-in" />
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
      <Button onClick={() => createFile({ name: 'Hello World' })}>Click Me</Button>
    </main>
  )
}
