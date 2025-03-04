import React, { useState, useEffect } from 'react'
import { Typography, Card, Row, Col, Select, Button, Table, Spin } from 'antd'
const { Title, Text } = Typography
const { Option } = Select
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function AnalyticsandReportingPage() {
  const { user, organization, checkOrganizationRole } = useUserContext()
  const [reportType, setReportType] = useState('productivity')
  const [timeRange, setTimeRange] = useState('week')
  const [productivityData, setProductivityData] = useState([])
  const [budgetVsActualData, setBudgetVsActualData] = useState([])
  const [personalPerformanceData, setPersonalPerformanceData] = useState([])

  const isAdmin = checkOrganizationRole('owner') || user?.globalRole === 'ADMIN'
  const isPartner = checkOrganizationRole('partner')

  const { data: timeEntries, isLoading: isLoadingTimeEntries } =
    Api.timeEntry.findMany.useQuery({
      where: { userId: user?.id },
      include: { user: true, matter: true },
    })

  const { data: tasks, isLoading: isLoadingTasks } = Api.task.findMany.useQuery(
    {
      where: { assignedUserId: user?.id },
      include: { matter: true },
    },
  )

  const getFilteredData = () => {
    const now = dayjs()
    return timeEntries?.filter(entry => {
      const entryDate = dayjs(entry.startTime)
      if (timeRange === 'week') return now.diff(entryDate, 'week') <= 1
      if (timeRange === 'month') return now.diff(entryDate, 'month') <= 1
      return true
    })
  }

  useEffect(() => {
    const filteredData = getFilteredData()
    setProductivityData(
      filteredData?.map(entry => ({
        key: entry.id,
        user: entry.user?.name,
        matter: entry.matter?.title,
        duration: entry.duration,
        date: dayjs(entry.startTime).format('YYYY-MM-DD'),
      })) || [],
    )
  }, [timeEntries, timeRange])

  useEffect(() => {
    const filteredData = getFilteredData()
    setBudgetVsActualData(
      filteredData?.map(entry => ({
        key: entry.id,
        matter: entry.matter?.title,
        actualHours: parseFloat(entry.duration || '0'),
        budgetHours: 40,
        variance: 40 - parseFloat(entry.duration || '0'),
      })) || [],
    )
  }, [timeEntries, timeRange])

  useEffect(() => {
    const filteredData = getFilteredData()
    const totalHours =
      filteredData?.reduce(
        (acc, entry) => acc + parseFloat(entry.duration || '0'),
        0,
      ) || 0
    const completedTasks =
      tasks?.filter(task => task.status === 'Completed').length || 0

    setPersonalPerformanceData([
      { key: '1', metric: 'Total Hours Worked', value: totalHours.toFixed(2) },
      { key: '2', metric: 'Completed Tasks', value: completedTasks.toString() },
      {
        key: '3',
        metric: 'Average Hours per Task',
        value: (totalHours / (tasks?.length || 1)).toFixed(2),
      },
    ])
  }, [timeEntries, tasks, timeRange])

  const columns = {
    productivity: [
      { title: 'User', dataIndex: 'user', key: 'user' },
      { title: 'Matter', dataIndex: 'matter', key: 'matter' },
      { title: 'Duration (hours)', dataIndex: 'duration', key: 'duration' },
      { title: 'Date', dataIndex: 'date', key: 'date' },
    ],
    budgetVsActual: [
      { title: 'Matter', dataIndex: 'matter', key: 'matter' },
      { title: 'Actual Hours', dataIndex: 'actualHours', key: 'actualHours' },
      { title: 'Budget Hours', dataIndex: 'budgetHours', key: 'budgetHours' },
      { title: 'Variance', dataIndex: 'variance', key: 'variance' },
    ],
    personalPerformance: [
      { title: 'Metric', dataIndex: 'metric', key: 'metric' },
      { title: 'Value', dataIndex: 'value', key: 'value' },
    ],
  }

  const getDataSource = () => {
    switch (reportType) {
      case 'productivity':
        return productivityData
      case 'budgetVsActual':
        return budgetVsActualData
      case 'personalPerformance':
        return personalPerformanceData
      default:
        return []
    }
  }

  return (
    <PageLayout layout="full-width">
      <Card>
        <Title level={2}>
          <i className="las la-chart-bar"></i> Analytics and Reporting
        </Title>
        <Text>
          Generate and view custom reports on firm performance and personal
          analytics.
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              style={{ width: '100%' }}
              value={reportType}
              onChange={setReportType}
              disabled={!isAdmin && !isPartner}
            >
              {isAdmin && (
                <Option value="productivity">Productivity Metrics</Option>
              )}
              {(isAdmin || isPartner) && (
                <Option value="budgetVsActual">Budget vs. Actual</Option>
              )}
              <Option value="personalPerformance">Personal Performance</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              style={{ width: '100%' }}
              value={timeRange}
              onChange={setTimeRange}
            >
              <Option value="week">Last Week</Option>
              <Option value="month">Last Month</Option>
              <Option value="all">All Time</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Button
              type="primary"
              icon={<i className="las la-file-export"></i>}
            >
              Export Report
            </Button>
          </Col>
        </Row>

        {isLoadingTimeEntries || isLoadingTasks ? (
          <Spin size="large" style={{ marginTop: '20px' }} />
        ) : (
          <Table
            style={{ marginTop: '20px' }}
            columns={columns[reportType as keyof typeof columns]}
            dataSource={getDataSource()}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </PageLayout>
  )
}
