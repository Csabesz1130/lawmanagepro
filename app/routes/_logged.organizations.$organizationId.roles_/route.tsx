import React, { useState, useEffect } from 'react'
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from 'antd'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function RoleManagementPage() {
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const { user, checkOrganizationRole } = useUserContext()
  const [roles, setRoles] = useState<any[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingRole, setEditingRole] = useState<any>(null)

  const { data: rolesData, refetch: refetchRoles } =
    Api.roleData.findMany.useQuery({})
  const { mutateAsync: createRole } = Api.roleData.create.useMutation()
  const { mutateAsync: updateRole } = Api.roleData.update.useMutation()
  const { mutateAsync: deleteRole } = Api.roleData.delete.useMutation()

  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData)
    }
  }, [rolesData])

  const showModal = (role?: any) => {
    setEditingRole(role)
    form.setFieldsValue(role || {})
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingRole) {
        await updateRole({ where: { id: editingRole.id }, data: values })
      } else {
        await createRole({ data: values })
      }
      message.success(
        `Role ${editingRole ? 'updated' : 'created'} successfully`,
      )
      setIsModalVisible(false)
      form.resetFields()
      refetchRoles()
    } catch (error) {
      console.error('Error saving role:', error)
      message.error('Failed to save role')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteRole({ where: { id } })
      message.success('Role deleted successfully')
      refetchRoles()
    } catch (error) {
      console.error('Error deleting role:', error)
      message.error('Failed to delete role')
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            <i className="las la-edit"></i> Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              <i className="las la-trash-alt"></i> Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  if (!checkOrganizationRole('owner') && user?.globalRole !== 'ADMIN') {
    return (
      <PageLayout layout="full-width">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Title level={3}>Access Denied</Title>
          <Text>You do not have permission to view this page.</Text>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Title level={2}>
          <i className="las la-user-tag"></i> Role Management
        </Title>
        <Text>Manage roles and permissions within the system</Text>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Button type="primary" onClick={() => showModal()}>
            <i className="las la-plus"></i> Create New Role
          </Button>
        </div>

        <Table columns={columns} dataSource={roles} rowKey="id" />

        <Modal
          title={editingRole ? 'Edit Role' : 'Create New Role'}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Role Name"
              rules={[
                { required: true, message: 'Please input the role name!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}
