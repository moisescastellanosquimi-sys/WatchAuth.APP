import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { getWatchKnowledgeBase } from '@/constants/watch-database';
import * as ImageManipulator from 'expo-image-manipulator';

const WatchAnalysisSchema = z.object({
  brand: z.string().describe('The watch brand (e.g., Rolex, Patek Philippe, Audemars Piguet)'),
  model: z.string().describe('The specific model name'),
  referenceNumber: z.string().optional().describe('Reference/model number if identifiable'),
  estimatedValue: z.object({
    min: z.number().describe('Minimum market value in USD'),
    max: z.number().describe('Maximum market value in USD'),
    currency: z.string().default('USD'),
  }).describe('Estimated market value range'),
  authenticity: z.object({
    isAuthentic: z.boolean().describe('Whether the watch appears to be authentic or a replica'),
    confidence: z.number().min(0).max(100).describe('Confidence level percentage (0-100)'),
    reasoning: z.string().describe('Detailed explanation of authenticity determination'),
    redFlags: z.array(z.string()).describe('List of any suspicious elements or red flags found'),
    authenticityIndicators: z.array(z.string()).describe('List of authentic features observed'),
  }),
  details: z.object({
    material: z.string().optional().describe('Case material (e.g., stainless steel, gold, platinum)'),
    movement: z.string().optional().describe('Movement type if identifiable'),
    yearOfProduction: z.string().optional().describe('Estimated year or era of production'),
    condition: z.string().optional().describe('Overall condition assessment'),
    notableFeatures: z.array(z.string()).describe('Notable features or complications'),
  }),
  confidence: z.number().min(0).max(100).describe('Overall confidence in the identification'),
  notes: z.string().optional().describe('Additional notes or observations'),
});

export type WatchAnalysis = z.infer<typeof WatchAnalysisSchema>;

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  ar: 'Arabic',
  zh: 'Chinese',
};

async function optimizeImage(imageUri: string): Promise<string> {
  try {
    console.log('Optimizing image for analysis...');
    
    const manipulated = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: 1024 } },
      ],
      {
        compress: 0.9,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    
    console.log('Image optimized:', manipulated.uri);
    return manipulated.uri;
  } catch (error) {
    console.log('Image optimization failed, using original:', error);
    return imageUri;
  }
}

