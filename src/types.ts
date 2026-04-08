export type BeliefSystem = 'christian' | 'islamic' | 'bahai' | 'gnostic' | 'secular' | 'stoic' | 'none';

export interface Message {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  voice?: string;
}

export interface Document {
  id: number;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

export interface AppSettings {
  theme: string;
  tier: 'free' | 'paid';
  user_name: string;
  assistant_name: string;
  belief_system: BeliefSystem;
  doctrine: string;
  onboarding_complete: boolean;
}

export interface Voice {
  id: string;
  name: string;
  description: string;
  voice: string;
  belief: BeliefSystem[];
}

export const HISTORICAL_VOICES: Voice[] = [
  // Christian
  { id: 'paul', name: 'Paul of Tarsus', description: 'Apostle and theologian of the early church.', voice: 'Charon', belief: ['christian'] },
  { id: 'augustine', name: 'Augustine of Hippo', description: 'Philosopher and theologian of grace.', voice: 'Puck', belief: ['christian'] },
  { id: 'lewis', name: 'C.S. Lewis', description: 'Modern apologist and author of Narnia.', voice: 'Zephyr', belief: ['christian'] },
  
  // Islamic
  { id: 'rumi', name: 'Rumi', description: 'Sufi mystic and poet of divine love.', voice: 'Kore', belief: ['islamic'] },
  { id: 'arabi', name: 'Ibn Arabi', description: 'The Greatest Master of Sufi metaphysics.', voice: 'Fenrir', belief: ['islamic'] },
  
  // Stoic
  { id: 'marcus', name: 'Marcus Aurelius', description: 'Stoic Emperor and author of Meditations.', voice: 'Zephyr', belief: ['stoic', 'secular'] },
  { id: 'epictetus', name: 'Epictetus', description: 'Former slave turned Stoic teacher.', voice: 'Charon', belief: ['stoic'] },
  
  // Gnostic
  { id: 'valentinus', name: 'Valentinus', description: 'Gnostic teacher of the Pleroma.', voice: 'Puck', belief: ['gnostic'] },
  
  // Secular / Universal
  { id: 'frankl', name: 'Viktor Frankl', description: 'Psychiatrist and Holocaust survivor, founder of Logotherapy.', voice: 'Kore', belief: ['secular', 'none'] },
  { id: 'rogers', name: 'Carl Rogers', description: 'Person-centered therapy and empathy.', voice: 'Kore', belief: ['secular', 'none'] },
  
  // System
  { id: 'system', name: 'System Assistant', description: 'Your personal app manager.', voice: 'Fenrir', belief: ['none', 'christian', 'islamic', 'bahai', 'gnostic', 'secular', 'stoic'] },
];

export const DOCTRINES: Record<BeliefSystem, { id: string, name: string, content: string }[]> = {
  christian: [
    { id: 'kjv', name: 'King James Version (KJV)', content: 'The Holy Bible, King James Version. Focus on traditional language and historical authority.' },
    { id: 'niv', name: 'New International Version (NIV)', content: 'The Holy Bible, New International Version. Focus on modern clarity and readability.' },
    { id: 'nasb', name: 'New American Standard Bible (NASB)', content: 'The Holy Bible, New American Standard Bible. Focus on literal translation accuracy.' },
  ],
  islamic: [
    { id: 'yusuf', name: 'Yusuf Ali Translation', content: 'The Holy Quran, translated by Abdullah Yusuf Ali. Focus on poetic English and commentary.' },
    { id: 'pickthall', name: 'Marmaduke Pickthall', content: 'The Holy Quran, translated by Marmaduke Pickthall. Focus on literal meaning.' },
  ],
  bahai: [
    { id: 'aqdas', name: 'Kitab-i-Aqdas', content: 'The Most Holy Book of the Baha\'i Faith. Focus on laws and spiritual principles.' },
  ],
  gnostic: [
    { id: 'nag', name: 'Nag Hammadi Library', content: 'Collection of Gnostic texts including the Gospel of Thomas and Secret Book of John.' },
  ],
  stoic: [
    { id: 'meditations', name: 'Meditations', content: 'The private notes of Marcus Aurelius on Stoic philosophy and self-discipline.' },
  ],
  secular: [
    { id: 'cbt', name: 'CBT Framework', content: 'Cognitive Behavioral Therapy principles focusing on thought patterns and behavior change.' },
  ],
  none: [],
};
