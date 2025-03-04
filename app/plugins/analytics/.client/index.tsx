import { Api } from '@/core/trpc'
import Posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'
import { Configuration } from '~/core/configuration'

type Props = {
  children: ReactNode
}

export const AnalyticsProvider = (props: Props) => {
  const { data, isLoading } = Api.configuration.getPublic.useQuery()

  useEffect(() => {
    const isProduction = Configuration.isProduction()
    const canActivate =
      typeof window !== 'undefined' && !isLoading && data && isProduction

    if (canActivate) {
      const key = data['PUBLIC_POSTHOG_KEY']
      const host = data['PUBLIC_POSTHOG_HOST']

      try {
        Posthog.init(key, {
          api_host: host,
        })
      } catch (error) {
        console.log(`Could not start analytics: ${error.message}`)
      }
    }
  }, [data, isLoading])

  return <PostHogProvider client={Posthog}>{props.children}</PostHogProvider>
}
