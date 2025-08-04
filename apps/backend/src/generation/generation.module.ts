import { Module } from '@nestjs/common';
import { GenerationController } from './generation.controller';
import { GenerationService } from './generation.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [GenerationController],
  providers: [GenerationService],
})
export class GenerationModule {}