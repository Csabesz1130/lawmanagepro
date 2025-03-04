import React, { useState, useEffect } from 'react'
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
} from 'antd'
import { Prisma } from '@prisma/client'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function ResourceAllocationPage() {
  const { organizationId } = useParams()
  const { user, checkOrganizationRole } = useUserContext()
  const [resources, setResources] = useState<
    Prisma.UserGetPayload<{ include: { organizationRoles: true } }>[]
  >([])
  const [matters, setMatters] = useState<
    Prisma.MatterGetPayload<{ include: { tasks: true } }>[]
  >([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const isPracticeAreaLeader = checkOrganizationRole('Practice Area Leader')
  const isSuperAdmin = user?.globalRole === 'ADMIN'
  const isAttorney = !isPracticeAreaLeader && !isSuperAdmin

  const { data: usersData, isLoading: isLoadingUsers } =
    Api.user.findMany.useQuery({
      where: { organizationRoles: { some: { organizationId } } },
      include: { organizationRoles: true },
    })

  const { data: mattersData, isLoading: isLoadingMatters } =
    Api.matter.findMany.useQuery({
      where: { organizationId },
      include: { tasks: true },
    })

  const { mutateAsync: updateTask } = Api.task.update.useMutation()

  useEffect(() => {
    if (usersData) setResources(usersData)
    if (mattersData) setMatters(mattersData)
  }, [usersData, mattersData])

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (_, record) => record.organizationRoles[0]?.name || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => showModal(record)} disabled={isAttorney}>
          <i className="las la-tasks"></i> Allocate
        </Button>
      ),
    },
  ]

  const showModal = resource => {
    form.setFieldsValue({ userId: resource.id })
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await updateTask({
        where: { id: values.taskId },
        data: { assignedUserId: values.userId },
      })
      message.success('Resource allocated successfully')
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Failed to allocate resource:', error)
      message.error('Failed to allocate resource')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleResourceRequest = () => {
    message.info('Resource request submitted')
  }

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Title level={2}>
          <i className="las la-users"></i> Resource Allocation
        </Title>
        <Text>
          Manage and allocate resources across different matters and teams.
        </Text>

        {isAttorney && (
          <Button
            onClick={handleResourceRequest}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            <i className="las la-hand-paper"></i> Request Additional Resources
          </Button>
        )}

        <Table
          columns={columns}
          dataSource={resources}
          loading={isLoadingUsers}
          rowKey="id"
          style={{ marginTop: '20px' }}
        />

        <Modal
          title="Allocate Resource"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="userId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="matterId"
              label="Matter"
              rules={[{ required: true, message: 'Please select a matter' }]}
            >
              <Select>
                {matters?.map(matter => (
                  <Select.Option key={matter.id} value={matter.id}>
                    {matter.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="taskId"
              label="Task"
              rules={[{ required: true, message: 'Please select a task' }]}
            >
              <Select>
                {matters?.flatMap(matter =>
                  matter.tasks.map(task => (
                    <Select.Option key={task.id} value={task.id}>
                      {task.title}
                    </Select.Option>
                  )),
                )}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
