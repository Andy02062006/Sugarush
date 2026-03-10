export interface UserProfile {
  name: string;
  diabetesType: 'Type 1' | 'Type 2' | 'Gestational' | 'Prediabetes';
  age: number;
  targetRangeMin: number;
  targetRangeMax: number;
  avatarUrl?: string;
}

export interface GlucoseLog {
  id: string;
  value: number;
  timestamp: string;
  mealType: string;
  insulin?: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  nameTamil: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients: string[];
  imageUrl: string;
  prepTime: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export const MOCK_DAILY_TIPS = [
  "Walking for 10 minutes after a meal can significantly reduce your blood sugar spike.",
  "Stay hydrated! Drinking water helps your kidneys flush out excess sugar through urine.",
  "Pair your carbs with protein or fat to slow down digestion and prevent sugar crashes.",
  "Stress levels can directly impact your glucose. Try 5 minutes of deep breathing today.",
  "A consistent sleep schedule helps regulate the hormones that control your blood sugar."
];

export const MOCK_LOGS: GlucoseLog[] = [
  {
    id: '1',
    value: 125,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    mealType: 'After Lunch',
    insulin: 4,
    notes: 'Had a salad and grilled chicken'
  },
  {
    id: '2',
    value: 95,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    mealType: 'Before Lunch',
    insulin: 0
  },
  {
    id: '3',
    value: 145,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // Yesterday evening
    mealType: 'After Dinner',
    insulin: 6,
    notes: 'Ate out, might have had hidden sugars'
  },
  {
    id: '4',
    value: 110,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday morning
    mealType: 'Fasting',
    insulin: 0
  }
];

export const MOCK_WEEKLY_DATA = [
  { day: 'Mon', avg: 115, min: 85, max: 140 },
  { day: 'Tue', avg: 122, min: 90, max: 155 },
  { day: 'Wed', avg: 108, min: 88, max: 135 },
  { day: 'Thu', avg: 130, min: 95, max: 165 },
  { day: 'Fri', avg: 118, min: 85, max: 145 },
  { day: 'Sat', avg: 125, min: 92, max: 150 },
  { day: 'Sun', avg: 112, min: 86, max: 138 }
];

export const MOCK_BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'First steps',
    description: 'Logged your first glucose reading',
    icon: 'Footprints',
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: 'b2',
    name: '3-Day Streak',
    description: 'Logged readings for 3 consecutive days',
    icon: 'Flame',
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    id: 'b3',
    name: 'In the Zone',
    description: 'Kept glucose in target range all day',
    icon: 'Target',
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'b4',
    name: '7-Day Streak',
    description: 'Logged readings for 7 consecutive days',
    icon: 'Award'
  },
  {
    id: 'b5',
    name: 'Recipe Master',
    description: 'Tried 5 healthy recipes',
    icon: 'ChefHat'
  }
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Quinoa Veggie Bowl',
    nameTamil: 'கினோவா காய்கறி கிண்ணம் (Quinoa Veggie Bowl)',
    description: 'A low-GI fiber-rich lunch packed with roasted vegetables and a lemon tahini dressing.',
    calories: 320,
    carbs: 35,
    protein: 12,
    fat: 15,
    ingredients: ['quinoa', 'broccoli', 'carrots', 'tahini', 'lemon', 'olive oil', 'chickpeas'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    prepTime: '20 mins'
  },
  {
    id: 'r2',
    name: 'Millet Dosa (Kambu Dosa)',
    nameTamil: 'கம்பு தோசை (Pearl Millet Dosa)',
    description: 'A traditional South Indian breakfast alternative. Pearl millet has a low glycemic index and is very filling.',
    calories: 140,
    carbs: 22,
    protein: 4,
    fat: 3,
    ingredients: ['pearl millet', 'urad dal', 'fenugreek seeds', 'salt', 'water'],
    imageUrl: 'https://images.unsplash.com/photo-1668225576189-e15fc720023a?w=500&q=80',
    prepTime: '24 hours (fermentation)'
  },
  {
    id: 'r3',
    name: 'Almond Flour Pancakes',
    nameTamil: 'பாதாம் மாவு பேன்கேக் (Almond Flour Pancakes)',
    description: 'Fluffy, low-carb pancakes perfect for a weekend breakfast without the sugar spike.',
    calories: 280,
    carbs: 10,
    protein: 14,
    fat: 22,
    ingredients: ['almond flour', 'eggs', 'baking powder', 'almond milk', 'vanilla extract', 'stevia'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80',
    prepTime: '15 mins'
  },
  {
    id: 'r4',
    name: 'Grilled Salmon & Asparagus',
    nameTamil: 'கிரில் செய்யப்பட்ட சால்மன் மற்றும் அஸ்பாரகஸ்',
    description: 'High in Omega-3 fatty acids which reduce inflammation and improve insulin sensitivity.',
    calories: 410,
    carbs: 8,
    protein: 38,
    fat: 24,
    ingredients: ['salmon fillet', 'asparagus', 'olive oil', 'lemon', 'garlic', 'black pepper'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80',
    prepTime: '25 mins'
  }
];
