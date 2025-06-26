export interface ThemeColors {
  '--theme-bg-page': string;
  '--theme-bg-card': string;
  '--theme-bg-header': string;
  '--theme-bg-footer': string;
  '--theme-bg-shanti-speaks': string;
  '--theme-bg-shanti-avatar': string;
  '--theme-bg-modal': string;

  '--theme-text-heading': string;
  '--theme-text-body': string;
  '--theme-text-muted': string;
  '--theme-text-link': string;
  '--theme-text-on-primary-action': string;
  '--theme-text-on-secondary-action': string;
  '--theme-text-on-header': string;
  '--theme-text-on-footer': string;
  '--theme-text-on-shanti-avatar': string;

  '--theme-action-primary-bg': string;
  '--theme-action-primary-bg-hover': string;
  '--theme-action-primary-text': string;
  '--theme-action-secondary-bg': string;
  '--theme-action-secondary-bg-hover': string;
  '--theme-action-secondary-text': string;
  
  '--theme-border-interactive': string;
  '--theme-border-decorative': string;
  '--theme-border-shanti-speaks': string;
  
  '--theme-highlight-focus': string;
  '--theme-highlight-accent': string;
  '--theme-highlight-subtle': string;

  '--theme-animator-expand-contract-bg': string;
  '--theme-animator-expand-contract-text': string;
  '--theme-animator-glow-bg': string;
  '--theme-animator-glow-shadow': string;
  '--theme-animator-pulse-border': string;
  '--theme-animator-pulse-text': string;
  '--theme-animator-nostril-active-bg': string;
  '--theme-animator-nostril-inactive-bg': string;
  '--theme-animator-ripple-bg': string;
  '--theme-animator-ripple-border': string;
  '--theme-animator-instructional-bg': string;
  '--theme-animator-instructional-border': string;
  '--theme-animator-instructional-text': string;
  '--theme-animator-instructional-accent': string;

  '--theme-icon-primary': string;
  '--theme-icon-muted': string;
  '--theme-icon-light': string;
  '--theme-icon-brain': string;
  '--theme-icon-brain-header': string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const themes: Theme[] = [
  {
    id: 'pristineLight',
    name: 'Pristine Light',
    colors: {
      '--theme-bg-page': '#FBFDFF', // Very light, almost white with a hint of cool tone
      '--theme-bg-card': '#FFFFFF',
      '--theme-bg-header': '#0F766E', // Darker Teal for contrast
      '--theme-bg-footer': '#0F766E', 
      '--theme-bg-shanti-speaks': '#E6FFFA', // Very light teal
      '--theme-bg-shanti-avatar': '#2DD4BF', // Bright Teal
      '--theme-bg-modal': '#FFFFFF',

      '--theme-text-heading': '#1E293B', // Slate 800
      '--theme-text-body': '#334155',   // Slate 700
      '--theme-text-muted': '#64748B',  // Slate 500
      '--theme-text-link': '#0E7490',   // Cyan 700
      '--theme-text-on-primary-action': '#FFFFFF',
      '--theme-text-on-secondary-action': '#1E293B', // Slate 800
      '--theme-text-on-header': '#F0FDFA', // Teal 50
      '--theme-text-on-footer': '#CCFBF1', // Teal 100
      '--theme-text-on-shanti-avatar': '#0D47A1', // Dark blue for contrast on bright teal

      '--theme-action-primary-bg': '#14B8A6', // Teal 500
      '--theme-action-primary-bg-hover': '#0D9488', // Teal 600
      '--theme-action-primary-text': '#FFFFFF',
      '--theme-action-secondary-bg': '#F1F5F9', // Slate 100
      '--theme-action-secondary-bg-hover': '#E2E8F0', // Slate 200
      '--theme-action-secondary-text': '#334155',   // Slate 700
      
      '--theme-border-interactive': '#CBD5E1', // Slate 300
      '--theme-border-decorative': '#E2E8F0', // Slate 200
      '--theme-border-shanti-speaks': '#A7F3D0', // Green 200 (was teal)

      '--theme-highlight-focus': '#2DD4BF', // Teal 400
      '--theme-highlight-accent': '#14B8A6', // Teal 500
      '--theme-highlight-subtle': '#F0FDFA', // Teal 50

      '--theme-animator-expand-contract-bg': '#A5F3FC', // Cyan 200
      '--theme-animator-expand-contract-text': '#083344', // Cyan 950
      '--theme-animator-glow-bg': '#99F6E4', // Teal 200
      '--theme-animator-glow-shadow': 'rgba(45, 212, 191, 0.5)', // Teal 400 with alpha
      '--theme-animator-pulse-border': '#CBD5E1', // Slate 300
      '--theme-animator-pulse-text': '#475569', // Slate 600
      '--theme-animator-nostril-active-bg': '#67E8F9', // Cyan 300
      '--theme-animator-nostril-inactive-bg': '#E0F2FE', // Sky 100
      '--theme-animator-ripple-bg': '#A5B4FC', // Indigo 300
      '--theme-animator-ripple-border': '#C7D2FE', // Indigo 200
      '--theme-animator-instructional-bg': '#F8FAFC', // Slate 50
      '--theme-animator-instructional-border': '#E2E8F0', // Slate 200
      '--theme-animator-instructional-text': '#334155', // Slate 700
      '--theme-animator-instructional-accent': '#2DD4BF', // Teal 400

      '--theme-icon-primary': '#14B8A6', // Teal 500
      '--theme-icon-muted': '#94A3B8',  // Slate 400
      '--theme-icon-light': '#CCFBF1', // Teal 100
      '--theme-icon-brain': '#14B8A6', // Teal 500 (used in welcome)
      '--theme-icon-brain-header': '#99F6E4', // Teal 200 (used in header)
    }
  },
  {
    id: 'sereneDawn',
    name: 'Serene Dawn',
    colors: {
      '--theme-bg-page': '#FFF7ED', // Very light orange/cream
      '--theme-bg-card': '#FFFFFF',
      '--theme-bg-header': '#D97706', // Amber 700
      '--theme-bg-footer': '#D97706',
      '--theme-bg-shanti-speaks': '#FFFAF0', // FloralWhite
      '--theme-bg-shanti-avatar': '#FDBA74', // Orange 300
      '--theme-bg-modal': '#FFFFFF',

      '--theme-text-heading': '#5C2D04', // Dark Brown
      '--theme-text-body': '#6B4623',   // Medium Brown
      '--theme-text-muted': '#92704E',  // Light Brown
      '--theme-text-link': '#C2410C',   // Orange 600
      '--theme-text-on-primary-action': '#FFFFFF',
      '--theme-text-on-secondary-action': '#5C2D04',
      '--theme-text-on-header': '#FFFBEB', // Amber 50
      '--theme-text-on-footer': '#FEF3C7', // Amber 100
      '--theme-text-on-shanti-avatar': '#5C2D04',

      '--theme-action-primary-bg': '#F97316', // Orange 500
      '--theme-action-primary-bg-hover': '#EA580C', // Orange 600
      '--theme-action-primary-text': '#FFFFFF',
      '--theme-action-secondary-bg': '#FEF3C7', // Amber 100
      '--theme-action-secondary-bg-hover': '#FDE68A', // Amber 200
      '--theme-action-secondary-text': '#78350F',   // Amber 800
      
      '--theme-border-interactive': '#FDBA74', // Orange 300
      '--theme-border-decorative': '#FDE68A', // Amber 200
      '--theme-border-shanti-speaks': '#FED7AA', // Orange 200

      '--theme-highlight-focus': '#FB923C', // Orange 400
      '--theme-highlight-accent': '#F97316', // Orange 500
      '--theme-highlight-subtle': '#FFFBEB', // Amber 50

      '--theme-animator-expand-contract-bg': '#FDBA74', // Orange 300
      '--theme-animator-expand-contract-text': '#7C2D12', // Orange 900
      '--theme-animator-glow-bg': '#FED7AA', // Orange 200
      '--theme-animator-glow-shadow': 'rgba(251, 146, 60, 0.5)', // Orange 400 with alpha
      '--theme-animator-pulse-border': '#FDBA74', // Orange 300
      '--theme-animator-pulse-text': '#7C2D12', // Orange 900
      '--theme-animator-nostril-active-bg': '#FB923C', // Orange 400
      '--theme-animator-nostril-inactive-bg': '#FFE4C4', // Bisque
      '--theme-animator-ripple-bg': '#FCD34D', // Amber 400
      '--theme-animator-ripple-border': '#FDE68A', // Amber 200
      '--theme-animator-instructional-bg': '#FFFBEB', // Amber 50
      '--theme-animator-instructional-border': '#FEF3C7', // Amber 100
      '--theme-animator-instructional-text': '#78350F', // Amber 800
      '--theme-animator-instructional-accent': '#F97316', // Orange 500
      
      '--theme-icon-primary': '#F97316', // Orange 500
      '--theme-icon-muted': '#D1C0A8',  
      '--theme-icon-light': '#FEF3C7', // Amber 100
      '--theme-icon-brain': '#F97316',
      '--theme-icon-brain-header': '#FDBA74', // Orange 300
    }
  },
  {
    id: 'twilightCalm',
    name: 'Twilight Calm',
    colors: {
      '--theme-bg-page': '#1E293B',    // Slate 800 (Dark Blue-Gray)
      '--theme-bg-card': '#334155',    // Slate 700
      '--theme-bg-header': '#475569',  // Slate 600
      '--theme-bg-footer': '#475569',
      '--theme-bg-shanti-speaks': '#3B3C5E', // Darker Indigo/Purple
      '--theme-bg-shanti-avatar': '#818CF8', // Indigo 400
      '--theme-bg-modal': '#334155',    // Slate 700

      '--theme-text-heading': '#E2E8F0', // Slate 200
      '--theme-text-body': '#CBD5E1',   // Slate 300
      '--theme-text-muted': '#94A3B8',  // Slate 400
      '--theme-text-link': '#A5B4FC',   // Indigo 300
      '--theme-text-on-primary-action': '#FFFFFF',
      '--theme-text-on-secondary-action': '#E2E8F0', // Slate 200
      '--theme-text-on-header': '#F1F5F9', // Slate 100
      '--theme-text-on-footer': '#CBD5E1', // Slate 300
      '--theme-text-on-shanti-avatar': '#1E1B4B', // Indigo 950

      '--theme-action-primary-bg': '#6366F1', // Indigo 500
      '--theme-action-primary-bg-hover': '#4F46E5', // Indigo 600
      '--theme-action-primary-text': '#FFFFFF',
      '--theme-action-secondary-bg': '#475569', // Slate 600
      '--theme-action-secondary-bg-hover': '#52525B', // Zinc 600
      '--theme-action-secondary-text': '#E2E8F0',   // Slate 200
      
      '--theme-border-interactive': '#64748B', // Slate 500
      '--theme-border-decorative': '#475569', // Slate 600
      '--theme-border-shanti-speaks': '#5C527F', // Muted Purple

      '--theme-highlight-focus': '#818CF8', // Indigo 400
      '--theme-highlight-accent': '#6366F1', // Indigo 500
      '--theme-highlight-subtle': '#312E81', // Indigo 800

      '--theme-animator-expand-contract-bg': '#A5B4FC', // Indigo 300
      '--theme-animator-expand-contract-text': '#EEF2FF', // Indigo 50
      '--theme-animator-glow-bg': '#C7D2FE', // Indigo 200
      '--theme-animator-glow-shadow': 'rgba(129, 140, 248, 0.5)', // Indigo 400 with alpha
      '--theme-animator-pulse-border': '#64748B', // Slate 500
      '--theme-animator-pulse-text': '#CBD5E1', // Slate 300
      '--theme-animator-nostril-active-bg': '#818CF8', // Indigo 400
      '--theme-animator-nostril-inactive-bg': '#4A5568', // Gray 700 (Tailwind v1 name)
      '--theme-animator-ripple-bg': '#A78BFA', // Violet 400
      '--theme-animator-ripple-border': '#C4B5FD', // Violet 300
      '--theme-animator-instructional-bg': '#3E4C59', // Darker card
      '--theme-animator-instructional-border': '#475569', // Slate 600
      '--theme-animator-instructional-text': '#CBD5E1',   // Slate 300
      '--theme-animator-instructional-accent': '#A5B4FC',   // Indigo 300
      
      '--theme-icon-primary': '#A5B4FC', // Indigo 300
      '--theme-icon-muted': '#9CA3AF',  // Gray 400 (Tailwind v1)
      '--theme-icon-light': '#EEF2FF', // Indigo 50
      '--theme-icon-brain': '#A5B4FC',
      '--theme-icon-brain-header': '#C7D2FE', // Indigo 200
    }
  }
];
