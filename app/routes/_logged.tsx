import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc/client'
import { NavigationLayout } from '@/designSystem/layouts/NavigationLayout'
import { Outlet, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { ErrorBoundary, MrbSplashScreen } from '~/designSystem'

export default function LoggedLayout() {
  const { isLoading, organization } = useUserContext()
  const router = useNavigate()
  const { data } = Api.authentication.session.useQuery()

  useEffect(() => {
    if (!isLoading && (!data?.user || !organization)) {
      router('/login')
    }
  }, [isLoading, data?.user, organization, router])

  if (isLoading) {
    return <MrbSplashScreen />
  }

  if (data?.user && organization) {
    return (
      <ErrorBoundary>
        <NavigationLayout>
          <Outlet />
        </NavigationLayout>
      </ErrorBoundary>
    )
  }
}
