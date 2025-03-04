import React from 'react'
import { Typography, Row, Col, Card, Statistic, List, Table } from 'antd'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, organization, checkOrganizationRole } = useUserContext()
  const isSuperAdmin = user?.globalRole === 'ADMIN'
  const isAttorney = checkOrganizationRole('attorney')
  const isPartner = checkOrganizationRole('partner')
  const isManagingPartner = checkOrganizationRole('managing_partner')

  const { data: tasks } = Api.task.findMany.useQuery({
    where: { assignedUserId: user?.id },
    include: { matter: true },
  })

  const { data: cases } = Api.matter.findMany.useQuery({
    where: { organizationId: organization?.id },
  })

  const { data: timeEntries } = Api.timeEntry.findMany.useQuery({
    where: { userId: user?.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const { data: financialData } = Api.expense.findMany.useQuery({
    where: { matterId: { in: cases?.map(c => c.id) } },
  })

  return (
    <PageLayout layout="full-width">
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>Dashboard</Title>
        <Text>
          Welcome to your personalized dashboard. Here's an overview of your
          tasks, cases, and important metrics.
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Total Tasks"
                value={tasks?.length || 0}
                prefix={<i className="las la-tasks" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Active Cases"
                value={cases?.length || 0}
                prefix={<i className="las la-briefcase" />}
              />
            </Card>
          </Col>
          {(isSuperAdmin || isManagingPartner) && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Total Expenses"
                  value={financialData
                    ?.reduce(
                      (sum, expense) => sum + parseFloat(expense.amount || '0'),
                      0,
                    )
                    .toFixed(2)}
                  prefix={<i className="las la-dollar-sign" />}
                />
              </Card>
            </Col>
          )}
        </Row>

        {(isAttorney || isPartner) && (
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={24} md={12}>
              <Card
                title="Upcoming Deadlines"
                extra={
                  <a
                    onClick={() =>
                      navigate('/organizations/' + organization?.id + '/tasks')
                    }
                  >
                    View All
                  </a>
                }
              >
                <List
                  dataSource={tasks
                    ?.filter(
                      task =>
                        task.dueDate && dayjs(task.dueDate).isAfter(dayjs()),
                    )
                    .slice(0, 5)}
                  renderItem={task => (
                    <List.Item>
                      <List.Item.Meta
                        title={task.title}
                        description={`Due: ${dayjs(task.dueDate).format(
                          'MMM D, YYYY',
                        )} - ${task.matter?.title}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="Recent Time Entries"
                extra={
                  <a
                    onClick={() =>
                      navigate(
                        '/organizations/' + organization?.id + '/time-tracking',
                      )
                    }
                  >
                    View All
                  </a>
                }
              >
                <Table
                  dataSource={timeEntries}
                  columns={[
                    {
                      title: 'Description',
                      dataIndex: 'description',
                      key: 'description',
                    },
                    {
                      title: 'Duration',
                      dataIndex: 'duration',
                      key: 'duration',
                    },
                    {
                      title: 'Date',
                      dataIndex: 'createdAt',
                      key: 'createdAt',
                      render: date => dayjs(date).format('MMM D, YYYY'),
                    },
                  ]}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        )}

        {(isSuperAdmin || isManagingPartner) && (
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={24}>
              <Card
                title="Financial Overview"
                extra={
                  <a
                    onClick={() =>
                      navigate(
                        '/organizations/' + organization?.id + '/finance',
                      )
                    }
                  >
                    View Details
                  </a>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Statistic
                      title="Total Revenue"
                      value={financialData
                        ?.reduce(
                          (sum, expense) =>
                            sum + parseFloat(expense.amount || '0'),
                          0,
                        )
                        .toFixed(2)}
                      prefix="$"
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Statistic
                      title="Average Case Value"
                      value={(
                        financialData?.reduce(
                          (sum, expense) =>
                            sum + parseFloat(expense.amount || '0'),
                          0,
                        ) / (cases?.length || 1)
                      ).toFixed(2)}
                      prefix="$"
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Statistic
                      title="Active Cases"
                      value={cases?.length || 0}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </PageLayout>
  )
}
