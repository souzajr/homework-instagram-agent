import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerateContentDto } from './dto/generate-content.dto';
import { SelectOptionDto } from './dto/select-option.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('api')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post('generate')
  @UseGuards(OptionalJwtAuthGuard)
  async generateContent(
    @Body(ValidationPipe) dto: GenerateContentDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    return this.generationService.generateContent(dto, userId);
  }

  @Post('select')
  @UseGuards(OptionalJwtAuthGuard)
  async selectOption(
    @Body(ValidationPipe) dto: SelectOptionDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    return this.generationService.selectOption(dto, userId);
  }

  @Get('history')
  @UseGuards(OptionalJwtAuthGuard)
  async getHistory(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const userId = req.user?.userId;
    const parsedLimit = limit ? parseInt(limit) : 20;
    const parsedOffset = offset ? parseInt(offset) : 0;
    
    return this.generationService.getHistory(userId, parsedLimit, parsedOffset);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@Request() req: any) {
    const userId = req.user?.userId;
    return this.generationService.getAnalytics(userId);
  }
}