import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body(ValidationPipe) dto: LoginDto) {
    return this.authService.login(dto);
  }
}