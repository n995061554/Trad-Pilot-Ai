
import React from 'react';

const lineIconProps: React.SVGProps<SVGSVGElement> = {
  className: "w-6 h-6",
  strokeWidth: "1.5",
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const solidIconProps: React.SVGProps<SVGSVGElement> = {
  className: "w-6 h-6",
  fill: "currentColor",
  viewBox: "0 0 24 24",
};

const duoIconProps: React.SVGProps<SVGSVGElement> = {
  className: "w-6 h-6",
  viewBox: "0 0 24 24",
  fill: "currentColor",
};

// --- RICH PREMIUM LOGOS ---
export const PremiumEliteBadge = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad-premium" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FDE68A', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#B45309', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="premium-glow">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path d="M50 5L85 20V50C85 75 50 95 50 95C50 95 15 75 15 50V20L50 5Z" fill="url(#gold-grad-premium)" stroke="#92400E" strokeWidth="2" filter="url(#premium-glow)" />
    <path d="M50 25L55.5 36.5H68L58.5 45L62 57.5L50 50L38 57.5L41.5 45L32 36.5H44.5L50 25Z" fill="white" opacity="0.9" />
    <path d="M15 50C15 65 30 85 50 95" stroke="white" strokeWidth="0.5" opacity="0.3" strokeLinecap="round" />
  </svg>
);

export const IconUnlimited = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20Z" fill="currentColor" opacity="0.2" />
    <path d="M13 12H11V8H13V12ZM13 16H11V14H13V16Z" fill="currentColor" />
    <path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 10L18 12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTurboAi = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
    <path d="M18 12C18 15.3137 15.3137 18 12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export const IconBulkExport = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 3V12M12 12L9 9M12 12L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 13V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="7" y="15" width="10" height="1.5" rx="0.75" fill="currentColor" opacity="0.3" />
  </svg>
);

export const IconValidity = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.2" />
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- UPDATED WALLET SYMBOL ---
export const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" {...props}>
    <defs>
      <linearGradient id="wallet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="url(#wallet-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 11V16" stroke="url(#wallet-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 11H21" stroke="url(#wallet-grad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    <path d="M16 3.5C16 2.67157 16.6716 2 17.5 2C18.3284 2 19 2.67157 19 3.5V7H16V3.5Z" stroke="url(#wallet-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18.5" cy="13.5" r="1.5" fill="currentColor" />
  </svg>
);

// --- BRAND LOGO (Trade X Cloud Version) ---
export const TradeXCloudLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
      <filter id="logo-glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Sea Background */}
    <rect x="0" y="60" width="100" height="40" fill="url(#grad1)" opacity="0.05" />
    
    {/* Sea Waves */}
    <path d="M0 85 Q 25 80 50 85 T 100 85" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" opacity="0.6">
       <animate attributeName="d" values="M0 85 Q 25 80 50 85 T 100 85; M0 85 Q 25 90 50 85 T 100 85; M0 85 Q 25 80 50 85 T 100 85" dur="3s" repeatCount="indefinite" />
    </path>
    <path d="M0 92 Q 25 87 50 92 T 100 92" stroke="url(#grad1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3">
       <animate attributeName="d" values="M0 92 Q 25 87 50 92 T 100 92; M0 92 Q 25 97 50 92 T 100 92; M0 92 Q 25 87 50 92 T 100 92" dur="4s" repeatCount="indefinite" />
    </path>

    {/* Ship Hull */}
    <path d="M15 70 L85 70 L80 85 L20 85 Z" fill="#1E293B" filter="url(#logo-glow)" />
    
    {/* Containers */}
    <rect x="25" y="60" width="15" height="10" fill="#F59E0B" rx="1" />
    <rect x="42" y="60" width="15" height="10" fill="#EF4444" rx="1" />
    <rect x="59" y="60" width="15" height="10" fill="#3B82F6" rx="1" />
    
    <rect x="33" y="50" width="15" height="10" fill="#10B981" rx="1" />
    <rect x="50" y="50" width="15" height="10" fill="#8B5CF6" rx="1" />

    {/* Stylized X on the main container */}
    <path d="M36 53L45 62" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M45 53L36 62" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// LINE ICONS
