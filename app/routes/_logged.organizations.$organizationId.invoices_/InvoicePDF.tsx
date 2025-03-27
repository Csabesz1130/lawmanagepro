import {
    Document,
    Page,
    StyleSheet,
    Text,
    View
} from '@react-pdf/renderer'
import dayjs from 'dayjs'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  invoiceNumber: {
    fontSize: 12,
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoColumn: {
    flexDirection: 'column',
    width: '48%',
  },
  label: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
  },
  tableCol: {
    width: '25%',
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 5,
  },
  totals: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
  notes: {
    marginTop: 40,
    fontSize: 10,
    color: '#666666',
  },
})

// Create Document Component
const InvoicePDF = ({ invoice }: { invoice: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Text style={styles.invoiceNumber}>
          Invoice #: {invoice.invoiceNumber}
        </Text>
        <Text style={styles.invoiceNumber}>
          Date: {dayjs().format('MMMM D, YYYY')}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoColumn}>
          <Text style={styles.label}>FROM:</Text>
          <Text style={styles.value}>{invoice.organization?.name}</Text>

          <Text style={styles.label}>TO:</Text>
          <Text style={styles.value}>{invoice.client?.name}</Text>
          {invoice.client?.address && (
            <Text style={styles.value}>{invoice.client.address}</Text>
          )}
          {invoice.client?.email && (
            <Text style={styles.value}>{invoice.client.email}</Text>
          )}
        </View>

        <View style={styles.infoColumn}>
          <Text style={styles.label}>INVOICE DETAILS:</Text>
          <Text style={styles.value}>
            Matter: {invoice.matter?.title}
          </Text>
          <Text style={styles.value}>
            Status: {invoice.status}
          </Text>
          <Text style={styles.value}>
            Due Date: {invoice.dueDate ? dayjs(invoice.dueDate).format('MMMM D, YYYY') : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Time Entries Table */}
      {invoice.timeEntries && invoice.timeEntries.length > 0 && (
        <View>
          <Text style={styles.label}>TIME ENTRIES:</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Description</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Duration</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>User</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Amount</Text>
              </View>
            </View>

            {invoice.timeEntries.map((entry: any) => (
              <View key={entry.id} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{entry.description || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{entry.duration} seconds</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{entry.user?.name || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    ${entry.amount || '0.00'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Expenses Table */}
      {invoice.expenses && invoice.expenses.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>EXPENSES:</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Description</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Date</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>User</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Amount</Text>
              </View>
            </View>

            {invoice.expenses.map((expense: any) => (
              <View key={expense.id} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{expense.description || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {expense.date ? dayjs(expense.date).format('MM/DD/YYYY') : 'N/A'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{expense.user?.name || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    ${expense.amount || '0.00'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Totals */}
      <View style={styles.totals}>
        <View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${invoice.amount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>${invoice.tax || '0.00'}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.grandTotal}>${invoice.total}</Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      {invoice.notes && (
        <View style={styles.notes}>
          <Text style={styles.label}>NOTES:</Text>
          <Text>{invoice.notes}</Text>
        </View>
      )}

      {/* Payment Instructions */}
      <View style={styles.notes}>
        <Text style={styles.label}>PAYMENT INSTRUCTIONS:</Text>
        <Text>Please make payment by the due date.</Text>
        <Text>Thank you for your business!</Text>
      </View>

      {/* Footer */}
      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )}
        fixed
      />
    </Page>
  </Document>
)

export default InvoicePDF