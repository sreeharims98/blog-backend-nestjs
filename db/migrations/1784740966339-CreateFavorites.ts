import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavorites1784740966339 implements MigrationInterface {
  name = 'CreateFavorites1784740966339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorites" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "blog_id" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorites" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_favorites_user_blog" UNIQUE ("user_id", "blog_id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_blog" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_favorites_user_id" ON "favorites" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_favorites_blog_id" ON "favorites" ("blog_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_favorites_blog_id"`);
    await queryRunner.query(`DROP INDEX "IDX_favorites_user_id"`);
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_blog"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_user"`,
    );
    await queryRunner.query(`DROP TABLE "favorites"`);
  }
}
