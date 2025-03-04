// import { useUserContext } from '@/core/context'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { Flex } from 'antd'
import { ReactNode } from 'react'
import { Leftbar } from './components/Leftbar'
import { Mobilebar } from './components/Mobilebar'
import { Topbar } from './components/Topbar'
import { NavigationItem } from './types'
import { useUserContext } from '~/core/context'

interface Props {
  children: ReactNode
}

export const NavigationLayout: React.FC<Props> = ({ children }) => {
  const router = useNavigate()
  const pathname = useLocation().pathname
  const params: Record<string, string> = useParams()

  const { organization } = useUserContext()

  const goTo = (url: string) => {
    router(url)
  }

  const items: NavigationItem[] = [
    {
      key: '/home',
      label: 'Home',
      position: 'leftbar',

      onClick: () => goTo('/home'),
    },

    {
      key: '/organizations/:organizationId/dashboard',
      label: 'Dashboard',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/dashboard'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/roles',
      label: 'Role Management',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/roles'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/matters',
      label: 'Matter Management',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/matters'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/tasks',
      label: 'Task Management',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/tasks'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/time-tracking',
      label: 'Time Tracking',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/time-tracking'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/finance',
      label: 'Financial Management',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/finance'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/clients',
      label: 'Client Management',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/clients'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/resources',
      label: 'Resource Allocation',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/resources'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/analytics',
      label: 'Analytics and Reporting',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/analytics'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/profile',
      label: 'User Profile',
      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/profile'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },

    {
      key: '/organizations/:organizationId/pricing',
      label: 'Pricing',

      position: 'leftbar',

      isVisible: !!organization,
      onClick: () =>
        goTo(
          '/organizations/:organizationId/pricing'.replace(
            ':organizationId',
            organization.id,
          ),
        ),
    },
  ]

  const itemsVisible = items
    .filter(item => item.isVisible !== false)
    .map(item => ({
      key: item.key,
      label: item.label,
      position: item.position,
      onClick: item.onClick,
    }))

  const itemsTopbar = itemsVisible.filter(item => item.position === 'topbar')

  const itemsLeftbar = itemsVisible.filter(item => item.position === 'leftbar')

  const itemsLeftbottom = itemsVisible.filter(
    item => item.position === 'leftbar-bottom',
  )

  const itemsMobile = itemsVisible

  let keySelected = pathname

  Object.entries(params).forEach(([key, value]) => {
    keySelected = keySelected.replace(`/${value}`, `/:${key}`)
  })

  return (
    <>
      <Topbar keySelected={keySelected} items={itemsTopbar} />

      <Mobilebar keySelected={keySelected} items={itemsMobile} />

      <Flex flex={1} style={{ overflowY: 'hidden' }}>
        <Leftbar
          keySelected={keySelected}
          items={itemsLeftbar}
          itemsBottom={itemsLeftbottom}
        />

        <Flex flex={1} vertical style={{ overflowY: 'hidden' }}>
          {children}
        </Flex>
      </Flex>
    </>
  )
}
