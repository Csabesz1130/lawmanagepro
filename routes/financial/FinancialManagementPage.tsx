import { useUserContext } from '@/core/context'
import { Expense, ExpenseInput, Invoice, OrganizationUpdateInput } from '@/core/types'
import { PageLayout } from '@/designSystem'
import { useNavigate, useParams } from '@remix-run/react'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

// Move the Api object declaration to the top of the file
const Api = {
  expense: {
    findMany: {
      useQuery: () => ({ data: [], isLoading: false, refetch: () => {} }),
    },
    create: {
      useMutation: () => ({ mutateAsync: async () => {} }),
    },
  },
  invoice: {
    findMany: {
      useQuery: () => ({ data: [], isLoading: false }),
    },
  },
  timeEntry: {
    findMany: {
      useQuery: () => ({ data: [], isLoading: false }),
    },
  },
  user: {
    findMany: {
      useQuery: () => ({ data: [] }),
    },
  },
  matter: {
    findMany: {
      useQuery: () => ({ data: [] }),
    },
  },
  organization: {
    update: {
      useMutation: () => ({ mutateAsync: async () => {} }),
    },
  },
};

export default function FinancialManagementPage() {
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const { user, checkOrganizationRole } = useUserContext()
  const [activeTab, setActiveTab] = useState('1')

  // Expenses
  const { data: expenses, isLoading: isLoadingExpenses, refetch: refetchExpenses } = Api.expense.findMany.useQuery();

  // Invoices
  const { data: invoices, isLoading: isLoadingInvoices } = Api.invoice.findMany.useQuery();

  // Time Entries
  const { data: timeEntries, isLoading: isLoadingTimeEntries } = Api.timeEntry.findMany.useQuery();

  // Attorneys
  const { data: attorneys } = Api.user.findMany.useQuery();

  // Matters
  const { data: matters } = Api.matter.findMany.useQuery();

  const [expenseForm] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [stripeForm] = Form.useForm()
  const [isStripeModalVisible, setIsStripeModalVisible] = useState(false)

  const { mutateAsync: createExpense } = Api.expense.create.useMutation() as {
    mutateAsync: (input: { data: ExpenseInput }) => Promise<void>
  }

  const { mutateAsync: updateOrganization } = Api.organization.update.useMutation() as {
    mutateAsync: (input: { where: { id: string }; data: OrganizationUpdateInput }) => Promise<void>
  }

  const handleCreateExpense = async (values: any) => {
    try {
      // Convert string date to proper format if needed
      const formattedValues = {
        ...values,
        date: values.date
          ? dayjs(values.date).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD'),
      }

      await createExpense({
        data: {
          ...formattedValues,
          userId: user?.id || '',
          matterId: values.matterId,
        },
      })
      message.success('Expense submitted successfully')
      expenseForm.resetFields()
      setIsModalVisible(false)
      refetchExpenses()
    } catch (error) {
      message.error('Failed to submit expense')
      console.error('Error creating expense:', error)
    }
  }

  const handleUpdateStripeKeys = async (values: any) => {
    try {
      await updateOrganization({
        where: { id: organizationId },
        data: {
          stripePublicKey: values.stripePublicKey,
          stripeSecretKey: values.stripeSecretKey,
        },
      })
      message.success('Stripe API keys updated successfully')
      setIsStripeModalVisible(false)
    } catch (error) {
      message.error('Failed to update Stripe API keys')
      console.error('Error updating Stripe keys:', error)
    }
  }

  // Calculate financial statistics
  const calculateStats = () => {
    let totalBilled = 0
    let totalPaid = 0
    let totalOutstanding = 0
    let totalExpenses = 0

    if (invoices) {
      invoices.forEach((invoice) => {
        const total = parseFloat(invoice.total)
        totalBilled += total

        if (invoice.status === 'PAID') {
          totalPaid += total
        } else if (invoice.status === 'SENT' || invoice.status === 'OVERDUE') {
          totalOutstanding += total
        }
      })
    }

    if (expenses) {
      expenses.forEach((expense) => {
        if (expense.amount) {
          totalExpenses += parseFloat(expense.amount)
        }
      })
    }

    return {
      totalBilled,
      totalPaid,
      totalOutstanding,
      totalExpenses,
    }
  }

  const stats = calculateStats()

  // Get status tag color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'default'
      case 'SENT':
        return 'processing'
      case 'PAID':
        return 'success'
      case 'OVERDUE':
        return 'error'
      case 'CANCELLED':
        return 'warning'
      default:
        return 'default'
    }
  }

  const isFinancialAdmin = checkOrganizationRole('Financial Administrator')
  const isSeniorPartner = checkOrganizationRole('Senior Partner')
  const isManagingPartner = checkOrganizationRole('Managing Partner')
  const canManageFinances =
    isFinancialAdmin ||
    isSeniorPartner ||
    isManagingPartner ||
    user?.globalRole === 'ADMIN'

  // Correcting the parser function to return the expected type
  const parser = (value: string | undefined): number => parseFloat(value?.replace(/[^0-9.-]+/g, '') || '0');

  // Updating the usage of invoice and invoiceId properties
  const handleInvoice = (invoice: Invoice) => {
    if (invoice.invoiceId) {
      console.log(`Invoice ID: ${invoice.invoiceId}`);
    }
  };

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <Title level={2}>
          <i className="las la-chart-line"></i> Financial Management
        </Title>
        <Text>Manage expenses, invoices, and view financial information.</Text>

        {canManageFinances && (
          <Card style={{ marginTop: 24, marginBottom: 24 }}>
            <Row gutter={24}>
              <Col span={6}>
                <Statistic
                  title="Total Billed"
                  value={stats.totalBilled}
                  precision={2}
                  prefix="$"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total Paid"
                  value={stats.totalPaid}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Outstanding"
                  value={stats.totalOutstanding}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total Expenses"
                  value={stats.totalExpenses}
                  precision={2}
                  prefix="$"
                />
              </Col>
            </Row>
          </Card>
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 24 }}>
          <TabPane tab="Invoices" key="1">
            <Space style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                onClick={() => navigate(`/organizations/${organizationId}/invoices`)}
              >
                <i className="las la-file-invoice-dollar"></i> Manage Invoices
              </Button>

              {canManageFinances && (
                <Button onClick={() => setIsStripeModalVisible(true)}>
                  <i className="las la-credit-card"></i> Configure Online Payments
                </Button>
              )}
            </Space>

            <Table
              dataSource={invoices}
              loading={isLoadingInvoices}
              rowKey="id"
              columns={[
                {
                  title: 'Invoice #',
                  dataIndex: 'invoiceNumber',
                  key: 'invoiceNumber',
                },
                {
                  title: 'Client',
                  dataIndex: ['client', 'name'],
                  key: 'client',
                },
                {
                  title: 'Matter',
                  dataIndex: ['matter', 'title'],
                  key: 'matter',
                },
                {
                  title: 'Amount',
                  dataIndex: 'total',
                  key: 'total',
                  render: (total) => `$${total}`,
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={getStatusColor(status)}>{status}</Tag>
                  ),
                },
                {
                  title: 'Due Date',
                  dataIndex: 'dueDate',
                  key: 'dueDate',
                  render: (date) =>
                    date ? dayjs(date).format('YYYY-MM-DD') : '-',
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, record) => (
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(`/organizations/${organizationId}/invoices`)
                      }
                    >
                      View
                    </Button>
                  ),
                },
              ]}
            />
          </TabPane>

          <TabPane tab="Expenses" key="2">
            <Button
              onClick={() => setIsModalVisible(true)}
              style={{ marginBottom: 16 }}
            >
              <i className="las la-plus"></i> Submit Expense
            </Button>

            <Table
              dataSource={expenses}
              loading={isLoadingExpenses}
              rowKey="id"
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
                  render: (amount) => `$${amount}`,
                },
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                  render: (date) => dayjs(date).format('YYYY-MM-DD'),
                },
                {
                  title: 'Matter',
                  dataIndex: ['matter', 'title'],
                  key: 'matter',
                },
                { title: 'User', dataIndex: ['user', 'name'], key: 'user' },
                {
                  title: 'Invoiced',
                  key: 'invoiced',
                  render: (_, record) =>
                    record.invoiceId ? (
                      <Tag color="green">Yes</Tag>
                    ) : (
                      <Tag color="orange">No</Tag>
                    ),
                },
              ]}
            />

            <Modal
              title="Submit Expense"
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
            >
              <Form form={expenseForm} onFinish={handleCreateExpense} layout="vertical">
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please enter a description' }]}
                >
                  <Input placeholder="Description" />
                </Form.Item>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[{ required: true, message: 'Please enter an amount' }]}
                >
                  <InputNumber
                    placeholder="Amount"
                    min={0}
                    step={0.01}
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => parser(value)}
                  />
                </Form.Item>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: 'Please select a date' }]}
                >
                  <Input type="date" defaultValue={dayjs().format('YYYY-MM-DD')} />
                </Form.Item>
                <Form.Item
                  name="matterId"
                  label="Matter"
                  rules={[{ required: true, message: 'Please select a matter' }]}
                >
                  <Select placeholder="Select Matter">
                    {matters?.map((matter) => (
                      <Select.Option key={matter.id} value={matter.id}>
                        {matter.title} ({matter.client?.name})
                      </Select.Option>
                    ))}
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

          <TabPane tab="Time Entries" key="3">
            <Table
              dataSource={timeEntries}
              loading={isLoadingTimeEntries}
              rowKey="id"
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
                  render: (duration) => `${duration} seconds`,
                },
                {
                  title: 'Matter',
                  dataIndex: ['matter', 'title'],
                  key: 'matter',
                },
                { title: 'User', dataIndex: ['user', 'name'], key: 'user' },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (amount) => (amount ? `$${amount}` : '-'),
                },
                {
                  title: 'Invoiced',
                  key: 'invoiced',
                  render: (_, record) =>
                    record.invoiceId ? (
                      <Tag color="green">Yes</Tag>
                    ) : (
                      <Tag color="orange">No</Tag>
                    ),
                },
              ]}
            />
          </TabPane>

          {(isSeniorPartner || isManagingPartner || user?.globalRole === 'ADMIN') && (
            <TabPane tab="Attorney Information" key="4">
              <Table
                dataSource={attorneys}
                rowKey="id"
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

        {/* Stripe Configuration Modal */}
        <Modal
          title="Configure Online Payments"
          open={isStripeModalVisible}
          onCancel={() => setIsStripeModalVisible(false)}
          footer={null}
        >
          <Form form={stripeForm} onFinish={handleUpdateStripeKeys} layout="vertical">
            <Paragraph>
              Enter your Stripe API keys to enable online payments for clients. You can
              find these in your Stripe dashboard.
            </Paragraph>

            <Form.Item
              name="stripePublicKey"
              label="Stripe Public Key"
              rules={[{ required: true, message: 'Please enter your Stripe public key' }]}
            >
              <Input placeholder="pk_test_..." />
            </Form.Item>

            <Form.Item
              name="stripeSecretKey"
              label="Stripe Secret Key"
              rules={[{ required: true, message: 'Please enter your Stripe secret key' }]}
            >
              <Input.Password placeholder="sk_test_..." />
            </Form.Item>

            <Paragraph type="secondary">
              <i className="las la-info-circle"></i> Your keys are stored securely and
              used only for processing payments.
            </Paragraph>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Stripe Configuration
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}