import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'

export const HeaderLayout = () => {
  return (
    <div className="sticky top-0 border-b bg-gray-50 py-3">
      <div className="container flex items-center justify-between">
        <span className="text-xl font-bold text-blue-500">Rz Drive</span>
        <div className="flex items-center gap-3">
          <OrganizationSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </div>
  )
}
