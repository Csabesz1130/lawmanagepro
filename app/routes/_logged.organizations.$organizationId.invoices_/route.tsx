import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useNavigate, useParams } from '@remix-run/react'
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
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
import InvoicePDF from './InvoicePDF'
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

export default function InvoicesPage() {
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const { user, checkOrganizationRole } = useUserContext()
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<string[]>([])
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [form] = Form.useForm()
  const [paymentForm] = Form.useForm()

  // Fetch invoices
  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices,
  } = Api.invoice.findMany.useQuery({
    where: { organizationId },
    include: {
      client: true,
      matter: true,
      timeEntries: { include: { user: true } },
      expenses: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch matters for the organization
  const { data: matters } = Api.matter.findMany.useQuery({
    where: { organizationId },
    include: { client: true },
  })

  // Fetch unbilled time entries
  const { data: unbilledTimeEntries } = Api.timeEntry.findMany.useQuery({
    where: {
      matter: { organizationId },
      invoiceId: null,
    },
    include: { user: true, matter: true },
  })

  // Fetch unbilled expenses
  const { data: unbilledExpenses } = Api.expense.findMany.useQuery({
    where: {
      matter: { organizationId },
      invoiceId: null,
    },
    include: { user: true, matter: true },
  })

  // Mutations
  const { mutateAsync: createInvoice } = Api.invoice.create.useMutation()
  const { mutateAsync: updateInvoice } = Api.invoice.update.useMutation()
  const { mutateAsync: updateTimeEntry } = Api.timeEntry.update.useMutation()
  const { mutateAsync: updateExpense } = Api.expense.update.useMutation()
  const { mutateAsync: createPayment } = Api.payment.create.useMutation()

  // Generate a unique invoice number
  const generateInvoiceNumber = () => {
    const prefix = 'INV'
    const timestamp = new Date().getTime().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${timestamp}-${random}`
  }

  // Calculate total amount from selected time entries and expenses
  const calculateTotal = () => {
    let total = 0

    // Add time entries
    if (unbilledTimeEntries) {
      selectedTimeEntries.forEach(id => {
        const entry = unbilledTimeEntries.find(e => e.id === id)
        if (entry && entry.amount) {
          total += parseFloat(entry.amount)
        }
      })
    }

    // Add expenses
    if (unbilledExpenses) {
      selectedExpenses.forEach(id => {
        const expense = unbilledExpenses.find(e => e.id === id)
        if (expense && expense.amount) {
          total += parseFloat(expense.amount)
        }
      })
    }

    return total.toFixed(2)
  }

  // Handle creating a new invoice
  const handleCreateInvoice = async (values: any) => {
    try {
      const invoiceNumber = generateInvoiceNumber()
      const amount = calculateTotal()
      const taxRate = values.taxRate ? parseFloat(values.taxRate) / 100 : 0
      const taxAmount = (parseFloat(amount) * taxRate).toFixed(2)
      const total = (parseFloat(amount) + parseFloat(taxAmount)).toFixed(2)

      // Get client ID from the selected matter
      const selectedMatter = matters?.find(m => m.id === values.matterId)
      if (!selectedMatter) {
        message.error('Selected matter not found')
        return
      }

      // Create the invoice
      const invoice = await createInvoice({
        data: {
          invoiceNumber,
          matterId: values.matterId,
          clientId: selectedMatter.clientId,
          organizationId,
          amount,
          tax: taxAmount,
          total,
          status: 'DRAFT',
          dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : undefined,
          notes: values.notes,
        },
      })

      // Update time entries with invoice ID
      for (const entryId of selectedTimeEntries) {
        await updateTimeEntry({
          where: { id: entryId },
          data: { invoiceId: invoice.id },
        })
      }

      // Update expenses with invoice ID
      for (const expenseId of selectedExpenses) {
        await updateExpense({
          where: { id: expenseId },
          data: { invoiceId: invoice.id },
        })
      }

      message.success('Invoice created successfully')
      setIsCreateModalVisible(false)
      form.resetFields()
      setSelectedTimeEntries([])
      setSelectedExpenses([])
      refetchInvoices()
    } catch (error) {
      console.error('Error creating invoice:', error)
      message.error('Failed to create invoice')
    }
  }

  // Handle sending an invoice
  const handleSendInvoice = async (invoice: any) => {
    try {
      await updateInvoice({
        where: { id: invoice.id },
        data: { status: 'SENT' },
      })
      message.success('Invoice marked as sent')
      refetchInvoices()
    } catch (error) {
      message.error('Failed to update invoice status')
    }
  }

  // Handle recording a payment
  const handleRecordPayment = async (values: any) => {
    try {
      if (!selectedInvoice) return

      await createPayment({
        data: {
          invoiceId: selectedInvoice.id,
          amount: values.amount,
          paymentMethod: values.paymentMethod,
          paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD') : new Date().toISOString(),
          transactionId: values.transactionId,
          notes: values.notes,
        },
      })

      // Check if payment covers the full amount
      const totalPaid = selectedInvoice.payments.reduce(
        (sum: number, payment: any) => sum + parseFloat(payment.amount),
        parseFloat(values.amount)
      )

      if (totalPaid >= parseFloat(selectedInvoice.total)) {
        await updateInvoice({
          where: { id: selectedInvoice.id },
          data: { status: 'PAID' },
        })
      }

      message.success('Payment recorded successfully')
      setIsPaymentModalVisible(false)
      paymentForm.resetFields()
      refetchInvoices()
    } catch (error) {
      message.error('Failed to record payment')
    }
  }

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

  // Check if user has permission to manage invoices
  const canManageInvoices =
    checkOrganizationRole('owner') ||
    checkOrganizationRole('Financial Administrator') ||
    user?.globalRole === 'ADMIN'

  // Columns for the invoices table
  const invoiceColumns = [
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
      render: (total: string) => `$${total}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => {
              setSelectedInvoice(record)
              setIsViewModalVisible(true)
            }}
          >
            View
          </Button>
          {record.status !== 'PAID' && record.status !== 'CANCELLED' && (
            <>
              {record.status === 'DRAFT' && (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => handleSendInvoice(record)}
                >
                  Send
                </Button>
              )}
              <Button
                size="small"
                onClick={() => {
                  setSelectedInvoice(record)
                  setIsPaymentModalVisible(true)
                }}
              >
                Record Payment
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  // Columns for time entries selection
  const timeEntryColumns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: string) => `${duration} seconds`,
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'Matter',
      dataIndex: ['matter', 'title'],
      key: 'matter',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (amount ? `$${amount}` : '-'),
    },
  ]

  // Columns for expenses selection
  const expenseColumns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => `$${amount}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
  ]

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Title level={2}>
          <i className="las la-file-invoice-dollar" style={{ marginRight: '10px' }}></i>
          Invoices
        </Title>
        <Text>
          Generate and manage invoices for your clients based on time entries and
          expenses.
        </Text>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          {canManageInvoices && (
            <Button
              type="primary"
              onClick={() => setIsCreateModalVisible(true)}
            >
              <i className="las la-plus" style={{ marginRight: '5px' }}></i>
              Create New Invoice
            </Button>
          )}
        </div>

        <Table
          columns={invoiceColumns}
          dataSource={invoices}
          loading={isLoadingInvoices}
          rowKey="id"
        />

        {/* Create Invoice Modal */}
        <Modal
          title="Create New Invoice"
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false)
            form.resetFields()
            setSelectedTimeEntries([])
            setSelectedExpenses([])
          }}
          width={1000}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateInvoice} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="matterId"
                  label="Matter"
                  rules={[{ required: true, message: 'Please select a matter' }]}
                >
                  <Select placeholder="Select Matter">
                    {matters?.map(matter => (
                      <Select.Option key={matter.id} value={matter.id}>
                        {matter.title} ({matter.client?.name})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dueDate"
                  label="Due Date"
                  rules={[{ required: true, message: 'Please select a due date' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="taxRate"
                  label="Tax Rate (%)"
                  initialValue="0"
                >
                  <Input type="number" min="0" max="100" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Statistic
                  title="Total Amount"
                  value={`$${calculateTotal()}`}
                  style={{ marginBottom: '24px' }}
                />
              </Col>
            </Row>

            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Divider>Select Time Entries</Divider>

            <Table
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => {
                  setSelectedTimeEntries(selectedRowKeys as string[])
                },
              }}
              columns={timeEntryColumns}
              dataSource={unbilledTimeEntries}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5 }}
            />

            <Divider>Select Expenses</Divider>

            <Table
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => {
                  setSelectedExpenses(selectedRowKeys as string[])
                },
              }}
              columns={expenseColumns}
              dataSource={unbilledExpenses}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5 }}
            />

            <Form.Item style={{ marginTop: '20px' }}>
              <Button type="primary" htmlType="submit">
                Create Invoice
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Invoice Modal */}
        {selectedInvoice && (
          <Modal
            title={`Invoice #${selectedInvoice.invoiceNumber}`}
            open={isViewModalVisible}
            onCancel={() => setIsViewModalVisible(false)}
            width={800}
            footer={[
              <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                Close
              </Button>,
              <PDFDownloadLink
                document={<InvoicePDF invoice={selectedInvoice} />}
                fileName={`Invoice-${selectedInvoice.invoiceNumber}.pdf`}
                key="download"
              >
                {({ loading }) => (
                  <Button type="primary" loading={loading}>
                    <i className="las la-download" style={{ marginRight: '5px' }}></i>
                    Download PDF
                  </Button>
                )}
              </PDFDownloadLink>,
            ]}
          >
            <Card>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Client:</Text> {selectedInvoice.client?.name}
                  <br />
                  <Text strong>Matter:</Text> {selectedInvoice.matter?.title}
                  <br />
                  <Text strong>Status:</Text>{' '}
                  <Tag color={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Amount:</Text> ${selectedInvoice.amount}
                  <br />
                  <Text strong>Tax:</Text> ${selectedInvoice.tax || '0.00'}
                  <br />
                  <Text strong>Total:</Text> ${selectedInvoice.total}
                  <br />
                  <Text strong>Due Date:</Text>{' '}
                  {selectedInvoice.dueDate
                    ? dayjs(selectedInvoice.dueDate).format('YYYY-MM-DD')
                    : '-'}
                </Col>
              </Row>

              {selectedInvoice.notes && (
                <>
                  <Divider />
                  <Text strong>Notes:</Text>
                  <Paragraph>{selectedInvoice.notes}</Paragraph>
                </>
              )}

              <Divider>Time Entries</Divider>
              <Table
                columns={[
                  { title: 'Description', dataIndex: 'description', key: 'description' },
                  {
                    title: 'Duration',
                    dataIndex: 'duration',
                    key: 'duration',
                    render: (duration: string) => `${duration} seconds`,
                  },
                  { title: 'User', dataIndex: ['user', 'name'], key: 'user' },
                  {
                    title: 'Amount',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (amount: string) => (amount ? `$${amount}` : '-'),
                  },
                ]}
                dataSource={selectedInvoice.timeEntries}
                rowKey="id"
                size="small"
                pagination={false}
              />

              <Divider>Expenses</Divider>
              <Table
                columns={[
                  { title: 'Description', dataIndex: 'description', key: 'description' },
                  {
                    title: 'Amount',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (amount: string) => `$${amount}`,
                  },
                  {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                    render: (date: string) =>
                      date ? dayjs(date).format('YYYY-MM-DD') : '-',
                  },
                ]}
                dataSource={selectedInvoice.expenses}
                rowKey="id"
                size="small"
                pagination={false}
              />

              {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
                <>
                  <Divider>Payments</Divider>
                  <Table
                    columns={[
                      {
                        title: 'Amount',
                        dataIndex: 'amount',
                        key: 'amount',
                        render: (amount: string) => `$${amount}`,
                      },
                      { title: 'Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
                      {
                        title: 'Date',
                        dataIndex: 'paymentDate',
                        key: 'paymentDate',
                        render: (date: string) =>
                          date ? dayjs(date).format('YYYY-MM-DD') : '-',
                      },
                      { title: 'Status', dataIndex: 'status', key: 'status' },
                    ]}
                    dataSource={selectedInvoice.payments}
                    rowKey="id"
                    size="small"
                    pagination={false}
                  />
                </>
              )}
            </Card>
          </Modal>
        )}

        {/* Record Payment Modal */}
        {selectedInvoice && (
          <Modal
            title={`Record Payment for Invoice #${selectedInvoice.invoiceNumber}`}
            open={isPaymentModalVisible}
            onCancel={() => {
              setIsPaymentModalVisible(false)
              paymentForm.resetFields()
            }}
            footer={null}
          >
            <Form
              form={paymentForm}
              onFinish={handleRecordPayment}
              layout="vertical"
            >
              <Form.Item
                name="amount"
                label="Payment Amount"
                rules={[{ required: true, message: 'Please enter payment amount' }]}
                initialValue={selectedInvoice.total}
              >
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  addonBefore="$"
                />
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Payment Method"
                rules={[{ required: true, message: 'Please select payment method' }]}
              >
                <Select placeholder="Select Payment Method">
                  <Select.Option value="CREDIT_CARD">Credit Card</Select.Option>
                  <Select.Option value="BANK_TRANSFER">Bank Transfer</Select.Option>
                  <Select.Option value="CHECK">Check</Select.Option>
                  <Select.Option value="CASH">Cash</Select.Option>
                  <Select.Option value="OTHER">Other</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="paymentDate"
                label="Payment Date"
                rules={[{ required: true, message: 'Please select payment date' }]}
                initialValue={dayjs()}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>

              <Form.Item name="transactionId" label="Transaction ID">
                <Input />
              </Form.Item>

              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Record Payment
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    </PageLayout>
  )
}