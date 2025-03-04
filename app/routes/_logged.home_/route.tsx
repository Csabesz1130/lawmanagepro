import { Typography, Row, Col, Card } from 'antd'
const { Title, Paragraph } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
export default function HomePage() {
  const navigate = useNavigate()
  const { organizationId } = useParams()
  const { isLoggedIn } = useUserContext()

  return (
    <PageLayout layout="full-width">
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={22} sm={20} md={18} lg={16} xl={14}>
          <Card>
            <Title level={1} style={{ textAlign: 'center' }}>
              Welcome to Our Law Practice Management Application
            </Title>
            <Paragraph style={{ fontSize: '18px', textAlign: 'center' }}>
              Streamline your legal practice with our comprehensive management
              tool.
            </Paragraph>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card>
                  <i
                    className="las la-tasks"
                    style={{ fontSize: '48px', color: '#1890ff' }}
                  ></i>
                  <Title level={4}>Task Management</Title>
                  <Paragraph>
                    Efficiently manage and track tasks for all your legal
                    matters.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <i
                    className="las la-clock"
                    style={{ fontSize: '48px', color: '#52c41a' }}
                  ></i>
                  <Title level={4}>Time Tracking</Title>
                  <Paragraph>
                    Accurately record and bill time spent on each case.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <i
                    className="las la-user-tie"
                    style={{ fontSize: '48px', color: '#faad14' }}
                  ></i>
                  <Title level={4}>Client Management</Title>
                  <Paragraph>
                    Maintain detailed client records and improve communication.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <i
                    className="las la-chart-bar"
                    style={{ fontSize: '48px', color: '#eb2f96' }}
                  ></i>
                  <Title level={4}>Analytics and Reporting</Title>
                  <Paragraph>
                    Gain insights into your practice with comprehensive reports.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
            <Paragraph style={{ textAlign: 'center', marginTop: '24px' }}>
              To get started, please navigate to your organization's dashboard.
            </Paragraph>
            <Row justify="center">
              <Col>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate(`/organizations/${organizationId}/dashboard`);
                    } else {
                      navigate(`/login?returnUrl=${encodeURIComponent(`/organizations/${organizationId}/dashboard`)}`);
                    }
                  }}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Go to Dashboard
                </button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