const LineDashboardIcon = () => <svg {...lineIconProps}><path d="M4 4h6v8h-6zM4 16h6v4h-6zM14 12h6v8h-6zM14 4h6v4h-6z" /></svg>;
const LineStudyGuideIcon = () => <svg {...lineIconProps}><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6l0 13M12 6l0 13M21 6l0 13" /></svg>;
const LineCalculatorIcon = () => <svg {...lineIconProps}><path d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2zM8 7h8M8 11h8M8 15h8M11 18h2" /></svg>;
const LineMarketIcon = () => <svg {...lineIconProps}><circle cx="12" cy="12" r="9" /><path d="M12 12a2 2 0 1 0 2 2" /></svg>;
const LineBuyerFinderIcon = () => <svg {...lineIconProps}><circle cx="10" cy="10" r="7" /><line x1="21" y1="21" x2="15" y2="15" /></svg>;
const LineSupplierFinderIcon = () => <svg {...lineIconProps}><path d="M3 21h18M5 21v-12l5-4v16M19 21v-8l-6-4" /></svg>;
const LineOEMFinderIcon = () => <svg {...lineIconProps}><path d="M4 21v-12l5-4v16M15 21v-8l-5-4M20 21v-12l-5-4" /></svg>;
const LineResourceHubIcon = () => <svg {...lineIconProps}><path d="M9 4h3l2 2h4a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /></svg>;
const LineCampaignManagerIcon = () => <svg {...lineIconProps}><path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-5l1 -7h-4a2 2 0 0 1 0 -4h4l4 -7h5l-1 7" /></svg>;
const LineRiskIcon = () => <svg {...lineIconProps}><circle cx="12" cy="12" r="9" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const LineMapExtractorIcon = () => <svg {...lineIconProps}><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></svg>;
const LineConsignmentIcon = () => <svg {...lineIconProps}><circle cx="5" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M5 18h-2v-11h3M18 18h2v-11h-3M3 3h18v2h-18z" /></svg>;
const LineGoalPlannerIcon = () => <svg {...lineIconProps}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /></svg>;
const LineLogoutIcon = () => <svg {...lineIconProps}><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2M9 12h12l-3-3M18 15l3-3" /></svg>;
const LineChevronsLeftIcon = () => <svg {...lineIconProps}><path d="M11 7l-5 5l5 5M17 7l-5 5l5 5" /></svg>;
const LineChevronsRightIcon = () => <svg {...lineIconProps}><path d="M7 7l5 5l-5 5M13 7l5 5l-5 5" /></svg>;
const LineSettingsIcon = () => <svg {...lineIconProps}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;

