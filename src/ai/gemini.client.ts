import {
  GoogleGenerativeAI,
  ResponseSchema,
  SchemaType,
} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const recommendSchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      recipeName: { type: SchemaType.STRING },
      originalName: { type: SchemaType.STRING },
      cuisine: { type: SchemaType.STRING },
      description: { type: SchemaType.STRING },
      spiceLevel: { type: SchemaType.STRING },
      healthNote: { type: SchemaType.STRING },
      servings: { type: SchemaType.STRING },
      prepTime: { type: SchemaType.STRING },
      cookTime: { type: SchemaType.STRING },
      ingredients: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            amount: { type: SchemaType.STRING },
          },
          required: ['name', 'amount'],
        },
      },
      steps: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            stepNumber: { type: SchemaType.NUMBER },
            instruction: { type: SchemaType.STRING },
          },
          required: ['stepNumber', 'instruction'],
        },
      },
    },
    required: [
      'recipeName',
      'cuisine',
      'description',
      'spiceLevel',
      'healthNote',
      'servings',
      'prepTime',
      'cookTime',
      'ingredients',
      'steps',
    ],
  },
};

export function getRecommendModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: recommendSchema,
    },
  });
}
