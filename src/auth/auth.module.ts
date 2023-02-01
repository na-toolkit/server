import { Module, Global } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTable } from '@/accounts/entities/account.entity';
import { AuthGuard } from './auth.guard';
import { CustomConfigService } from '@/shared/modules/custom-config/custom-config.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [CustomConfigService],
      useFactory: (configService: CustomConfigService): JwtModuleOptions => {
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
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
