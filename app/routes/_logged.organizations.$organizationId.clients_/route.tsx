import React, { useState, useEffect } from 'react'
import { Typography, Table, Button, Modal, Form, Input, message } from 'antd'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function ClientManagementPage() {
  const { organization } = useUserContext()
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const {
    data: clientsData,
    isLoading,
    refetch,
  } = Api.client.findMany.useQuery({
    where: { organizationId },
    include: { matters: true },
  })

  const { mutateAsync: createClient } = Api.client.create.useMutation()
  const { mutateAsync: updateClient } = Api.client.update.useMutation()

  useEffect(() => {
    if (clientsData) {
      setClients(clientsData)
    }
  }, [clientsData])

  const handleCreateClient = async values => {
    try {
      await createClient({
        data: {
          ...values,
          organizationId,
        },
      })
      message.success('Client created successfully')
      setIsModalVisible(false)
      form.resetFields()
      refetch()
    } catch (error) {
      message.error('Failed to create client')
    }
  }

  const handleUpdateClient = async (id, values) => {
    try {
      await updateClient({
        where: { id },
        data: values,
      })
      message.success('Client updated successfully')
      refetch()
    } catch (error) {
      message.error('Failed to update client')
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Matters',
      dataIndex: 'matters',
      key: 'matters',
      render: matters => matters?.length.toString() || '0',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          onClick={() =>
            navigate(
              `/organizations/${organizationId}/matters?clientId=${record.id}`,
            )
          }
        >
          View Matters
        </Button>
      ),
    },
  ]

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Title level={2}>
          <i className="las la-users"></i> Client Management
        </Title>
        <Text>Manage client relationships and view client-specific data</Text>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            <i className="las la-plus"></i> Add New Client
          </Button>
        </div>

        <Table
          dataSource={clients}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Add New Client"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateClient} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: 'Please input the client name!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'Please input a valid email!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Client
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
