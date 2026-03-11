import { NextResponse } from 'next/server';
import axios from 'axios';
import { auth } from '../../../../lib/auth';

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
    // Fallback if environment variables are not set up perfectly yet
    console.warn("Edamam API keys missing, using mock data fallback.");
    return NextResponse.json({
        name: query,
        calories: Math.floor(Math.random() * 300) + 50,
        carbs: Math.floor(Math.random() * 50) + 10,
        protein: Math.floor(Math.random() * 20),
        fat: Math.floor(Math.random() * 15),
    });
  }

  try {
    const response = await axios.get('https://api.edamam.com/api/nutrition-data', {
      params: {
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        ingr: query, // e.g. "1 large apple" or just "apple"
      },
    });

    const data = response.data;
    
    // Edamam returns totalNutrients.CHOCDF for carbohydrates
    return NextResponse.json({
      name: query,
      calories: data.calories || 0,
      carbs: data.totalNutrients?.CHOCDF?.quantity || 0,
      protein: data.totalNutrients?.PROCNT?.quantity || 0,
      fat: data.totalNutrients?.FAT?.quantity || 0,
    });

  } catch (error) {
    console.error('Edamam API Search Error:', error);
    return NextResponse.json({ error: 'Failed to fetch nutrition data' }, { status: 500 });
  }
}
