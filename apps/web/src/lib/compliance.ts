export interface ChecklistDefinition {
  key: string;
  label: string;
  isRequired: boolean;
}

const COMMON_ITEMS: ChecklistDefinition[] = [
  { key: 'identity_verified', label: 'Government ID verified (Aadhaar/PAN)', isRequired: true },
  { key: 'background_check', label: 'Background verification passed', isRequired: true },
  { key: 'training_completed', label: '40-hour platform training completed', isRequired: true },
  { key: 'code_of_ethics', label: 'Code of ethics agreement signed', isRequired: true },
  { key: 'dpdp_consent', label: 'DPDP Act 2023 consent given', isRequired: true },
  { key: 'terms_agreed', label: 'Platform terms and conditions agreed', isRequired: true },
];

const TIER_ITEMS: Record<string, ChecklistDefinition[]> = {
  LISTENER: [],
  COUNSELOR: [
    { key: 'degree_verified', label: 'M.A./M.Sc. Psychology degree certificate verified', isRequired: true },
    { key: 'university_verified', label: 'University/institution verified', isRequired: true },
  ],
  PSYCHOLOGIST: [
    { key: 'degree_verified', label: 'Degree certificate verified', isRequired: true },
    { key: 'rci_registration', label: 'RCI registration verified and current', isRequired: true },
    { key: 'indemnity_insurance', label: 'Professional indemnity insurance verified', isRequired: true },
  ],
  PSYCHIATRIST: [
    { key: 'degree_verified', label: 'MBBS + MD Psychiatry degree verified', isRequired: true },
    { key: 'nmc_registration', label: 'NMC registration verified and current', isRequired: true },
    { key: 'indemnity_insurance', label: 'Professional indemnity insurance verified', isRequired: true },
  ],
};

export function getChecklistForTier(tier: string): ChecklistDefinition[] {
  return [...COMMON_ITEMS, ...(TIER_ITEMS[tier] || [])];
}

export const TIER_RATE_RANGES: Record<string, { min: number; max: number; label: string }> = {
  LISTENER: { min: 500, max: 2000, label: '₹5–20/min' },
  COUNSELOR: { min: 2000, max: 5000, label: '₹20–50/min' },
  PSYCHOLOGIST: { min: 5000, max: 15000, label: '₹50–150/min' },
  PSYCHIATRIST: { min: 10000, max: 25000, label: '₹100–250/min' },
};
