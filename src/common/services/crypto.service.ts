import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
  generateRandomString() {
    return randomBytes(32).toString('hex');
  }

  hashString(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
