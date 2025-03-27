import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { useNavigate } from '@remix-run/react'
import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {
    Button,
    Card,
    Col,
    Divider,
    Modal,
    Row,
    Space,
    Table,
    Tabs,
    Tag,
    Typography,
    message,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

// Client Portal Page
export default function ClientPortalPage() {
  const { user } = useUserContext()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('1')
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)

  // Fetch client information based on user email
  const { data: client } = Api.client.findFirst.useQuery({
    where: { email: user?.email },
    include: { organization: true },
  })

  // Fetch invoices for this client
  const { data: invoices, refetch: refetchInvoices } = Api.invoice.findMany.useQuery(
    {
      where: { clientId: client?.id },
      include: {
        matter: true,
        organization: true,
        timeEntries: true,
        expenses: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    },
    {
      enabled: !!client?.id,
    }
  )

  // Fetch matters for this client
  const { data: matters } = Api.matter.findMany.useQuery(
    {
      where: { clientId: client?.id },
      include: { tasks: true },
    },
    {
      enabled: !!client?.id,
    }
  )

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

  // Columns for the invoices table
  const invoiceColumns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
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
            }}
          >
            View
          </Button>
          {(record.status === 'SENT' || record.status === 'OVERDUE') && (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setSelectedInvoice(record)
                setIsPaymentModalVisible(true)
              }}
            >
              Pay Now
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // Columns for the matters table
  const matterColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Tasks',
      key: 'tasks',
      render: (record: any) => `${record.tasks?.length || 0} tasks`,
    },
  ]

  // If no client is found, show a message
  if (!client) {
    return (
      <PageLayout layout="full-width">
        <Card style={{ maxWidth: 800, margin: '40px auto' }}>
          <Title level={2}>Client Portal</Title>
          <Paragraph>
            No client account is associated with your email address. Please
            contact your law firm for assistance.
          </Paragraph>
        </Card>
      </PageLayout>
    )
  }

  return (
    <PageLayout layout="full-width">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Card>
          <Title level={2}>Client Portal</Title>
          <Paragraph>
            Welcome to your client portal. Here you can view your matters,
            invoices, and make payments.
          </Paragraph>

          <Card style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Client:</Text> {client.name}
                <br />
                <Text strong>Email:</Text> {client.email}
                <br />
                {client.phone && (
                  <>
                    <Text strong>Phone:</Text> {client.phone}
                    <br />
                  </>
                )}
                {client.address && (
                  <>
                    <Text strong>Address:</Text> {client.address}
                    <br />
                  </>
                )}
              </Col>
              <Col span={12}>
                <Text strong>Law Firm:</Text> {client.organization?.name}
              </Col>
            </Row>
          </Card>

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Invoices" key="1">
              <Table
                columns={invoiceColumns}
                dataSource={invoices}
                rowKey="id"
              />
            </TabPane>
            <TabPane tab="Matters" key="2">
              <Table
                columns={matterColumns}
                dataSource={matters}
                rowKey="id"
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* View Invoice Modal */}
        {selectedInvoice && (
          <Modal
            title={`Invoice #${selectedInvoice.invoiceNumber}`}
            open={!isPaymentModalVisible && !!selectedInvoice} // Changed 'visible' to 'open' for antd compatibility
            onCancel={() => setSelectedInvoice(null)}
            footer={[
              <Button key="close" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>,
              (selectedInvoice.status === 'SENT' ||
                selectedInvoice.status === 'OVERDUE') && (
                <Button
                  key="pay"
                  type="primary"
                  onClick={() => setIsPaymentModalVisible(true)}
                >
                  Pay Now
                </Button>
              ),
            ]}
          >
            <Card>
              <Row gutter={16}>
                <Col span={12}>
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

              {selectedInvoice.payments?.length > 0 && (
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

        {/* Payment Modal with Stripe */}
        {selectedInvoice && client?.organization?.stripePublicKey && (
          <Elements stripe={loadStripe(client.organization.stripePublicKey)}>
            <PaymentModal
              open={isPaymentModalVisible}
              invoice={selectedInvoice}
              onCancel={() => {
                setIsPaymentModalVisible(false)
              }}
              onSuccess={() => {
                setIsPaymentModalVisible(false)
                setSelectedInvoice(null)
                refetchInvoices()
              }}
            />
          </Elements>
        )}
      </div>
    </PageLayout>
  )
}

// Payment Modal Component with Stripe integration
function PaymentModal({
  visible,
  invoice,
  onCancel,
  onSuccess,
}: {
  visible: boolean // Renamed to 'open' in the component call, but keeping param name for consistency
  invoice: any
  onCancel: () => void
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync: createPayment } = Api.payment.create.useMutation()
  const { mutateAsync: updateInvoice } = Api.invoice.update.useMutation()

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (!paymentMethod) {
        throw new Error('Payment method creation failed')
      }

      await createPayment({
        data: {
          invoiceId: invoice.id,
          amount: invoice.total,
          paymentMethod: 'CREDIT_CARD',
          paymentDate: new Date().toISOString(),
          transactionId: paymentMethod.id,
          notes: 'Paid online via client portal',
        },
      })

      await updateInvoice({
        where: { id: invoice.id },
        data: { status: 'PAID' },
      })

      message.success('Payment processed successfully')
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Payment processing failed')
      message.error('Payment processing failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Make Payment"
      open={visible} // Changed 'visible' to 'open' for antd compatibility
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          disabled={!stripe}
        >
          Pay ${invoice?.total}
        </Button>,
      ]}
    >
      <Card>
        <Paragraph>
          You are about to pay invoice #{invoice?.invoiceNumber} for $
          {invoice?.total}.
        </Paragraph>

        <div style={{ marginBottom: 20 }}>
          <Text strong>Card Information:</Text>
          <div
            style={{
              padding: '10px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              marginTop: '10px',
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

        <Paragraph type="secondary">
          Your payment information is securely processed by Stripe. We do not
          store your full credit card details.
        </Paragraph>
      </Card>
    </Modal>
  )
}