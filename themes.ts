
export interface Theme {
  name: string;
  colors: {
    'primary': string;
    'secondary': string;
    'accent': string;
    'highlight': string;
    'text-primary': string;
    'text-secondary': string;
    'brand': string;
    'duotone-primary': string;
    'duotone-secondary': string;
  };
}

export const themes: Theme[] = [
  {
    name: 'Mint Breeze',
    colors: {
      'primary': '#F8FAFC',     // Lightest Slate for main content
      'secondary': '#F0FDF9',   // Very Soft Mint for Sidebar
      'accent': '#E2E8F0',      // Light border/accent
      'highlight': '#CCFBF1',   // Soft Teal/Mint highlight
      'text-primary': '#0F172A', // Deep Slate text
      'text-secondary': '#475569', // Muted Slate text
      'brand': '#10B981',       // Vibrant Emerald
      'duotone-primary': '#475569',
      'duotone-secondary': '#10B981',
    }
  },
  {
    name: 'Emerald Night',
    colors: {
      'primary': '#0F1A14',
      'secondary': '#1C2A24',
      'accent': '#2A4235',
      'highlight': '#3C6E47',
      'text-primary': '#F0FDF4',
      'text-secondary': '#BCC1BA',
      'brand': '#34D399',
      'duotone-primary': '#BCC1BA',
      'duotone-secondary': '#34D399',
    }
  },
  {
    name: 'Modern Professional',
    colors: {
      'primary': '#F8F9FA',
      'secondary': '#FFFFFF',
      'accent': '#DEE2E6',
      'highlight': '#E9ECEF',
      'text-primary': '#0d335d',
      'text-secondary': '#3d5a80',
      'brand': '#007BFF',
      'duotone-primary': '#3d5a80',
      'duotone-secondary': '#007BFF',
    }
  },
  {
    name: 'Sakura Spring',
    colors: {
      'primary': '#FFF8F5',
      'secondary': '#FFFFFF',
      'accent': '#FBE9E7',
      'highlight': '#FFCCBC',
      'text-primary': '#4E342E',
      'text-secondary': '#795548',
      'brand': '#FF7043',
      'duotone-primary': '#795548',
      'duotone-secondary': '#FF7043',
    }
  },
  {
    name: 'Lavender Day',
    colors: {
      'primary': '#F9FAFB',
      'secondary': '#FFFFFF',
      'accent': '#F3F0F9',
      'highlight': '#EAE6F3',
      'text-primary': '#241B2F',
      'text-secondary': '#4D3F61',
      'brand': '#8B5CF6',
      'duotone-primary': '#4D3F61',
      'duotone-secondary': '#8B5CF6',
    }
  },
  {
    name: 'Vine Purple',
    colors: {
      'primary': '#241B2F',
      'secondary': '#362A45',
      'accent': '#4D3F61',
      'highlight': '#64537D',
      'text-primary': '#F3F0F9',
      'text-secondary': '#A499B3',
      'brand': '#A78BFA',
      'duotone-primary': '#A499B3',
      'duotone-secondary': '#A78BFA',
    }
  },
  {
    name: 'Solaris Flare',
    colors: {
      'primary': '#1A1A1A',
      'secondary': '#2C2C2C',
      'accent': '#444444',
      'highlight': '#5A5A5A',
      'text-primary': '#F5F5F5',
      'text-secondary': '#A9A9A9',
      'brand': '#FF8C00',
      'duotone-primary': '#A9A9A9',
      'duotone-secondary': '#FF8C00',
    }
  },
  {
    name: 'Oceanic Deep',
    colors: {
      'primary': '#0B132B',
      'secondary': '#1C2541',
      'accent': '#3A506B',
      'highlight': '#5BC0BE',
      'text-primary': '#FFFFFF',
      'text-secondary': '#8D99AE',
      'brand': '#6FFFE9',
      'duotone-primary': '#8D99AE',
      'duotone-secondary': '#6FFFE9',
    }
  }
];
