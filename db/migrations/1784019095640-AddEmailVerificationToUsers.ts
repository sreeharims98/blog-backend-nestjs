import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationToUsers1784019095640 implements MigrationInterface {
  name = 'AddEmailVerificationToUsers1784019095640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emailVerifiedAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "emailVerifiedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "isEmailVerified"`,
    );
  }
}
