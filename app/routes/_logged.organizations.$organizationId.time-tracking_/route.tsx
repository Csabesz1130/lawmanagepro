import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { useParams } from '@remix-run/react'
import {
    Button,
    Card,
    Input,
    List,
    message,
    Modal,
    Select,
    Space,
    Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { SmartTimeTracker } from './SmartTimeTracker'
const { Title, Text, Paragraph } = Typography

export default function TimeTrackingPage() {
  const { organizationId } = useParams()
  const { user } = useUserContext()
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [description, setDescription] = useState('')
  const [voiceMemo, setVoiceMemo] = useState('')
  const [showBulkEntry, setShowBulkEntry] = useState(false)
  const [bulkEntries, setBulkEntries] = useState('')
  const [idleDetected, setIdleDetected] = useState(false)

  const { data: matters } = Api.matter.findMany.useQuery({
    where: { organizationId },
  })
  const { data: timeEntries, refetch: refetchTimeEntries } =
    Api.timeEntry.findMany.useQuery({
      where: { userId: user?.id },
      include: { matter: true },
      orderBy: { createdAt: 'desc' },
    })

  const { mutateAsync: createTimeEntry } = Api.timeEntry.create.useMutation()
  const { mutateAsync: updateTimeEntry } = Api.timeEntry.update.useMutation()

  useEffect(() => {
    let idleTimer: NodeJS.Timeout
    if (activeTimer) {
      idleTimer = setTimeout(() => {
        setIdleDetected(true)
      }, 5 * 60 * 1000) // 5 minutes
    }
    return () => clearTimeout(idleTimer)
  }, [activeTimer])

  const startTimer = (matterId: string) => {
    setActiveTimer(matterId)
    setStartTime(new Date())
    setIdleDetected(false)
  }

  const stopTimer = async () => {
    if (activeTimer && startTime) {
      const endTime = new Date()
      const duration = dayjs(endTime).diff(startTime, 'second')
      await createTimeEntry({
        data: {
          matterId: activeTimer,
          userId: user?.id || '',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: duration.toString(),
          description,
        },
      })
      setActiveTimer(null)
      setStartTime(null)
      setDescription('')
      refetchTimeEntries()
      message.success('Time entry saved successfully')
    }
  }

  const handleVoiceMemo = () => {
    message.info('Voice memo functionality not implemented')
  }

  const handleBulkEntry = async () => {
    const entries = bulkEntries.split('\n').filter(entry => entry.trim())
    for (const entry of entries) {
      const [matterId, duration, desc] = entry
        .split(',')
        .map(item => item.trim())
      await createTimeEntry({
        data: {
          matterId,
          userId: user?.id || '',
          duration,
          description: desc,
        },
      })
    }
    setShowBulkEntry(false)
    setBulkEntries('')
    refetchTimeEntries()
    message.success('Bulk time entries saved successfully')
  }

  const approveTimeEntry = async (id: string) => {
    await updateTimeEntry({ where: { id }, data: {} })
    refetchTimeEntries()
    message.success('Time entry approved')
  }

  return (
    <PageLayout layout="full-width">
      <Card>
        <Title level={2}>Time Tracking</Title>
        <Paragraph>
          Track your time for specific tasks and manage your time entries.
        </Paragraph>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <SmartTimeTracker />

          {!activeTimer && (
            <Card title="Start Time Tracking">
              <Space>
                <Select
                  style={{ width: 200 }}
                  placeholder="Select a matter"
                  onChange={value => startTimer(value)}
                >
                  {matters?.map(matter => (
                    <Select.Option key={matter.id} value={matter.id}>
                      {matter.title}
                    </Select.Option>
                  ))}
                </Select>
                <Button type="primary" onClick={() => setShowBulkEntry(true)}>
                  <i className="las la-list"></i> Bulk Time Entry
                </Button>
                <Button onClick={handleVoiceMemo}>
                  <i className="las la-microphone"></i> Voice Memo
                </Button>
              </Space>
            </Card>
          )}

          {activeTimer && (
            <Card title="Active Time Tracking">
              <Space direction="vertical">
                <Text>
                  Time Elapsed: {startTime && dayjs().diff(startTime, 'second')}{' '}
                  seconds
                </Text>
                <Input.TextArea
                  placeholder="Enter description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <Button type="primary" onClick={stopTimer}>
                  <i className="las la-stop-circle"></i> Stop Timer
                </Button>
              </Space>
            </Card>
          )}

          <Card title="Recent Time Entries">
            <List
              dataSource={timeEntries}
              renderItem={entry => (
                <List.Item
                  actions={[
                    <Button onClick={() => approveTimeEntry(entry.id)}>
                      Approve
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={entry.matter?.title}
                    description={
                      <>
                        <Text>{entry.description}</Text>
                        <br />
                        <Text type="secondary">
                          Duration: {entry.duration} seconds
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Space>

        <Modal
          title="Bulk Time Entry"
          visible={showBulkEntry}
          onOk={handleBulkEntry}
          onCancel={() => setShowBulkEntry(false)}
        >
          <Input.TextArea
            rows={6}
            value={bulkEntries}
            onChange={e => setBulkEntries(e.target.value)}
            placeholder="Enter bulk time entries (one per line):&#10;MatterId, Duration, Description"
          />
        </Modal>

        <Modal
          title="Idle Detection"
          visible={idleDetected}
          onOk={stopTimer}
          onCancel={() => setIdleDetected(false)}
        >
          <p>
            You have been idle for 5 minutes. Do you want to stop the timer?
          </p>
        </Modal>
      </Card>
    </PageLayout>
  )
}
