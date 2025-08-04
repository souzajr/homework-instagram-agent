import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { GenerateContentDto } from './dto/generate-content.dto';
import { SelectOptionDto } from './dto/select-option.dto';
import { 
  GenerateContentResponse, 
  SelectOptionResponse, 
  GetHistoryResponse,
  AnalyticsData,
  ContentType,
  SelectedOption 
} from '../types';

@Injectable()
export class GenerationService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async generateContent(dto: GenerateContentDto, userId?: string): Promise<GenerateContentResponse> {
    // Generate two content options using AI
    const [optionA, optionB] = await this.aiService.generateContent(dto.prompt, dto.type);

    // Save to database
    const generation = await this.prisma.generation.create({
      data: {
        prompt: dto.prompt,
        type: dto.type as any,
        optionA: optionA as any,
        optionB: optionB as any,
        userId,
      },
    });

    return {
      id: generation.id,
      prompt: generation.prompt,
      type: generation.type as ContentType,
      optionA: optionA,
      optionB: optionB,
    };
  }

  async selectOption(dto: SelectOptionDto, userId?: string): Promise<SelectOptionResponse> {
    // Find the generation
    const generation = await this.prisma.generation.findFirst({
      where: {
        id: dto.generationId,
        ...(userId && { userId }),
      },
    });

    if (!generation) {
      throw new NotFoundException('Generation not found');
    }

    // Update with selected option
    const updatedGeneration = await this.prisma.generation.update({
      where: { id: dto.generationId },
      data: { selectedOption: dto.selectedOption as any },
    });

    return {
      success: true,
      generation: {
        id: updatedGeneration.id,
        prompt: updatedGeneration.prompt,
        type: updatedGeneration.type as ContentType,
        optionA: updatedGeneration.optionA as any,
        optionB: updatedGeneration.optionB as any,
        selectedOption: updatedGeneration.selectedOption as SelectedOption,
        userId: updatedGeneration.userId || undefined,
        createdAt: updatedGeneration.createdAt,
        updatedAt: updatedGeneration.updatedAt,
      },
    };
  }

  async getHistory(userId?: string, limit = 20, offset = 0): Promise<GetHistoryResponse> {
    const where = userId ? { userId } : {};

    const [generations, total] = await Promise.all([
      this.prisma.generation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.generation.count({ where }),
    ]);

    return {
      generations: generations.map(gen => ({
        id: gen.id,
        prompt: gen.prompt,
        type: gen.type as ContentType,
        optionA: gen.optionA as any,
        optionB: gen.optionB as any,
        selectedOption: gen.selectedOption as SelectedOption,
        userId: gen.userId || undefined,
        createdAt: gen.createdAt,
        updatedAt: gen.updatedAt,
      })),
      total,
    };
  }

  async getAnalytics(userId?: string): Promise<AnalyticsData> {
    const where = userId ? { userId } : {};

    const [
      totalGenerations,
      optionASelected,
      optionBSelected,
      promptStats,
      contentTypeStats,
    ] = await Promise.all([
      this.prisma.generation.count({ where }),
      this.prisma.generation.count({
        where: { ...where, selectedOption: 'A' },
      }),
      this.prisma.generation.count({
        where: { ...where, selectedOption: 'B' },
      }),
      this.prisma.generation.groupBy({
        by: ['prompt'],
        where,
        _count: { prompt: true },
        orderBy: { _count: { prompt: 'desc' } },
        take: 10,
      }),
      this.prisma.generation.groupBy({
        by: ['type'],
        where,
        _count: { type: true },
      }),
    ]);

    const contentTypeBreakdown = contentTypeStats.reduce(
      (acc, stat) => {
        acc[stat.type as ContentType] = stat._count.type;
        return acc;
      },
      { POST: 0, STORY: 0 } as { POST: number; STORY: number }
    );

    return {
      totalGenerations,
      optionASelected,
      optionBSelected,
      mostPopularPrompts: promptStats.map(stat => ({
        prompt: stat.prompt,
        count: stat._count.prompt,
      })),
      contentTypeBreakdown,
    };
  }
}