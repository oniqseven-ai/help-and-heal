export type ProviderTier = 'LISTENER' | 'COUNSELOR' | 'PSYCHOLOGIST';
export type SessionType = 'AUDIO' | 'CHAT' | 'VIDEO';
export type SessionStatus = 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Provider {
  id: string;
  displayName: string;
  tier: ProviderTier;
  bio: string;
  specialties: string[];
  languages: string[];
  ratePerMinute: number; // in paise
  isOnline: boolean;
  isVerified: boolean;
  ratingAvg: number;
  totalSessions: number;
  totalMinutes: number;
  initials: string;
  color: string;
}

export interface Session {
  id: string;
  providerId: string;
  providerName: string;
  type: SessionType;
  status: SessionStatus;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  totalCharged: number; // in paise
  ratingScore: number | null;
  moodBefore: number | null;
  moodAfter: number | null;
}

export interface WalletTransaction {
  id: string;
  type: 'RECHARGE' | 'SESSION_DEBIT' | 'REFUND' | 'BONUS';
  amount: number; // in paise
  description: string;
  createdAt: string;
}

const COLORS = ['#4A90D9', '#7BC67E', '#F5A623', '#E24B4A', '#9B59B6', '#1ABC9C', '#E67E22', '#2ECC71'];

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: '1',
    displayName: 'Priya Sharma',
    tier: 'LISTENER',
    bio: 'I\'m a trained peer listener with a deep passion for helping others. Having navigated my own challenges with anxiety and stress, I understand what it feels like to need someone to talk to. I\'m here to listen without judgment.',
    specialties: ['anxiety', 'stress', 'loneliness'],
    languages: ['Hindi', 'English'],
    ratePerMinute: 800,
    isOnline: true,
    isVerified: true,
    ratingAvg: 4.8,
    totalSessions: 342,
    totalMinutes: 15200,
    initials: 'PS',
    color: COLORS[0],
  },
  {
    id: '2',
    displayName: 'Rahul Verma',
    tier: 'LISTENER',
    bio: 'A compassionate listener who believes everyone deserves to be heard. I specialize in helping people dealing with work stress and relationship issues. Your safe space starts here.',
    specialties: ['relationships', 'work stress', 'self-esteem'],
    languages: ['Hindi', 'English'],
    ratePerMinute: 500,
    isOnline: true,
    isVerified: true,
    ratingAvg: 4.6,
    totalSessions: 187,
    totalMinutes: 8400,
    initials: 'RV',
    color: COLORS[1],
  },
  {
    id: '3',
    displayName: 'Dr. Ananya Iyer',
    tier: 'COUNSELOR',
    bio: 'M.Sc. in Clinical Psychology from NIMHANS, Bangalore. 6 years of experience in individual and group therapy. I use Cognitive Behavioral Therapy and mindfulness-based approaches to help you build resilience.',
    specialties: ['anxiety', 'depression', 'relationships', 'grief'],
    languages: ['English', 'Tamil', 'Hindi'],
    ratePerMinute: 3000,
    isOnline: true,
    isVerified: true,
    ratingAvg: 4.9,
    totalSessions: 1240,
    totalMinutes: 62000,
    initials: 'AI',
    color: COLORS[2],
  },
  {
    id: '4',
    displayName: 'Kavitha Nair',
    tier: 'COUNSELOR',
    bio: 'M.A. Psychology with specialization in family therapy. I help individuals and couples navigate through difficult times with empathy and evidence-based techniques.',
    specialties: ['relationships', 'family issues', 'grief', 'life transitions'],
    languages: ['English', 'Malayalam', 'Hindi'],
    ratePerMinute: 2500,
    isOnline: false,
    isVerified: true,
    ratingAvg: 4.7,
    totalSessions: 856,
    totalMinutes: 42800,
    initials: 'KN',
    color: COLORS[3],
  },
  {
    id: '5',
    displayName: 'Dr. Arjun Mehta',
    tier: 'PSYCHOLOGIST',
    bio: 'RCI-registered Clinical Psychologist with 12 years of experience. PhD in Clinical Psychology from Delhi University. Specializing in trauma-informed care, anxiety disorders, and OCD.',
    specialties: ['anxiety', 'trauma', 'OCD', 'depression'],
    languages: ['Hindi', 'English'],
    ratePerMinute: 8000,
    isOnline: true,
    isVerified: true,
    ratingAvg: 4.9,
    totalSessions: 2100,
    totalMinutes: 105000,
    initials: 'AM',
    color: COLORS[4],
  },
  {
    id: '6',
    displayName: 'Sneha Reddy',
    tier: 'LISTENER',
    bio: 'Completed 40-hour listener training with a focus on active listening and emotional support. I\'m here for you whether you need to vent, process your feelings, or just have someone to talk to.',
    specialties: ['loneliness', 'stress', 'self-esteem', 'academic pressure'],
    languages: ['English', 'Telugu', 'Hindi'],
    ratePerMinute: 700,
    isOnline: true,
    isVerified: true,
    ratingAvg: 4.5,
    totalSessions: 98,
    totalMinutes: 4200,
    initials: 'SR',
    color: COLORS[5],
  },
  {
    id: '7',
    displayName: 'Dr. Meera Joshi',
    tier: 'PSYCHOLOGIST',
    bio: 'RCI-registered with M.Phil in Clinical Psychology from CIP Ranchi. 8 years of experience in treating mood disorders, anxiety, and personality disorders. I use an integrative approach combining CBT and psychodynamic therapy.',
    specialties: ['depression', 'anxiety', 'personality disorders', 'anger management'],
    languages: ['Hindi', 'English', 'Marathi'],
    ratePerMinute: 6000,
    isOnline: false,
    isVerified: true,
    ratingAvg: 4.8,
    totalSessions: 1560,
    totalMinutes: 78000,
    initials: 'MJ',
    color: COLORS[6],
  },
  {
    id: '8',
    displayName: 'Aditya Banerjee',
    tier: 'COUNSELOR',
    bio: 'M.A. in Applied Psychology, certified in addiction counseling. I work with individuals struggling with substance use, behavioral addictions, and the emotional challenges that come with recovery.',
    specialties: ['addiction', 'stress', 'self-esteem', 'anger management'],
    languages: ['Hindi', 'English', 'Bengali'],
    ratePerMinute: 2000,
    isOnline: true,
    isVerified: true,
    ratingAvg: 4.6,
    totalSessions: 620,
    totalMinutes: 31000,
    initials: 'AB',
    color: COLORS[7],
  },
  {
    id: '9',
    displayName: 'Nidhi Gupta',
    tier: 'LISTENER',
    bio: 'A trained peer listener with a warm heart and open ears. I believe that sometimes all we need is someone who truly listens. Fluent in Hindi and English, available for late-night conversations.',
    specialties: ['loneliness', 'relationships', 'sleep issues', 'stress'],
    languages: ['Hindi', 'English'],
    ratePerMinute: 600,
    isOnline: true,
    isVerified: true,
    ratingAvg: 4.7,
    totalSessions: 215,
    totalMinutes: 9600,
    initials: 'NG',
    color: COLORS[0],
  },
  {
    id: '10',
    displayName: 'Dr. Sanjay Krishnan',
    tier: 'PSYCHOLOGIST',
    bio: 'RCI-registered Clinical Psychologist, PhD from AIIMS Delhi. 15 years of experience in treating PTSD, complex trauma, and severe anxiety. Former consultant at NIMHANS.',
    specialties: ['trauma', 'PTSD', 'anxiety', 'depression'],
    languages: ['English', 'Hindi', 'Tamil'],
    ratePerMinute: 10000,
    isOnline: true,
    isVerified: true,
    ratingAvg: 5.0,
    totalSessions: 3200,
    totalMinutes: 160000,
    initials: 'SK',
    color: COLORS[1],
  },
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    providerId: '3',
    providerName: 'Dr. Ananya Iyer',
    type: 'AUDIO',
    status: 'COMPLETED',
    startedAt: '2026-03-28T14:30:00Z',
    endedAt: '2026-03-28T14:52:00Z',
    durationSeconds: 1320,
    totalCharged: 66000,
    ratingScore: 5,
    moodBefore: 3,
    moodAfter: 7,
  },
  {
    id: 's2',
    providerId: '1',
    providerName: 'Priya Sharma',
    type: 'CHAT',
    status: 'COMPLETED',
    startedAt: '2026-03-25T21:00:00Z',
    endedAt: '2026-03-25T21:15:00Z',
    durationSeconds: 900,
    totalCharged: 12000,
    ratingScore: 4,
    moodBefore: 4,
    moodAfter: 7,
  },
  {
    id: 's3',
    providerId: '8',
    providerName: 'Aditya Banerjee',
    type: 'AUDIO',
    status: 'COMPLETED',
    startedAt: '2026-03-20T10:00:00Z',
    endedAt: '2026-03-20T10:30:00Z',
    durationSeconds: 1800,
    totalCharged: 60000,
    ratingScore: 5,
    moodBefore: 2,
    moodAfter: 6,
  },
];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: 't1', type: 'RECHARGE', amount: 49900, description: 'Wallet recharge', createdAt: '2026-03-28T10:00:00Z' },
  { id: 't2', type: 'SESSION_DEBIT', amount: -66000, description: 'Session with Dr. Ananya Iyer (22 min)', createdAt: '2026-03-28T14:52:00Z' },
  { id: 't3', type: 'RECHARGE', amount: 99900, description: 'Wallet recharge', createdAt: '2026-03-24T18:00:00Z' },
  { id: 't4', type: 'SESSION_DEBIT', amount: -12000, description: 'Session with Priya Sharma (15 min)', createdAt: '2026-03-25T21:15:00Z' },
  { id: 't5', type: 'SESSION_DEBIT', amount: -60000, description: 'Session with Aditya Banerjee (30 min)', createdAt: '2026-03-20T10:30:00Z' },
  { id: 't6', type: 'BONUS', amount: 10000, description: 'Welcome bonus', createdAt: '2026-03-18T12:00:00Z' },
  { id: 't7', type: 'RECHARGE', amount: 19900, description: 'Wallet recharge', createdAt: '2026-03-18T11:00:00Z' },
];

