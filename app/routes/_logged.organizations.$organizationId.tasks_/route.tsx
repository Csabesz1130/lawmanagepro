import React, { useState, useEffect } from 'react'
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from 'antd'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function TaskManagementPage() {
  const { organizationId } = useParams()
  const { user, checkOrganizationRole } = useUserContext()
  const [tasks, setTasks] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [selectedTask, setSelectedTask] = useState(null)

  const { data: matters } = Api.matter.findMany.useQuery({
    where: { organizationId },
  })
  const { data: users } = Api.user.findMany.useQuery({})

  const { data: tasksData, refetch: refetchTasks } = Api.task.findMany.useQuery(
    {
      where: { matter: { organizationId } },
      include: { assignedUser: true, matter: true },
    },
  )

  const { mutateAsync: createTask } = Api.task.create.useMutation()
  const { mutateAsync: updateTask } = Api.task.update.useMutation()
  const { mutateAsync: deleteTask } = Api.task.delete.useMutation()

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData)
    }
  }, [tasksData])

  const showModal = (task = null) => {
    setSelectedTask(task)
    if (task) {
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      })
    } else {
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedTask(null)
  }

  const handleSubmit = async values => {
    try {
      if (selectedTask) {
        await updateTask({
          where: { id: selectedTask.id },
          data: { ...values, dueDate: values.dueDate?.format('YYYY-MM-DD') },
        })
        message.success('Task updated successfully')
      } else {
        await createTask({
          data: {
            ...values,
            dueDate: values.dueDate?.format('YYYY-MM-DD'),
            matter: { connect: { id: values.matterId } },
            assignedUser: values.assignedUserId
              ? { connect: { id: values.assignedUserId } }
              : undefined,
          },
        })
        message.success('Task created successfully')
      }
      refetchTasks()
      handleCancel()
    } catch (error) {
      message.error('An error occurred')
    }
  }

  const handleDelete = async id => {
    try {
      await deleteTask({ where: { id } })
      message.success('Task deleted successfully')
      refetchTasks()
    } catch (error) {
      message.error('An error occurred')
    }
  }

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: date => date && dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Assigned To',
      dataIndex: ['assignedUser', 'name'],
      key: 'assignedUser',
    },
    { title: 'Matter', dataIndex: ['matter', 'title'], key: 'matter' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ]

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Title level={2}>
          <i className="las la-tasks"></i> Task Management
        </Title>
        <Text>Create, assign, and track tasks related to specific matters</Text>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Button
            type="primary"
            onClick={() => showModal()}
            icon={<i className="las la-plus"></i>}
          >
            Create New Task
          </Button>
        </div>

        <Table columns={columns} dataSource={tasks} rowKey="id" />

        <Modal
          title={selectedTask ? 'Edit Task' : 'Create New Task'}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="Not Started">Not Started</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker />
            </Form.Item>
            <Form.Item name="assignedUserId" label="Assigned To">
              <Select>
                {users?.map(user => (
                  <Select.Option key={user.id} value={user.id}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="matterId"
              label="Matter"
              rules={[{ required: true }]}
            >
              <Select>
                {matters?.map(matter => (
                  <Select.Option key={matter.id} value={matter.id}>
                    {matter.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {selectedTask ? 'Update' : 'Create'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
