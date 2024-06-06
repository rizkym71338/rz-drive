'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'convex/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOrganization, useUser } from '@clerk/nextjs'
import { z } from 'zod'

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, useToast } from '@/components'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components'
import { api } from '@/libs'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.custom<FileList>((value) => value instanceof FileList, 'File is required').refine((files) => files.length > 0, 'File is required'),
})

export default function AppPage() {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { title: '', file: undefined } })

  const fileRef = form.register('file')

  const user = useUser()
  const organization = useOrganization()

  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) orgId = organization.organization?.id || user.user?.id

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')
  const createFile = useMutation(api.files.createFile)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!orgId) return

    try {
      const postUrl = await generateUploadUrl()

      const result = await fetch(postUrl, { method: 'POST', headers: { 'Content-Type': values.file[0].type }, body: values.file[0] })

      const { storageId } = await result.json()

      await createFile({ name: values.title, fileId: storageId, orgId })

      setIsFileDialogOpen(false)

      toast({ description: 'File uploaded', title: 'Success' })
    } catch (error) {
      toast({ description: 'Something went wrong', title: 'Error', variant: 'destructive' })
    }
  }

  return (
    <main className="container py-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <Dialog
          open={isFileDialogOpen}
          onOpenChange={() => {
            setIsFileDialogOpen(!isFileDialogOpen)
            form.reset()
          }}
        >
          <DialogTrigger asChild>
            <Button>Upload File</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="pb-3">Upload your file here</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormLabel>File</FormLabel>
                          <FormControl>
                            <Input type="file" {...fileRef} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting} className="flex items-center gap-1">
                      {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Submit
                    </Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
    </main>
  )
}
