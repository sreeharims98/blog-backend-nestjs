import { Test, TestingModule } from '@nestjs/testing';
import { VerificationTokenService } from './verification_token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VerificationToken } from './entities/verification_token.entity';
import { MailService } from 'src/common/services/email.service';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

describe('VerificationTokenService', () => {
  let service: VerificationTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationTokenService,
        {
          provide: getRepositoryToken(VerificationToken),
          useValue: {},
        },
        {
          provide: MailService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VerificationTokenService>(VerificationTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
