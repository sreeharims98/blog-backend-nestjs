import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  createRefreshToken() {
    return randomBytes(64).toString('hex');
  }

  // Deterministic hash — needed so the same raw token always hashes
  // to the same value, enabling lookup-by-hash in the database.
  // bcrypt cannot be used here: it salts randomly per call.
  hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