// SOLID ICONS
const SolidDashboardIcon = () => <svg {...solidIconProps}><path d="M4 4h6v8H4zm0 12h6v4H4zm10-4h6v8h-6zm0-8h6v4h-6z" /></svg>;
const SolidStudyGuideIcon = () => <svg {...solidIconProps}><path d="M12 5.25c-2.67 0-5.33.42-8 .9V19c2.67-.48 5.33-.9 8-.9s5.33.42 8 .9V6.15c-2.67-.48-5.33-.9-8-.9z" /></svg>;
const SolidCalculatorIcon = () => <svg {...solidIconProps}><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 6v2h8V8H8zm0 4v2h8v-2H8z" /></svg>;
const SolidMarketIcon = () => <svg {...solidIconProps}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></svg>;
const SolidBuyerFinderIcon = () => <svg {...solidIconProps}><path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" /></svg>;
const SolidSupplierFinderIcon = () => <svg {...solidIconProps}><path d="M12 2L3 8v11h18V8l-9-6zm-5 16H5v-2h2v2zm0-4H5v-2h2v2zm10 4h-2v-2h2v2zm0-4h-2v-2h2v2z" /></svg>;
const SolidOEMFinderIcon = () => <svg {...solidIconProps}><path d="M12 2L3 8v11h6v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4h6V8l-9-6z" /></svg>;
const SolidResourceHubIcon = () => <svg {...solidIconProps}><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>;
const SolidCampaignManagerIcon = () => <svg {...solidIconProps}><path d="M14 6l-1-2H5v11h2v6l3-3h6l1-2V6h-5z" /></svg>;
const SolidRiskIcon = () => <svg {...solidIconProps}><circle cx="12" cy="12" r="9" /><path d="M11 15h2v2h-2zm0-8h2v6h-2z" /></svg>;
const SolidMapExtractorIcon = () => <svg {...solidIconProps}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>;
const SolidConsignmentIcon = () => <svg {...solidIconProps}><path d="M20 8h-3V4H7v4H4c-1.1 0-2 .9-2 2v6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-6c0-1.1-.9-2-2-2z" /></svg>;
const SolidGoalPlannerIcon = () => <svg {...solidIconProps}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>;
const SolidLogoutIcon = () => <svg {...solidIconProps}><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>;
const SolidChevronsLeftIcon = () => <svg {...solidIconProps}><path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12zM18.67 3.87L16.9 2.1 7 12l9.9 9.9 1.77-1.77L10.54 12z" /></svg>;
const SolidChevronsRightIcon = () => <svg {...solidIconProps}><path d="M5.88 3.87L7.65 2.1 17.55 12l-9.9 9.9-1.77-1.77L14.01 12zM12.88 3.87L14.65 2.1 24.55 12l-9.9 9.9-1.77-1.77L21.01 12z" /></svg>;
const SolidSettingsIcon = () => <svg {...solidIconProps}><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17-.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73-1.69.98l-.38 2.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" /></svg>;

// DUO-TONE ICONS
const DuoDashboardIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M4 12h6V4H4v8zm10-8v4h6V4h-6zM4 20h6v-4H4v4zm10 0h6v-8h-6v8z" /><path d="M10 4v8H4V4h6zm6 0v4h6V4h-6zM10 16v4H4v-4h6zm6 4h6v-8h-6v8z"/></svg>;
const DuoStudyGuideIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M4 6.7c2.11-.37 4.43-.6 7-.6s4.89.23 7 .6V18c-2.11.37-4.43.6-7 .6s-4.89-.23-7-.6V6.7z" /><path d="M12 5.25c-2.67 0-5.33.42-8 .9V19c2.67-.48 5.33-.9 8-.9s5.33.42 8 .9V6.15c-2.67-.48-5.33-.9-8-.9z" /></svg>;
const DuoCalculatorIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M8 8h8v2H8zm0 4h8v2H8zm0 4h2v2H8z" /><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 18h2v-2H8v2zm0-4h8v-2H8v2zm0-4h8V8H8v2z" /></svg>;
const DuoMarketIcon = () => <svg {...duoIconProps}><circle cx="12" cy="12" r="9" opacity=".3" /><circle cx="12" cy="12" r="3" /></svg>;
const DuoBuyerFinderIcon = () => <svg {...duoIconProps}><circle cx="9.5" cy="9.5" r="6.5" opacity=".3" /><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" /></svg>;
const DuoSupplierFinderIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M10 10h4v4h-4z" /><path d="M12 2L3 8v11h18V8L12 2z" /></svg>;
const DuoOEMFinderIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M11 15h2v2h-2z" /><path d="M12 2L3 8v11h6v-4c0-1.1.9-2 2-2h2c1.1 0 2-.9 2 2v4h6V8l-9-6z" /></svg>;
const DuoResourceHubIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M4 18h16V8h-8l-2-2H4v12z" /><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>;
const DuoCampaignManagerIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M12 9H8v2h4zm4 0h-2v2h2z" /><path d="M14 6l-1-2H5v11h2v6l3-3h6l1-2V6h-5z" /></svg>;
const DuoRiskIcon = () => <svg {...duoIconProps}><circle cx="12" cy="12" r="9" opacity=".3" /><path d="M11 15h2v2h-2zm0-8h2v6h-2z" /></svg>;
const DuoMapExtractorIcon = () => <svg {...duoIconProps}><circle cx="12" cy="9.5" r="2.5" opacity=".3" /><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>;
const DuoConsignmentIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M6 9h12V6H6v3z" /><path d="M20 8h-3V4H7v4H4c-1.1 0-2 .9-2 2v6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-6c0-1.1-.9-2-2-2z" /></svg>;
const DuoGoalPlannerIcon = () => <svg {...duoIconProps}><circle cx="12" cy="12" r="9" opacity=".3" /><circle cx="12" cy="12" r="4" /></svg>;
const DuoLogoutIcon = () => <svg {...duoIconProps}><path opacity=".3" d="M18.17 13H8v-2h10.17l-2.58-2.58L17 7l5 5-5 5-1.41-1.41z" /><path d="M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>;
const DuoChevronsLeftIcon = () => <svg {...duoIconProps}><path d="M18.67 3.87L16.9 2.1 7 12l9.9 9.9 1.77-1.77L10.54 12z" /><path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" /></svg>;
const DuoChevronsRightIcon = () => <svg {...duoIconProps}><path d="M5.88 3.87L7.65 2.1 17.55 12l-9.9 9.9-1.77-1.77L14.01 12z" /><path d="M12.88 3.87L14.65 2.1 24.55 12l-9.9 9.9-1.77-1.77L21.01 12z" /></svg>;
const DuoSettingsIcon = () => <svg {...duoIconProps}><circle cx="12" cy="12" r="3" opacity=".3" /><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65z" /></svg>;

