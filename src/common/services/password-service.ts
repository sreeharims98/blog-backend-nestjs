import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hash(string: string): Promise<string> {
    return bcrypt.hash(string, 10);
  }

  async compare(string: string, hash: string): Promise<boolean> {
    return bcrypt.compare(string, hash);
  }
}
