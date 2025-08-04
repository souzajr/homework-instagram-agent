import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ContentType } from '../types';

export interface GeneratedContent {
  caption: string;
  hashtags: string[];
}

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;

  constructor(private configService: ConfigService) {
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }

    if (geminiKey) {
      this.gemini = new GoogleGenerativeAI(geminiKey);
    }
  }

  async generateContent(prompt: string, type: ContentType): Promise<[GeneratedContent, GeneratedContent]> {
    const [optionA, optionB] = await Promise.all([
      this.generateSingleContent(prompt, type, 'A'),
      this.generateSingleContent(prompt, type, 'B'),
    ]);

    return [optionA, optionB];
  }

  private async generateSingleContent(
    prompt: string,
    type: ContentType,
    variant: 'A' | 'B'
  ): Promise<GeneratedContent> {
    const systemPrompt = this.buildSystemPrompt(type, variant);
    const userPrompt = `Create content for: ${prompt}`;

    try {
      // Try Gemini first if available
      if (this.gemini) {
        return await this.generateWithGemini(systemPrompt, userPrompt);
      }
      
      // Fallback to OpenAI if available
      if (this.openai) {
        return await this.generateWithOpenAI(systemPrompt, userPrompt);
      }

      throw new Error('No AI service available');
    } catch (error) {
      console.error(`Error generating content with variant ${variant}:`, error);
      
      // Try the other service if the first one fails
      try {
        if (this.gemini && error.message.includes('OpenAI')) {
          return await this.generateWithGemini(systemPrompt, userPrompt);
        }
        if (this.openai && error.message.includes('Gemini')) {
          return await this.generateWithOpenAI(systemPrompt, userPrompt);
        }
      } catch (fallbackError) {
        console.error(`Fallback AI service also failed for variant ${variant}:`, fallbackError);
      }
      
      // Fallback to mock content if all AI services fail
      return this.generateMockContent(prompt, type, variant);
    }
  }

  private buildSystemPrompt(type: ContentType, variant: 'A' | 'B'): string {
    const basePrompt = `You are an Instagram content creator specializing in ${type.toLowerCase()} content. `;
    
    const variantStyles = {
      A: 'Create engaging, casual content with emojis and trending language. Focus on relatability and personal connection.',
      B: 'Create professional, informative content with clear value proposition. Focus on expertise and actionable insights.'
    };

    return basePrompt + variantStyles[variant] + `

Please respond with a JSON object containing:
- caption: A compelling ${type.toLowerCase()} caption (max 150 characters for stories, 200 for posts)
- hashtags: An array of 3-7 relevant hashtags (without # symbol)

Example format:
{
  "caption": "Your caption here",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;
  }

  private async generateWithOpenAI(systemPrompt: string, userPrompt: string): Promise<GeneratedContent> {
    const completion = await this.openai!.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content generated');

    return this.parseAIResponse(content);
  }

  private async generateWithGemini(systemPrompt: string, userPrompt: string): Promise<GeneratedContent> {
    const model = this.gemini!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
    const content = result.response.text();
    
    if (!content) throw new Error('No content generated');

    return this.parseAIResponse(content);
  }

  private parseAIResponse(response: string): GeneratedContent {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.caption && parsed.hashtags) {
          return {
            caption: parsed.caption,
            hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : []
          };
        }
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }

    // Fallback parsing if JSON parsing fails
    const lines = response.split('\n').filter(line => line.trim());
    const caption = lines.find(line => !line.startsWith('#') && line.length > 10) || 'Generated content';
    const hashtags = lines
      .filter(line => line.includes('#'))
      .flatMap(line => line.match(/#\w+/g) || [])
      .map(tag => tag.substring(1))
      .slice(0, 7);

    return { caption, hashtags };
  }

  private generateMockContent(prompt: string, type: ContentType, variant: 'A' | 'B'): GeneratedContent {
    const mockContent = {
      A: {
        caption: `✨ ${prompt} - loving this vibe! Can't wait to share more 💫`,
        hashtags: ['lifestyle', 'mood', 'vibes', 'content', 'share']
      },
      B: {
        caption: `Professional insight on ${prompt}. Here's what you need to know:`,
        hashtags: ['tips', 'professional', 'insights', 'knowledge', 'expert']
      }
    };

    return mockContent[variant];
  }
}