// OTHER UTILITY ICONS
export const AiIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M10 21l2 -2l2 2M12 17v4M14 4l-2 2l-2 -2M12 11v-7" /></svg>;
export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2M7 11l5 5l5 -5M12 4l0 12" /></svg>;
export const GmailIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2zM3 7l9 6l9 -6" /></svg>;
export const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} className="w-5 h-5" {...props}><circle cx="12" cy="12" r="9" /><path d="M3.6 9h16.8M3.6 15h16.8" /></svg>;
export const CertificateIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} className="w-5 h-5" {...props}><circle cx="15" cy="15" r="3" /><path d="M13 17.5v4.5l2-1.5 2 1.5v-4.5" /></svg>;
export const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M12 8l0 4l2 2M3.05 11a9 9 0 1 1 .5 4" /></svg>;
export const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M9 12l2 2l4-4M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1-8.5 15a12 12 0 0 1-8.5-15a12 12 0 0 0 8.5-3" /></svg>;
export const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M12 9v4M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87l-8.106-13.536a1.914 1.914 0 0 0-3.274 0zM12 16h.01" /></svg>;
export const BackArrowIcon = () => <svg {...lineIconProps} className="w-5 h-5"><path d="M5 12l14 0M5 12l4 4M5 12l4-4" /></svg>;
export const QrCodeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} {...props}><rect x="4" y="4" width="6" height="6" rx="1" /><path d="M14 4h6M14 14h6" /></svg>;
export const LanguageIcon = () => <svg {...lineIconProps}><path d="M4 5h7M9 3v2c0 4.4 -2.2 8 -5 8" /></svg>;
export const CurrencyIcon = () => <svg {...lineIconProps}><circle cx="12" cy="12" r="7" /><path d="M5 8h14M5 16h14" /></svg>;
export const DragHandleIcon = () => <svg {...lineIconProps} className="w-5 h-5 cursor-grab"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>;
export const BankIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10h20L12 3z" /></svg>
);
export const LockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...lineIconProps} {...props}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /></svg>;

// Added missing icons
export const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...lineIconProps} className="w-5 h-5" {...props}>
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0M12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
  </svg>
);
export const MicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M9 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>
);
export const MicrophoneOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...lineIconProps} className="w-5 h-5" {...props}><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>
);
export const TextToSpeechIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
);
export const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
);
export const GavelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...lineIconProps} className="w-5 h-5" {...props}><path d="M14 5l6.79 6.79c.55.55.55 1.43 0 1.98l-3.54 3.54c-.55.55-1.43.55-1.98 0L8.5 10.5M3 21l6-6M15 13l-4-4" /></svg>
);