export const MOCK_WALLET_BALANCE = 41800; // in paise = ₹418

export const SPECIALTIES = [
  'anxiety', 'depression', 'stress', 'relationships', 'loneliness',
  'grief', 'self-esteem', 'anger management', 'trauma', 'OCD',
  'addiction', 'work stress', 'family issues', 'academic pressure',
  'sleep issues', 'life transitions',
];

export const RECHARGE_PACKS = [
  { amount: 9900, label: '₹99', popular: false },
  { amount: 19900, label: '₹199', popular: false },
  { amount: 49900, label: '₹499', popular: true },
  { amount: 99900, label: '₹999', popular: false },
  { amount: 199900, label: '₹1,999', popular: false },
];

export function formatPaise(paise: number): string {
  const rupees = Math.abs(paise) / 100;
  const formatted = rupees.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return `${paise < 0 ? '-' : ''}₹${formatted}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function tierLabel(tier: ProviderTier): string {
  switch (tier) {
    case 'LISTENER': return 'Peer Listener';
    case 'COUNSELOR': return 'Counselor';
    case 'PSYCHOLOGIST': return 'Psychologist';
  }
}

export function tierColor(tier: ProviderTier): string {
  switch (tier) {
    case 'LISTENER': return 'bg-secondary/10 text-secondary-dark';
    case 'COUNSELOR': return 'bg-primary/10 text-primary-dark';
    case 'PSYCHOLOGIST': return 'bg-purple-100 text-purple-700';
  }
}
