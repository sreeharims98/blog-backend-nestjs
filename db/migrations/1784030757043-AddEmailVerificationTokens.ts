import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationTokens1784030757043 implements MigrationInterface {
  name = 'AddEmailVerificationTokens1784030757043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email_verification_tokens" ("id" SERIAL NOT NULL, "tokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_417a095bbed21c2369a6a01ab9a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "FK_10f285d038feb767bf7c2da14b3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_verification_tokens" DROP CONSTRAINT "FK_10f285d038feb767bf7c2da14b3"`,
    );
    await queryRunner.query(`DROP TABLE "email_verification_tokens"`);
  }
}
