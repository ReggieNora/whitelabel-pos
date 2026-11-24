import { TransactionRecord } from '../types/pos';
import { brandConfig } from '../config/brandConfig';
import { getGlobalCurrency } from './currency';

export interface CompletedSaleSummary {
  transaction: TransactionRecord;
  shiftTag: string;
  storeName?: string;
  customerPhone?: string;
  customerNewBalance?: number;
  customerCreditLimit?: number;
}

export function formatPlaintextReceipt(order: CompletedSaleSummary): string {
  const { transaction, storeName, customerNewBalance, customerCreditLimit } = order;
  const sym = getGlobalCurrency();
  const lines: string[] = [
    storeName ? `${storeName} • ${brandConfig.appName}` : `${brandConfig.appName} Store`,
    `Order #${transaction.id}`,
    `${transaction.createdAt}`,
    '------------------------',
  ];

  for (const item of transaction.items) {
    const lineSubtotal = (item.unitPrice * item.qty).toFixed(2);
    lines.push(`${item.qty}x ${item.name}: ${sym}${lineSubtotal}`);
  }

  lines.push('------------------------');
  lines.push(`Total Due: ${sym}${transaction.totalAmount.toFixed(2)}`);

  if (transaction.type === 'CASH') {
    const tendered = (transaction.cashTendered ?? transaction.totalAmount).toFixed(2);
    const change = (transaction.changeGiven ?? 0).toFixed(2);
    lines.push(`Amount Tendered: ${sym}${tendered}`);
    lines.push(`Change Due: ${sym}${change}`);
  } else {
    lines.push(`Charged to ${brandConfig.creditLabel} (${transaction.customerName || 'Customer'})`);
    if (customerNewBalance !== undefined && customerCreditLimit !== undefined) {
      lines.push(
        `New Balance: ${sym}${customerNewBalance.toFixed(2)} / ${sym}${customerCreditLimit.toFixed(2)}`
      );
    }
  }

  lines.push('------------------------');
  lines.push('Thank you for your business!');

  return lines.join('\n');
}

export function buildSmsUri(phone: string, receiptText: string): string {
  const isIOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const separator = isIOS ? '&' : '?';
  const encodedBody = encodeURIComponent(receiptText);
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return `sms:${cleanPhone}${separator}body=${encodedBody}`;
}
