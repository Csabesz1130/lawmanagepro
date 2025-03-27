import { useUserContext } from '@/core/context'
import { Utility } from '@/core/helpers/utility'
import { Api } from '@/core/trpc/client'
import { Outlet, useNavigate } from '@remix-run/react'
import { Avatar, Flex, Layout, Typography } from 'antd'
import { useEffect } from 'react'
import { ErrorBoundary, MrbSplashScreen } from '~/designSystem'

const { Header, Content, Footer } = Layout
const { Title } = Typography

export default function ClientLayout() {
  const { isLoading, user } = useUserContext()
  const router = useNavigate()
  const { data } = Api.authentication.session.useQuery()

  useEffect(() => {
    if (!isLoading && !data?.user) {
      router('/login')
    }
  }, [isLoading, data?.user, router])

  if (isLoading) {
    return <MrbSplashScreen />
  }

  if (data?.user) {
    return (
      <ErrorBoundary>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <Flex align="center">
              <Title level={4} style={{ color: 'white', margin: 0 }}>
                LawManagePro Client Portal
              </Title>
            </Flex>
            <Flex align="center" gap="middle">
              {user && (
                <Flex align="center" gap="small">
                  <Typography.Text style={{ color: 'white' }}>
                    {user.name}
                  </Typography.Text>
                  <Avatar
                    src={user.pictureUrl}
                    alt={user.name}
                    size="default"
                    style={{ cursor: 'pointer' }}
                  >
                    {Utility.stringToInitials(user.name)}
                  </Avatar>
                </Flex>
              )}
            </Flex>
          </Header>
          <Content style={{ padding: '0 24px', marginTop: 16 }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            LawManagePro Client Portal ©{new Date().getFullYear()} Created by Your Law Firm
          </Footer>
        </Layout>
      </ErrorBoundary>
    )
  }
}