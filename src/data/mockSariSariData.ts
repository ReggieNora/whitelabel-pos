import { brandConfig } from '../config/brandConfig';
import {
  AuditLogEntry,
  CategoryMeta,
  OcrInvoicePreset,
  Product,
  ShiftRecord,
  StoreProfile,
  TransactionRecord,
  UserProfile,
} from '../types/pos';
import { CATALOG_PRESETS } from './catalogPresets';

export const CATEGORIES: CategoryMeta[] = [
  { id: 'favorites', label: 'Top / Favorites', shortLabel: 'Favorites', emoji: '⭐', color: '#4F46E5' },
  { id: 'beverages', label: 'Beverages', shortLabel: 'Beverages', emoji: '🥤', color: '#0284C7' },
  { id: 'snacks', label: 'Snacks & Confectionery', shortLabel: 'Snacks', emoji: '🥨', color: '#EA580C' },
  { id: 'packaged_goods', label: 'General Merchandise', shortLabel: 'General', emoji: '📦', color: '#10B981' },
];

export const USERS: UserProfile[] = [
  {
    id: 'usr-cashier-1',
    name: 'Maria Santos',
    role: 'CASHIER',
    pin: '1234',
    badge: 'Morning Counter Associate',
  },
  {
    id: 'usr-cashier-2',
    name: 'Jordan Lee',
    role: 'CASHIER',
    pin: '2468',
    badge: 'Evening Counter Associate',
  },
  {
    id: 'usr-owner-1',
    name: 'Alex Morgan',
    role: 'OWNER',
    pin: '9999',
    badge: 'Store Owner • Full Access',
  },
];

// Clean Universal Retail Catalog as the Default Demo Products
export const INITIAL_PRODUCTS: Product[] = CATALOG_PRESETS.RETAIL_CONVENIENCE.products.map(
  (p) => ({ ...p })
);

export const INITIAL_SHIFTS: ShiftRecord[] = [
  {
    id: 'shf-active-morning',
    cashierId: 'usr-cashier-1',
    cashierName: 'Maria Santos',
    pin: '1234',
    startedAt: '08:00 AM Today',
    openingCash: 200.0,
    cashSalesTotal: 345.5,
    expectedDrawerCash: 545.5,
    status: 'ACTIVE',
    notes: 'Active morning shift — register engine running smoothly',
  },
  {
    id: 'shf-prev-night',
    cashierId: 'usr-cashier-2',
    cashierName: 'Jordan Lee',
    pin: '2468',
    startedAt: '04:00 PM Yesterday',
    endedAt: '10:00 PM Yesterday',
    openingCash: 200.0,
    cashSalesTotal: 420.0,
    expectedDrawerCash: 620.0,
    blindCountedCash: 620.0,
    discrepancy: 0.0,
    status: 'CLOSED_MATCH',
    notes: 'Balanced night shift handover.',
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TX-1045',
    createdAt: 'Today, 10:42 AM',
    timestampMs: Date.now() - 1000 * 60 * 25,
    cashierId: 'usr-cashier-1',
    cashierName: 'Maria Santos',
    type: 'CASH',
    totalAmount: 12.75,
    totalWholesaleCost: 6.05,
    cashTendered: 15.0,
    changeGiven: 2.25,
    items: [
      {
        productId: 'ret-cold-brew',
        name: 'Cold Brew Can',
        icon: '🧊',
        qty: 2,
        unitPrice: 4.5,
        unitCost: 2.1,
      },
      {
        productId: 'ret-chips-organic',
        name: 'Organic Chips',
        icon: '🥔',
        qty: 1,
        unitPrice: 3.75,
        unitCost: 1.85,
      },
    ],
    syncStatus: 'SYNCED',
  },
  {
    id: 'TX-1044',
    createdAt: 'Today, 09:15 AM',
    timestampMs: Date.now() - 1000 * 60 * 95,
    cashierId: 'usr-cashier-1',
    cashierName: 'Maria Santos',
    type: 'CASH',
    totalAmount: 18.0,
    totalWholesaleCost: 7.25,
    cashTendered: 20.0,
    changeGiven: 2.0,
    items: [
      {
        productId: 'ret-phone-cable',
        name: 'Phone Cable',
        icon: '🔌',
        qty: 1,
        unitPrice: 12.0,
        unitCost: 4.8,
      },
      {
        productId: 'ret-notebook',
        name: 'Notebook',
        icon: '📓',
        qty: 1,
        unitPrice: 6.0,
        unitCost: 2.45,
      },
    ],
    syncStatus: 'SYNCED',
  },
  {
    id: 'TX-1042',
    createdAt: 'Yesterday, 07:30 PM',
    timestampMs: Date.now() - 1000 * 60 * 60 * 15,
    cashierId: 'usr-cashier-2',
    cashierName: 'Jordan Lee',
    type: 'CASH',
    totalAmount: 6.25,
    totalWholesaleCost: 2.8,
    cashTendered: 10.0,
    changeGiven: 3.75,
    items: [
      {
        productId: 'ret-water-500',
        name: 'Bottled Water',
        icon: '💧',
        qty: 1,
        unitPrice: 2.5,
        unitCost: 0.95,
      },
      {
        productId: 'ret-chips-organic',
        name: 'Organic Chips',
        icon: '🥔',
        qty: 1,
        unitPrice: 3.75,
        unitCost: 1.85,
      },
    ],
    syncStatus: 'SYNCED',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-101',
    timestamp: '08:00 AM Today',
    actorName: 'Maria Santos',
    actorRole: 'CASHIER',
    eventType: 'SHIFT_OPEN',
    severity: 'INFO',
    summary: 'Opened Counter Shift ($200.00 Float)',
    detail: 'Morning shift drawer opened with standard starting cash.',
  },
  {
    id: 'aud-102',
    timestamp: '09:30 AM Today',
    actorName: 'Alex Morgan',
    actorRole: 'OWNER',
    eventType: 'PRICE_EDIT',
    severity: 'INFO',
    summary: 'Updated Retail Price for Cold Brew Can',
    detail: 'Price adjusted from $4.25 to $4.50 (Margin: 53.3%)',
  },
];

