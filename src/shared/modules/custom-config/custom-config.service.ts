import { Configuration } from '@config/configuration';
import { Injectable } from '@nestjs/common';
import { ConfigService, type Path } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService<Configuration, true>) {}

  get<T extends Path<Configuration>>(path: T) {
    return this.configService.get(path, { infer: true });
  }
}
