
export type Page = 'dashboard' | 'study-guide' | 'shipment-experience' | 'market-intel' | 'buyer-finder' | 'supplier-finder' | 'oem-finder' | 'resource-hub' | 'campaign-manager' | 'risk' | 'map-extractor' | 'goal-planner' | 'settings' | 'profit-calculator';
export type IconSet = 'Line' | 'Solid' | 'Duo-tone';
export type Font = 'Inter' | 'Roboto' | 'Lato' | 'Poppins';

export interface ProfitCalculation {
  productName: string;
  buyerCountry: string;
  quantity: number;
  sellingPrice: number;
  purchasePrice: number;
  inlandTransport: number;
  freight: number;
  documentation: number;
  packaging: number;
  bankCharges: number;
  miscellaneous: number;
}

export interface BuyerLead {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  estimatedVolume: string;
  riskScore: number; // 0-100 where <30 is Low, 30-70 is Medium, >70 is High
  riskJustification: string;
  riskBreakdown: {
      website: string;
      registration: string;
      tradeHistory: string;
  };
}

export interface SupplierLead {
  supplierName: string;
  city: string;
  state: string;
  country: string;
  specialization: string;
  contactPerson: string;
  email: string;
  phone: string;
  reliabilityScore: number; // 0-100 where >70 is High
  reliabilityJustification: string;
}

export interface OEMLead {
  manufacturerName: string;
  city: string;
  state: string;
  country: string;
  specialization: string;
  minOrderQuantity: string;
  certifications: string[];
  contactPerson: string;
  email: string;
  phone: string;
  privateLabelExperience: string;
}

// For Campaign Manager
export interface CampaignContact {
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    country: string;
    type: 'Buyer' | 'Supplier' | 'OEM';
    product?: string;
}

// For Resource Hub
export interface Supplier {
    supplierName: string;
    location: string;
    specialization: string;
    contactEmail: string;
    contactPhone: string;
    reliabilityScore: number; // 0-100
}

export interface LogisticsProvider {
    companyName: string;
    type: 'Freight Forwarder' | 'CHA';
    location: string;
    specializesIn: string;
    email: string;
    phone: string;
}

export interface Embassy {
    country: string;
    city: string;
    email: string;
    phone: string;
}

export interface PortInfo {
    portName: string;
    country: string;
    keyInfo: string;
    majorExports: string;
}

export interface ComplianceInfo {
    country: string;
    product: string;
    requiredCertificates: string[];
    labelingRequirements: string;

    keyRegulations: string;
}

export interface HSCodeResult {
    hsCode: string;
    description: string;
    chapter: string;
    confidenceScore: number;
    notes: string;
}

// For Google Map Extractor
export interface MapLead {
    companyName: string;
    address: string;
    phone: string;
    website: string;
    email: string;
    rating: number;
    establishmentYear: number;
    companyHistory: string;
    financialSummary: string;
}

// For Consignment Booker
export interface Consignment {
  productName: string;
  buyerName: string;
  buyerCountry: string;
  quantityMT: number;
  sellingPricePerMT: number;
  purchasePricePerMT: number;
  paymentTerms: 'LC' | '30% Advance, 70% on Docs' | '50% Advance, 50% on Docs' | '100% Advance';
  qualityInspectionCost: number;
  packagingCost: number;
  inlandTransportCost: number;
  freightBookingCost: number;
  exportDocumentationCost: number;
  customsClearanceCost: number;
  bankCharges: number;
  miscCost: number;
}

// For Company Profile
export interface CompanyDetails {
  companyName: string;
  address: string;
  email: string;
  phone: string;
  gstin: string;
  iecCode: string;
  logo?: string;
  upiId?: string;
  bankDetails?: string;
}
