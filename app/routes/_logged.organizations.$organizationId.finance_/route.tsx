import React, { useState } from 'react'
import {
  Typography,
  Table,
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  Select,
  Tabs,
} from 'antd'
const { Title, Text } = Typography
const { TabPane } = Tabs
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function FinancialManagementPage() {
  const { organizationId } = useParams()
  const { user, checkOrganizationRole } = useUserContext()
  const [activeTab, setActiveTab] = useState('1')

  const { data: expenses, isLoading: isLoadingExpenses } =
    Api.expense.findMany.useQuery({
      where: { matter: { organizationId } },
      include: { user: true, matter: true },
    })

  const { data: attorneys } = Api.user.findMany.useQuery({
    where: {
      organizationRoles: { some: { organizationId, name: 'attorney' } },
    },
  })

  const [expenseForm] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { mutateAsync: createExpense } = Api.expense.create.useMutation()

  const handleCreateExpense = async (values: any) => {
    await createExpense({
      data: {
        ...values,
        user: { connect: { id: user?.id } },
        matter: { connect: { id: values.matterId } },
      },
    })
    expenseForm.resetFields()
    setIsModalVisible(false)
  }

  const isFinancialAdmin = checkOrganizationRole('Financial Administrator')
  const isSeniorPartner = checkOrganizationRole('Senior Partner')
  const isManagingPartner = checkOrganizationRole('Managing Partner')

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <Title level={2}>
          <i className="las la-chart-line"></i> Financial Management
        </Title>
        <Text>Manage expenses and view financial information.</Text>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginTop: 24 }}
        >
          <TabPane tab="Expenses" key="1">
            <Button
              onClick={() => setIsModalVisible(true)}
              style={{ marginBottom: 16 }}
            >
              <i className="las la-plus"></i> Submit Expense
            </Button>

            <Table
              dataSource={expenses}
              loading={isLoadingExpenses}
              columns={[
                {
                  title: 'Description',
                  dataIndex: 'description',
                  key: 'description',
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: amount => `$${amount}`,
                },
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                  render: date => dayjs(date).format('YYYY-MM-DD'),
                },
                {
                  title: 'Matter',
                  dataIndex: ['matter', 'title'],
                  key: 'matter',
                },
                { title: 'User', dataIndex: ['user', 'name'], key: 'user' },
              ]}
            />

            <Modal
              title="Submit Expense"
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
            >
              <Form
                form={expenseForm}
                onFinish={handleCreateExpense}
                layout="vertical"
              >
                <Form.Item name="description" rules={[{ required: true }]}>
                  <Input placeholder="Description" />
                </Form.Item>
                <Form.Item name="amount" rules={[{ required: true }]}>
                  <InputNumber
                    placeholder="Amount"
                    min={0}
                    step={0.01}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item name="date" rules={[{ required: true }]}>
                  <Input type="date" />
                </Form.Item>
                <Form.Item name="matterId" rules={[{ required: true }]}>
                  <Select placeholder="Select Matter">
                    {/* Populate with actual matters */}
                    <Select.Option value="matter1">Matter 1</Select.Option>
                    <Select.Option value="matter2">Matter 2</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit Expense
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </TabPane>

          {(isSeniorPartner || isManagingPartner) && (
            <TabPane tab="Attorney Information" key="2">
              <Table
                dataSource={attorneys}
                columns={[
                  { title: 'Name', dataIndex: 'name', key: 'name' },
                  { title: 'Email', dataIndex: 'email', key: 'email' },
                  { title: 'Status', dataIndex: 'status', key: 'status' },
                  {
                    title: 'Global Role',
                    dataIndex: 'globalRole',
                    key: 'globalRole',
                  },
                ]}
              />
            </TabPane>
          )}
        </Tabs>
      </div>
    </PageLayout>
  )
}
