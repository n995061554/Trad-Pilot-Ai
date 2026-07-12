
import React from 'react';
import { Page, CompanyDetails, IconSet } from '../types';
import { translations } from '../translations';
import { iconSets, TradeXCloudLogo, PremiumEliteBadge } from './icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
  companyProfile: CompanyDetails | null;
  isCollapsed: boolean;
  onToggle: () => void;
  navOrder: Page[];
  iconSet: IconSet;
  t: (key: keyof typeof translations.en) => string;
  isPremium?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout, companyProfile, isCollapsed, onToggle, navOrder, iconSet, t, isPremium }) => {
  const selectedIcons = iconSets[iconSet.toLowerCase() as keyof typeof iconSets] || iconSets.line;

  const allNavItems: Record<Page, { icon: React.ReactElement; label: string }> = {
    'dashboard': { icon: React.createElement(selectedIcons.DashboardIcon), label: t('dashboard') },
    'study-guide': { icon: React.createElement(selectedIcons.StudyGuideIcon), label: t('studyGuide') },
    'market-intel': { icon: React.createElement(selectedIcons.MarketIcon), label: t('marketIntel') },
    'resource-hub': { icon: React.createElement(selectedIcons.ResourceHubIcon), label: t('resourceHub') },
    'buyer-finder': { icon: React.createElement(selectedIcons.BuyerFinderIcon), label: t('buyerFinder') },
    'supplier-finder': { icon: React.createElement(selectedIcons.SupplierFinderIcon), label: t('supplierFinder') },
    'oem-finder': { icon: React.createElement(selectedIcons.OEMFinderIcon), label: t('oemFinder') },
    'map-extractor': { icon: React.createElement(selectedIcons.MapExtractorIcon), label: t('mapExtractor') },
    'campaign-manager': { icon: React.createElement(selectedIcons.CampaignManagerIcon), label: t('campaignManager') },
    'goal-planner': { icon: React.createElement(selectedIcons.GoalPlannerIcon), label: t('goalPlanner') },
    'profit-calculator': { icon: React.createElement(selectedIcons.CalculatorIcon), label: t('profitCalculator') },
    'shipment-experience': { icon: React.createElement(selectedIcons.ConsignmentIcon), label: t('shipmentExperience') },
    'risk': { icon: React.createElement(selectedIcons.RiskIcon), label: t('riskAnalysis') },
    'settings': { icon: React.createElement(selectedIcons.SettingsIcon), label: t('settings') },
  };

  const orderedNavItems = navOrder.map(pageId => ({
      id: pageId,
      ...allNavItems[pageId]
  })).filter(item => item.label); // Filter out any invalid items

  return (
    <aside className={`fixed top-0 left-0 h-full bg-secondary border-r border-accent/30 shadow-xl z-10 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-16 sm:w-64'}`}>
      <div className={`flex items-center h-20 border-b border-accent/20 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-center sm:justify-start sm:pl-4'}`}>
        <div className="relative">
            {companyProfile?.logo ? (
              <img src={companyProfile.logo} alt="Company Logo" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            ) : (
              <TradeXCloudLogo className="w-9 h-9 flex-shrink-0" />
            )}
            {isPremium && (
                <div className="absolute -top-1 -right-1">
                    <PremiumEliteBadge className="w-4 h-4 drop-shadow-sm" />
                </div>
            )}
        </div>
        {!isCollapsed && (
            <div className="flex flex-col ml-3 truncate">
                <span className="text-lg font-bold text-text-primary truncate">
                  {companyProfile?.companyName || (
                    <>
                      <span className="text-brand">Trade</span>{' '}
                      <span className="text-orange-500">X</span>{' '}
                      <span className="text-brand">Cloud</span>
                    </>
                  )}
                </span>
                {isPremium && <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1">Premium Gold</span>}
            </div>
        )}
      </div>
      <nav className="mt-4 flex-grow overflow-y-auto">
        <ul>
          {orderedNavItems.map((item) => (
            <li key={item.id} className={`${isCollapsed ? 'px-3' : 'px-3 sm:px-4'} py-0.5`}>
              <button
                onClick={() => setActivePage(item.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group ${
                  activePage === item.id
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-text-secondary hover:bg-highlight/40 hover:text-brand'
                }`}
              >
                <span className={`${activePage === item.id ? 'text-white' : 'group-hover:text-brand transition-colors'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="hidden sm:inline ml-4 font-semibold">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
       <div className={`mt-auto border-t border-accent/20 flex-shrink-0 ${isCollapsed ? 'p-3' : 'p-3 sm:p-4'}`}>
         <button
            onClick={onToggle}
            className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-text-secondary hover:bg-highlight/30 hover:text-brand mb-2"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
         >
            {React.createElement(isCollapsed ? selectedIcons.ChevronsRightIcon : selectedIcons.ChevronsLeftIcon)}
            {!isCollapsed && <span className="hidden sm:inline ml-4 font-semibold">{t('collapse')}</span>}
         </button>
         <button
          onClick={onLogout}
          className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-text-secondary hover:bg-red-500/10 hover:text-red-500"
        >
          {React.createElement(selectedIcons.LogoutIcon)}
          {!isCollapsed && <span className="hidden sm:inline ml-4 font-semibold">{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
