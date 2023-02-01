import { Module, Global } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTable } from '@/accounts/entities/account.entity';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@config/configuration';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<Configuration, true>,
      ): JwtModuleOptions => {
        const { secret, expiresIn } = configService.get('jwt');
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
    TypeOrmModule.forFeature([AccountTable]),
  ],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
