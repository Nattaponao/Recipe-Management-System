import {
  GoogleGenerativeAI,
  ResponseSchema,
  SchemaType,
} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeSchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  description: 'List of recommended recipes based on user ingredients',
  items: {
    type: SchemaType.OBJECT,
    properties: {
      recipeId: { type: SchemaType.NUMBER },
      recipeName: { type: SchemaType.STRING },
      matchScore: { type: SchemaType.NUMBER },
      missingIngredients: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      reason: { type: SchemaType.STRING },
    },
    required: [
      'recipeId',
      'recipeName',
      'matchScore',
      'missingIngredients',
      'reason',
    ],
  },
};

export function getAnalyzeModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: analyzeSchema,
    },
  });
}