export async function analyzeWatch(imageUri: string, language: string = 'en'): Promise<WatchAnalysis> {
  try {
    console.log('Starting watch analysis...');
    console.log('Image URI:', imageUri);
    console.log('Language:', language);
    
    if (!imageUri) {
      throw new Error('No image URI provided');
    }

    const optimizedUri = Platform.OS !== 'web' ? await optimizeImage(imageUri) : imageUri;
    console.log('Using image URI:', optimizedUri);

    console.log('Converting image to base64...');
    
    let base64Image: string;
    
    try {
      if (Platform.OS === 'web') {
        const response = await fetch(optimizedUri);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        console.log('Image blob size:', blob.size, 'bytes');
        
        if (blob.size === 0) {
          throw new Error('Image file is empty');
        }
        
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            if (!result) {
              reject(new Error('Failed to read image data'));
              return;
            }
            const base64Data = result.split(',')[1];
            if (!base64Data) {
              reject(new Error('Invalid base64 data'));
              return;
            }
            resolve(base64Data);
          };
          reader.onerror = () => reject(new Error('FileReader error'));
          reader.readAsDataURL(blob);
        });
      } else {
        const fileInfo = await FileSystem.getInfoAsync(optimizedUri);
        if (!fileInfo.exists) {
          throw new Error('Image file does not exist');
        }
        console.log('Image file exists:', fileInfo.exists);
        
        base64Image = await FileSystem.readAsStringAsync(optimizedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
    } catch (conversionError) {
      console.error('Image conversion error:', conversionError);
      throw new Error(`Failed to process image: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`);
    }

    if (!base64Image || base64Image.length === 0) {
      throw new Error('Image conversion resulted in empty data');
    }

    console.log('Base64 image length:', base64Image.length, 'characters');
    console.log('Sending image to AI for analysis...');

    let result: WatchAnalysis;
    
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Analysis attempt ${attempt}/${maxRetries}...`);
        
        result = await generateObject({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  image: base64Image,
                },
                {
                  type: 'text',
                  text: `You are an expert luxury watch authenticator and appraiser with decades of experience. Analyze this watch image carefully and thoroughly.

${getWatchKnowledgeBase()}

IMPORTANT INSTRUCTIONS:
1. ALWAYS attempt to identify the watch, even if the image quality is not perfect
2. Look for ANY visible features: brand logos, dial design, case shape, crown, hands, markers, bezel
3. If you can see any part of a watch, provide your best analysis
4. Only set confidence to 0 if there is absolutely NO watch visible in the image
5. CRITICAL: The Rolex Land-Dweller is a REAL watch model released in 2025. It features 36mm and 40mm case sizes, integrated bracelet design, 5 Hz high frequency Cal. 7135 movement, and fluid case lines. Reference numbers include 227950, 227955, 227959, 227951, 227956, 227935, 227936. DO NOT mark it as fake or non-existent.
6. Always check the watch database for new 2025 models before determining authenticity

Examine these elements:
1. Brand identification - look for logos on dial, crown, clasp, case back
2. Model identification - dial layout, bezel style, case shape, complications
3. Reference number if any text is visible
4. Materials assessment - steel, gold, ceramic, etc.
5. Dial details - color, texture, indices, hands style
6. Case construction - shape, size estimation, lugs style
7. Crown design and position
8. Authenticity indicators vs replica warning signs
9. Market value estimation (use 2024-2025 pricing)
10. Movement type if visible

Use the watch database to match visible features against known models. Even partial matches are valuable.

NEW 2025 MODELS TO RECOGNIZE:
- Rolex Land-Dweller (2025): A new Rolex model with integrated bracelet, 36mm/40mm sizes, Cal. 7135 movement with 5 Hz frequency, fluid case lines, modern elegance design. This is a legitimate Rolex model - NOT a fake. Reference numbers: 227950, 227955, 227959, 227951, 227956, 227935, 227936, 127950, 127955, 227940, 227945, 127940, 127945.

Authenticity Assessment:
- Look for finishing quality, font consistency, alignment
- Check logo positioning and quality
- Assess overall build quality from visible details
- Note any suspicious elements
- IMPORTANT: Before marking ANY watch as fake, verify it's not a new model released in 2024-2025. The Rolex Land-Dweller is a real 2025 model.
- If you see "Land-Dweller" on a Rolex, it IS authentic (the model exists as of 2025)

Even with partial visibility or suboptimal lighting:
- Provide your BEST identification attempt
- Set confidence appropriately (30-70% for unclear images)
- List what features you CAN identify
- Suggest what additional angles would help

Only mark as unidentifiable (confidence 0) if:
- No watch is present in the image
- Image is completely black/white/corrupted
- Only non-watch objects are visible

IMPORTANT: Respond in ${languageNames[language] || 'English'} language. All analysis, reasoning, descriptions, and notes must be in ${languageNames[language] || 'English'}.`,
                },
              ],
            },
          ],
          schema: WatchAnalysisSchema,
        });
        
        break;
      } catch (apiError) {
        console.error(`AI API error (attempt ${attempt}):`, apiError);
        const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
        
        const isJsonParseError = errorMessage.toLowerCase().includes('json parse') || 
                                  errorMessage.toLowerCase().includes('unexpected character') ||
                                  errorMessage.toLowerCase().includes('syntaxerror');
        const isRateLimitError = errorMessage.toLowerCase().includes('rate limit');
        const isTimeoutError = errorMessage.toLowerCase().includes('timeout') || errorMessage.toLowerCase().includes('timed out');
        const isNetworkError = errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch');
        
        const isRetryableError = isJsonParseError || isRateLimitError || isTimeoutError;
        
        if (isRetryableError && attempt < maxRetries) {
          console.log(`Retryable error detected, waiting before retry...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          lastError = new Error(errorMessage);
          continue;
        }
        
        if (isJsonParseError) {
          throw new Error('The AI service returned an invalid response. Please try again.');
        }
        if (isRateLimitError) {
          throw new Error('Service is temporarily busy. Please try again in a few moments.');
        }
        if (isTimeoutError) {
          throw new Error('Analysis took too long. Please try again with a clearer image.');
        }
        if (isNetworkError) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        
        throw new Error(`Analysis failed: ${errorMessage}`);
      }
    }
    
    if (!result!) {
      throw lastError || new Error('Analysis failed after multiple attempts. Please try again.');
    }

    console.log('Analysis completed successfully');
    console.log('Result confidence:', result.confidence);
    console.log('Authenticity:', result.authenticity.isAuthentic);
    
    if (!result) {
      throw new Error('AI service returned empty result');
    }

    return result;
  } catch (error) {
    console.error('Watch analysis failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      imageUri,
      language,
    });
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to analyze watch: Unknown error occurred');
  }
}
