import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
} from 'antd'
import { useState } from 'react'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function MatterManagementPage() {
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const { user, checkOrganizationRole } = useUserContext()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const {
    data: matters,
    isLoading: mattersLoading,
    refetch: refetchMatters,
  } = Api.matter.findMany.useQuery({
    where: { organizationId },
    include: { client: true },
  })

  const { data: clients } = Api.client.findMany.useQuery({
    where: { organizationId },
  })

  const { mutateAsync: createMatter } = Api.matter.create.useMutation()

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'name'],
      key: 'client',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button
            onClick={() =>
              navigate(`/organizations/${organizationId}/matters/${record.id}`)
            }
          >
            View
          </Button>
        </Space>
      ),
    },
  ]

  const handleCreateMatter = async (values: any) => {
    try {
      await createMatter({
        data: {
          ...values,
          organizationId,
        },
      })
      message.success('Matter created successfully')
      setIsModalVisible(false)
      form.resetFields()
      refetchMatters()
    } catch (error) {
      message.error('Failed to create matter')
    }
  }

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Title level={2}>
          <i className="las la-briefcase" style={{ marginRight: '10px' }}></i>
          Matter Management
        </Title>
        <Text>
          Manage your legal matters and associate them with clients and team
          members.
        </Text>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          {(checkOrganizationRole('owner') || user?.globalRole === 'ADMIN') && (
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              <i className="las la-plus" style={{ marginRight: '5px' }}></i>
              Create New Matter
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={matters}
          loading={mattersLoading}
          rowKey="id"
        />

        <Modal
          title="Create New Matter"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateMatter} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: 'Please input the matter title!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[
                { required: true, message: 'Please select the matter status!' },
              ]}
            >
              <Select>
                <Select.Option value="Open">Open</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Closed">Closed</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="clientId"
              label="Client"
              rules={[{ required: true, message: 'Please select a client!' }]}
            >
              <Select>
                {clients?.map(client => (
                  <Select.Option key={client.id} value={client.id}>
                    {client.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Matter
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
