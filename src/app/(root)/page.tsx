'use client'

import { useMutation, useQuery } from 'convex/react'
import { useOrganization, useUser } from '@clerk/nextjs'

import { Button } from '@/components'
import { api } from '@/libs'

export default function AppPage() {
  const user = useUser()
  const organization = useOrganization()

  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) orgId = organization.organization?.id || user.user?.id

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')
  const createFile = useMutation(api.files.createFile)

  const handleCreateFile = () => {
    if (!orgId) return

    createFile({ name: 'Hello World', orgId })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-3">
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
      <Button onClick={handleCreateFile}>Click Me</Button>
    </main>
  )
}
