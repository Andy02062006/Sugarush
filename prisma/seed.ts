import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sugarush database seed...\n');

  // ─── 1. CREATE DEMO USER ─────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@sugarush.com' },
    update: { name: 'Jan', password: hashedPassword },
    create: {
      name: 'Jan',
      email: 'demo@sugarush.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ User: ${user.name} (${user.email}) — id: ${user.id}`);

  // ─── 2. PROFILE ──────────────────────────────────────────────────────────
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: { xp: 850, streak: 7 },
    create: {
      userId: user.id,
      diabetesType: 'Type 2',
      age: 35,
      targetRangeMin: 70,
      targetRangeMax: 140,
      xp: 850,
      streak: 7,
    },
  });
  console.log('✅ Profile seeded (Type 2, XP: 850, Streak: 7)');

  // ─── 3. GLUCOSE LOGS ─────────────────────────────────────────────────────
  // Delete existing to avoid duplicates on re-run
  await prisma.glucoseLog.deleteMany({ where: { userId: user.id } });

  const glucoseLogs = [
    { value: 125, mealType: 'After Lunch', insulin: 4, notes: 'Had a salad and grilled chicken', hoursAgo: 2 },
    { value: 95,  mealType: 'Before Lunch', insulin: 0, notes: null, hoursAgo: 5 },
    { value: 145, mealType: 'After Dinner', insulin: 6, notes: 'Ate out, might have had hidden sugars', hoursAgo: 20 },
    { value: 110, mealType: 'Fasting', insulin: 0, notes: null, hoursAgo: 24 },
    { value: 132, mealType: 'After Breakfast', insulin: 3, notes: 'Had dosa with coconut chutney', hoursAgo: 30 },
    { value: 88,  mealType: 'Fasting', insulin: 0, notes: 'Morning reading', hoursAgo: 48 },
    { value: 156, mealType: 'After Dinner', insulin: 5, notes: 'Birthday dinner — cake', hoursAgo: 52 },
    { value: 101, mealType: 'Before Lunch', insulin: 0, notes: null, hoursAgo: 72 },
  ];

  for (const log of glucoseLogs) {
    await prisma.glucoseLog.create({
      data: {
        userId: user.id,
        value: log.value,
        mealType: log.mealType,
        insulin: log.insulin || undefined,
        notes: log.notes || undefined,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * log.hoursAgo),
      },
    });
  }
  console.log(`✅ ${glucoseLogs.length} Glucose logs seeded`);

  // ─── 4. MEAL LOGS WITH FOOD ITEMS ────────────────────────────────────────
  await prisma.foodItem.deleteMany({});
  await prisma.mealLog.deleteMany({ where: { userId: user.id } });

  const mealLogs = [
    {
      hoursAgo: 1, notes: 'Large lunch at home',
      glucoseBeforeMeal: 102, glucoseAfterMeal: 178, spikeDetected: true, spikeAmount: 76,
      foods: [
        { name: 'White Rice', portionSize: '2 cups', estimatedCarbs: 90 },
        { name: 'Dal Curry', portionSize: '1 bowl', estimatedCarbs: 20 },
        { name: 'Papad', portionSize: '2 pieces', estimatedCarbs: 10 },
      ],
    },
    {
      hoursAgo: 7, notes: 'Healthy breakfast',
      glucoseBeforeMeal: 98, glucoseAfterMeal: 118, spikeDetected: false, spikeAmount: 20,
      foods: [
        { name: 'Oats Porridge', portionSize: '1 bowl', estimatedCarbs: 27 },
        { name: 'Almonds', portionSize: '10 pieces', estimatedCarbs: 3 },
        { name: 'Black Coffee', portionSize: '1 cup', estimatedCarbs: 0 },
      ],
    },
    {
      hoursAgo: 24, notes: 'Ate out at KFC',
      glucoseBeforeMeal: 105, glucoseAfterMeal: 195, spikeDetected: true, spikeAmount: 90,
      foods: [
        { name: 'White Rice', portionSize: '1.5 cups', estimatedCarbs: 67 },
        { name: 'Soda (Sprite)', portionSize: '1 can', estimatedCarbs: 39 },
        { name: 'Fried Chicken', portionSize: '2 pieces', estimatedCarbs: 15 },
      ],
    },
    {
      hoursAgo: 30, notes: 'Clean dinner',
      glucoseBeforeMeal: 100, glucoseAfterMeal: 112, spikeDetected: false, spikeAmount: 12,
      foods: [
        { name: 'Grilled Chicken', portionSize: '200g', estimatedCarbs: 0 },
        { name: 'Salad', portionSize: '1 large bowl', estimatedCarbs: 8 },
        { name: 'Olive Oil Dressing', portionSize: '1 tbsp', estimatedCarbs: 0 },
      ],
    },
    {
      hoursAgo: 48, notes: 'Quick breakfast',
      glucoseBeforeMeal: 96, glucoseAfterMeal: 172, spikeDetected: true, spikeAmount: 76,
      foods: [
        { name: 'White Bread', portionSize: '3 slices', estimatedCarbs: 45 },
        { name: 'Jam', portionSize: '2 tbsp', estimatedCarbs: 28 },
        { name: 'Orange Juice', portionSize: '1 glass', estimatedCarbs: 26 },
      ],
    },
    {
      hoursAgo: 54, notes: 'Breakfast',
      glucoseBeforeMeal: 99, glucoseAfterMeal: 138, spikeDetected: true, spikeAmount: 39,
      foods: [
        { name: 'Idli', portionSize: '3 pieces', estimatedCarbs: 45 },
        { name: 'Sambar', portionSize: '1 bowl', estimatedCarbs: 15 },
        { name: 'Coconut Chutney', portionSize: '2 tbsp', estimatedCarbs: 4 },
      ],
    },
    {
      hoursAgo: 72, notes: undefined,
      glucoseBeforeMeal: 101, glucoseAfterMeal: 119, spikeDetected: false, spikeAmount: 18,
      foods: [
        { name: 'Quinoa Bowl', portionSize: '1 bowl', estimatedCarbs: 35 },
        { name: 'Avocado', portionSize: 'half', estimatedCarbs: 4 },
        { name: 'Boiled Eggs', portionSize: '2', estimatedCarbs: 1 },
      ],
    },
    {
      hoursAgo: 80, notes: 'Dinner with family',
      glucoseBeforeMeal: 107, glucoseAfterMeal: 192, spikeDetected: true, spikeAmount: 85,
      foods: [
        { name: 'White Rice', portionSize: '2 cups', estimatedCarbs: 90 },
        { name: 'Chicken Curry', portionSize: '1 bowl', estimatedCarbs: 12 },
        { name: 'Soda (Coke)', portionSize: '300ml', estimatedCarbs: 33 },
      ],
    },
    {
      hoursAgo: 96, notes: 'Healthy breakfast choice',
      glucoseBeforeMeal: 97, glucoseAfterMeal: 122, spikeDetected: false, spikeAmount: 25,
      foods: [
        { name: 'Millet Dosa', portionSize: '2 dosas', estimatedCarbs: 44 },
        { name: 'Tomato Chutney', portionSize: '3 tbsp', estimatedCarbs: 5 },
      ],
    },
    {
      hoursAgo: 104, notes: 'Birthday party',
      glucoseBeforeMeal: 103, glucoseAfterMeal: 198, spikeDetected: true, spikeAmount: 95,
      foods: [
        { name: 'Chocolate Cake', portionSize: '1 slice', estimatedCarbs: 52 },
        { name: 'Soda (Pepsi)', portionSize: '1 can', estimatedCarbs: 41 },
      ],
    },
    {
      hoursAgo: 120, notes: undefined,
      glucoseBeforeMeal: 100, glucoseAfterMeal: 121, spikeDetected: false, spikeAmount: 21,
      foods: [
        { name: 'Grilled Salmon', portionSize: '200g', estimatedCarbs: 0 },
        { name: 'Asparagus', portionSize: '1 cup', estimatedCarbs: 5 },
        { name: 'Brown Rice', portionSize: '0.5 cup', estimatedCarbs: 23 },
      ],
    },
    {
      hoursAgo: 128, notes: 'Rushed morning',
      glucoseBeforeMeal: 95, glucoseAfterMeal: 162, spikeDetected: true, spikeAmount: 67,
      foods: [
        { name: 'White Bread', portionSize: '2 slices', estimatedCarbs: 30 },
        { name: 'Butter', portionSize: '1 tbsp', estimatedCarbs: 0 },
        { name: 'Orange Juice', portionSize: '1 glass', estimatedCarbs: 26 },
        { name: 'Banana', portionSize: '1 medium', estimatedCarbs: 27 },
      ],
    },
  ];

  for (const meal of mealLogs) {
    const createdMeal = await prisma.mealLog.create({
      data: {
        userId: user.id,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * meal.hoursAgo),
        notes: meal.notes || undefined,
        glucoseBeforeMeal: meal.glucoseBeforeMeal,
        glucoseAfterMeal: meal.glucoseAfterMeal,
        spikeDetected: meal.spikeDetected,
        spikeAmount: meal.spikeAmount,
      },
    });

    for (const food of meal.foods) {
      await prisma.foodItem.create({
        data: {
          mealLogId: createdMeal.id,
          name: food.name,
          portionSize: food.portionSize,
          estimatedCarbs: food.estimatedCarbs,
        },
      });
    }
  }
  console.log(`✅ ${mealLogs.length} Meal logs seeded (with ${mealLogs.reduce((a, m) => a + m.foods.length, 0)} food items)`);

  // ─── 5. BADGES ───────────────────────────────────────────────────────────
  await prisma.userBadge.deleteMany({ where: { userId: user.id } });

  const badges = [
    { badgeId: 'b1', daysAgo: 7 },
    { badgeId: 'b2', daysAgo: 4 },
    { badgeId: 'b3', daysAgo: 0 },
  ];

  for (const badge of badges) {
    await prisma.userBadge.create({
      data: {
        userId: user.id,
        badgeId: badge.badgeId,
        unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * badge.daysAgo),
      },
    });
  }
  console.log(`✅ ${badges.length} Badges seeded`);

  // ─── 6. RECIPES ──────────────────────────────────────────────────────────
  await prisma.recipe.deleteMany({});

  const recipes = [
    {
      name: 'Quinoa Veggie Bowl',
      nameTamil: 'கினோவா காய்கறி கிண்ணம் (Quinoa Veggie Bowl)',
      description: 'A low-GI fiber-rich lunch packed with roasted vegetables and a lemon tahini dressing.',
      calories: 320, carbs: 35, protein: 12, fat: 15,
      ingredients: ['quinoa', 'broccoli', 'carrots', 'tahini', 'lemon', 'olive oil', 'chickpeas'],
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
      prepTime: '20 mins',
    },
    {
      name: 'Millet Dosa (Kambu Dosa)',
      nameTamil: 'கம்பு தோசை (Pearl Millet Dosa)',
      description: 'A traditional South Indian breakfast alternative. Pearl millet has a low glycemic index and is very filling.',
      calories: 140, carbs: 22, protein: 4, fat: 3,
      ingredients: ['pearl millet', 'urad dal', 'fenugreek seeds', 'salt', 'water'],
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
      prepTime: '24 hours (fermentation)',
    },
    {
      name: 'Quinoa & Black Bean Bowl',
      nameTamil: 'கினோவா மற்றும் கருப்பு பீன் கிண்ணம்',
      description: 'High fiber, low GI meal pre-cooked for convenience.',
      calories: 320, carbs: 45, protein: 15, fat: 8,
      ingredients: ['quinoa', 'black beans', 'corn', 'bell peppers', 'avocado', 'lime juice'],
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
      prepTime: '20 mins',
    },
    {
      name: 'Almond Flour Pancakes',
      nameTamil: 'பாதாம் மாவு பேன்கேக் (Almond Flour Pancakes)',
      description: 'Fluffy, low-carb pancakes perfect for a weekend breakfast without the sugar spike.',
      calories: 280, carbs: 10, protein: 14, fat: 22,
      ingredients: ['almond flour', 'eggs', 'baking powder', 'almond milk', 'vanilla extract', 'stevia'],
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80',
      prepTime: '15 mins',
    },
    {
      name: 'Grilled Salmon & Asparagus',
      nameTamil: 'கிரில் செய்யப்பட்ட சால்மன் மற்றும் அஸ்பாரகஸ்',
      description: 'High in Omega-3 fatty acids which reduce inflammation and improve insulin sensitivity.',
      calories: 410, carbs: 8, protein: 38, fat: 24,
      ingredients: ['salmon fillet', 'asparagus', 'olive oil', 'lemon', 'garlic', 'black pepper'],
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80',
      prepTime: '25 mins',
    },
  ];

  for (const recipe of recipes) {
    await prisma.recipe.create({ data: recipe });
  }
  console.log(`✅ ${recipes.length} Recipes seeded`);

  // ─── 7. CHAT HISTORY ─────────────────────────────────────────────────────
  await prisma.chatMessage.deleteMany({ where: { userId: user.id } });

  const chatMessages = [
    { sender: 'ai', text: 'Hi Jan! I\'m RushBuddy, your AI diabetes coach. Your last reading was 125 mg/dL. How can I help you today?', minutesAgo: 60 },
    { sender: 'user', text: 'My sugar is high, what do I do?', minutesAgo: 59 },
    { sender: 'ai', text: 'If your blood sugar is above 180 mg/dL, here are immediate steps:\n\n1. **Stay hydrated** — drink water to help flush excess glucose\n2. **Take a 10-minute walk** — light exercise helps lower blood sugar\n3. **Check your insulin** — if prescribed, take your correction dose\n4. **Avoid carbs** for the next 2-3 hours\n\nIf it\'s above 300 mg/dL or you feel nauseous, contact your doctor immediately.', minutesAgo: 58 },
    { sender: 'user', text: 'Can I eat a banana?', minutesAgo: 45 },
    { sender: 'ai', text: 'Bananas are a tricky fruit for diabetics! A medium banana has about 27g of carbs.\n\n**My recommendation:**\n- ✅ Half a banana is usually fine if your reading is in range\n- ❌ Avoid when your sugar is already elevated (>140 mg/dL)\n- 💡 Pair it with peanut butter or almonds to slow the sugar absorption\n\nBased on your last reading of 125 mg/dL, half a banana with some nuts would be a safe snack!', minutesAgo: 44 },
  ];

  for (const msg of chatMessages) {
    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        sender: msg.sender,
        text: msg.text,
        timestamp: new Date(Date.now() - 1000 * 60 * msg.minutesAgo),
      },
    });
  }
  console.log(`✅ ${chatMessages.length} Chat messages seeded`);

  console.log('\n🎉 Database seed complete! Login with demo@sugarush.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