export const OCR_INVOICE_PRESETS: OcrInvoicePreset[] = [
  {
    id: 'ocr-metro-wholesale',
    supplierName: 'Metro Wholesale Direct Supplies',
    invoiceNo: 'INV-MW-2026-8841',
    timestamp: 'Detected just now • 99.2% OCR Confidence',
    items: [
      {
        productId: 'ret-water-500',
        sku: 'BEV-WTR-500',
        name: 'Natural Spring Bottled Water 500ml (Case of 24)',
        detectedQty: 24,
        wholesaleUnitCost: 0.95,
        suggestedRetailPrice: 2.5,
        currentStock: 48,
      },
      {
        productId: 'ret-chips-organic',
        sku: 'SNK-CHIP-ORG',
        name: 'Organic Sea Salt Kettle Chips (Box of 20)',
        detectedQty: 20,
        wholesaleUnitCost: 1.85,
        suggestedRetailPrice: 3.75,
        currentStock: 32,
      },
      {
        productId: 'ret-cold-brew',
        sku: 'BEV-CLD-CAN',
        name: 'Cold Brew Coffee Can 250ml (Pack of 12)',
        detectedQty: 12,
        wholesaleUnitCost: 2.1,
        suggestedRetailPrice: 4.5,
        currentStock: 24,
      },
    ],
  },
  {
    id: 'ocr-apex-commercial',
    supplierName: 'Apex Commercial Distributors',
    invoiceNo: 'INV-AC-2026-3109',
    timestamp: 'Detected just now • 98.7% OCR Confidence',
    items: [
      {
        productId: 'ret-phone-cable',
        sku: 'GEN-CABL-USB',
        name: 'USB-C Fast Charging Cable (Pack of 10)',
        detectedQty: 10,
        wholesaleUnitCost: 4.8,
        suggestedRetailPrice: 12.0,
        currentStock: 16,
      },
      {
        productId: 'ret-notebook',
        sku: 'GEN-NOTE-BK',
        name: 'Dot-Grid Hardcover Notebook (Pack of 15)',
        detectedQty: 15,
        wholesaleUnitCost: 2.75,
        suggestedRetailPrice: 6.0,
        currentStock: 20,
      },
    ],
  },
];

export const DEMO_STORE_PROFILE: StoreProfile = {
  id: 'store-demo-aurapos',
  storeName: `${brandConfig.appName} Demo Store`,
  barangayCity: 'Flagship Branch #101',
  ownerPhone: '+1-555-0199',
  ownerName: 'Alex Morgan',
  createdAt: 'Demo Environment',
  environment: 'DEMO',
  currencySymbol: brandConfig.defaultCurrency,
  businessType: 'RETAIL_CONVENIENCE',
};

export const TOP_20_SARI_SARI_STARTER_ITEMS: Product[] = INITIAL_PRODUCTS.slice(0, 20).map(
  (item) => ({
    ...item,
    stockQty: Math.max(item.stockQty, item.lowStockThreshold + 10),
    daysSinceLastSale: 0,
  })
);

export const TOP_25_SARI_SARI_STARTER_ITEMS: Product[] = TOP_20_SARI_SARI_STARTER_ITEMS;