// ICON SET OBJECTS
const lineIcons = { DashboardIcon: LineDashboardIcon, StudyGuideIcon: LineStudyGuideIcon, CalculatorIcon: LineCalculatorIcon, MarketIcon: LineMarketIcon, BuyerFinderIcon: LineBuyerFinderIcon, SupplierFinderIcon: LineSupplierFinderIcon, OEMFinderIcon: LineOEMFinderIcon, ResourceHubIcon: LineResourceHubIcon, CampaignManagerIcon: LineCampaignManagerIcon, RiskIcon: LineRiskIcon, MapExtractorIcon: LineMapExtractorIcon, ConsignmentIcon: LineConsignmentIcon, GoalPlannerIcon: LineGoalPlannerIcon, LogoutIcon: LineLogoutIcon, ChevronsLeftIcon: LineChevronsLeftIcon, ChevronsRightIcon: LineChevronsRightIcon, SettingsIcon: LineSettingsIcon };
const solidIcons = { DashboardIcon: SolidDashboardIcon, StudyGuideIcon: SolidStudyGuideIcon, CalculatorIcon: SolidCalculatorIcon, MarketIcon: SolidMarketIcon, BuyerFinderIcon: SolidBuyerFinderIcon, SupplierFinderIcon: SolidSupplierFinderIcon, OEMFinderIcon: SolidOEMFinderIcon, ResourceHubIcon: SolidResourceHubIcon, CampaignManagerIcon: SolidCampaignManagerIcon, RiskIcon: SolidRiskIcon, MapExtractorIcon: SolidMapExtractorIcon, ConsignmentIcon: SolidConsignmentIcon, GoalPlannerIcon: SolidGoalPlannerIcon, LogoutIcon: SolidLogoutIcon, ChevronsLeftIcon: SolidChevronsLeftIcon, ChevronsRightIcon: SolidChevronsRightIcon, SettingsIcon: SolidSettingsIcon };
const duoToneIcons = { DashboardIcon: DuoDashboardIcon, StudyGuideIcon: DuoStudyGuideIcon, CalculatorIcon: DuoCalculatorIcon, MarketIcon: DuoMarketIcon, BuyerFinderIcon: DuoBuyerFinderIcon, SupplierFinderIcon: DuoSupplierFinderIcon, OEMFinderIcon: DuoOEMFinderIcon, ResourceHubIcon: DuoResourceHubIcon, CampaignManagerIcon: DuoCampaignManagerIcon, RiskIcon: DuoRiskIcon, MapExtractorIcon: DuoMapExtractorIcon, ConsignmentIcon: DuoConsignmentIcon, GoalPlannerIcon: DuoGoalPlannerIcon, LogoutIcon: DuoLogoutIcon, ChevronsLeftIcon: DuoChevronsLeftIcon, ChevronsRightIcon: DuoChevronsRightIcon, SettingsIcon: DuoSettingsIcon };

export const iconSets = { line: lineIcons, solid: solidIcons, 'duo-tone': duoToneIcons };

// NAMED EXPORTS (FOR DIRECT IMPORT)
export { 
  LineDashboardIcon as DashboardIcon, 
  LineStudyGuideIcon as StudyGuideIcon, 
  LineCalculatorIcon as CalculatorIcon, 
  LineMarketIcon as MarketIcon, 
  LineBuyerFinderIcon as BuyerFinderIcon, 
  LineSupplierFinderIcon as SupplierFinderIcon, 
  LineOEMFinderIcon as OEMFinderIcon, 
  LineResourceHubIcon as ResourceHubIcon, 
  LineCampaignManagerIcon as CampaignManagerIcon, 
  LineRiskIcon as RiskIcon, 
  LineMapExtractorIcon as MapExtractorIcon, 
  LineConsignmentIcon as ConsignmentIcon, 
  LineGoalPlannerIcon as GoalPlannerIcon, 
  LineLogoutIcon as LogoutIcon, 
  LineChevronsLeftIcon as ChevronsLeftIcon, 
  LineChevronsRightIcon as ChevronsRightIcon, 
  LineSettingsIcon as SettingsIcon 
};
