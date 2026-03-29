import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create provider users and their provider profiles
  const providers = [
    {
      name: 'Priya Sharma',
      email: 'priya@helpandheal.in',
      tier: 'LISTENER' as const,
      bio: "I'm a trained peer listener with a deep passion for helping others. Having navigated my own challenges with anxiety and stress, I understand what it feels like to need someone to talk to. I'm here to listen without judgment.",
      specialties: ['anxiety', 'stress', 'loneliness'],
      languages: ['Hindi', 'English'],
      ratePerMinute: 800,
      isOnline: true,
      ratingAvg: 4.8,
      totalSessions: 342,
      totalMinutes: 15200,
    },
    {
      name: 'Rahul Verma',
      email: 'rahul@helpandheal.in',
      tier: 'LISTENER' as const,
      bio: 'A compassionate listener who believes everyone deserves to be heard. I specialize in helping people dealing with work stress and relationship issues. Your safe space starts here.',
      specialties: ['relationships', 'work stress', 'self-esteem'],
      languages: ['Hindi', 'English'],
      ratePerMinute: 500,
      isOnline: true,
      ratingAvg: 4.6,
      totalSessions: 187,
      totalMinutes: 8400,
    },
    {
      name: 'Dr. Ananya Iyer',
      email: 'ananya@helpandheal.in',
      tier: 'COUNSELOR' as const,
      bio: 'M.Sc. in Clinical Psychology from NIMHANS, Bangalore. 6 years of experience in individual and group therapy. I use Cognitive Behavioral Therapy and mindfulness-based approaches to help you build resilience.',
      specialties: ['anxiety', 'depression', 'relationships', 'grief'],
      languages: ['English', 'Tamil', 'Hindi'],
      ratePerMinute: 3000,
      isOnline: true,
      ratingAvg: 4.9,
      totalSessions: 1240,
      totalMinutes: 62000,
    },
    {
      name: 'Kavitha Nair',
      email: 'kavitha@helpandheal.in',
      tier: 'COUNSELOR' as const,
      bio: 'M.A. Psychology with specialization in family therapy. I help individuals and couples navigate through difficult times with empathy and evidence-based techniques.',
      specialties: ['relationships', 'family issues', 'grief', 'life transitions'],
      languages: ['English', 'Malayalam', 'Hindi'],
      ratePerMinute: 2500,
      isOnline: false,
      ratingAvg: 4.7,
      totalSessions: 856,
      totalMinutes: 42800,
    },
    {
      name: 'Dr. Arjun Mehta',
      email: 'arjun@helpandheal.in',
      tier: 'PSYCHOLOGIST' as const,
      bio: 'RCI-registered Clinical Psychologist with 12 years of experience. PhD in Clinical Psychology from Delhi University. Specializing in trauma-informed care, anxiety disorders, and OCD.',
      specialties: ['anxiety', 'trauma', 'OCD', 'depression'],
      languages: ['Hindi', 'English'],
      ratePerMinute: 8000,
      isOnline: true,
      ratingAvg: 4.9,
      totalSessions: 2100,
      totalMinutes: 105000,
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha@helpandheal.in',
      tier: 'LISTENER' as const,
      bio: "Completed 40-hour listener training with a focus on active listening and emotional support. I'm here for you whether you need to vent, process your feelings, or just have someone to talk to.",
      specialties: ['loneliness', 'stress', 'self-esteem', 'academic pressure'],
      languages: ['English', 'Telugu', 'Hindi'],
      ratePerMinute: 700,
      isOnline: true,
      ratingAvg: 4.5,
      totalSessions: 98,
      totalMinutes: 4200,
    },
    {
      name: 'Dr. Meera Joshi',
      email: 'meera@helpandheal.in',
      tier: 'PSYCHOLOGIST' as const,
      bio: 'RCI-registered with M.Phil in Clinical Psychology from CIP Ranchi. 8 years of experience in treating mood disorders, anxiety, and personality disorders.',
      specialties: ['depression', 'anxiety', 'personality disorders', 'anger management'],
      languages: ['Hindi', 'English', 'Marathi'],
      ratePerMinute: 6000,
      isOnline: false,
      ratingAvg: 4.8,
      totalSessions: 1560,
      totalMinutes: 78000,
    },
    {
      name: 'Aditya Banerjee',
      email: 'aditya@helpandheal.in',
      tier: 'COUNSELOR' as const,
      bio: 'M.A. in Applied Psychology, certified in addiction counseling. I work with individuals struggling with substance use, behavioral addictions, and the emotional challenges that come with recovery.',
      specialties: ['addiction', 'stress', 'self-esteem', 'anger management'],
      languages: ['Hindi', 'English', 'Bengali'],
      ratePerMinute: 2000,
      isOnline: true,
      ratingAvg: 4.6,
      totalSessions: 620,
      totalMinutes: 31000,
    },
    {
      name: 'Nidhi Gupta',
      email: 'nidhi@helpandheal.in',
      tier: 'LISTENER' as const,
      bio: 'A trained peer listener with a warm heart and open ears. I believe that sometimes all we need is someone who truly listens. Available for late-night conversations.',
      specialties: ['loneliness', 'relationships', 'sleep issues', 'stress'],
      languages: ['Hindi', 'English'],
      ratePerMinute: 600,
      isOnline: true,
      ratingAvg: 4.7,
      totalSessions: 215,
      totalMinutes: 9600,
    },
    {
      name: 'Dr. Sanjay Krishnan',
      email: 'sanjay@helpandheal.in',
      tier: 'PSYCHOLOGIST' as const,
      bio: 'RCI-registered Clinical Psychologist, PhD from AIIMS Delhi. 15 years of experience in treating PTSD, complex trauma, and severe anxiety. Former consultant at NIMHANS.',
      specialties: ['trauma', 'PTSD', 'anxiety', 'depression'],
      languages: ['English', 'Hindi', 'Tamil'],
      ratePerMinute: 10000,
      isOnline: true,
      ratingAvg: 5.0,
      totalSessions: 3200,
      totalMinutes: 160000,
    },
  ];

  for (const p of providers) {
    const user = await prisma.user.create({
      data: {
        name: p.name,
        email: p.email,
        languagePreference: 'en',
      },
    });

    await prisma.provider.create({
      data: {
        userId: user.id,
        tier: p.tier,
        displayName: p.name,
        bio: p.bio,
        specialties: p.specialties,
        languages: p.languages,
        ratePerMinute: p.ratePerMinute,
        isOnline: p.isOnline,
        isVerified: true,
        ratingAvg: p.ratingAvg,
        totalSessions: p.totalSessions,
        totalMinutes: p.totalMinutes,
      },
    });
  }

  console.log(`Seeded ${providers.length} providers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
