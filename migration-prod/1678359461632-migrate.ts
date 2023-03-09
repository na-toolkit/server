import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1678359461632 implements MigrationInterface {
    name = 'migrate1678359461632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`invite_codes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(30) NOT NULL, \`status\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_e8034125cb28e0814cd5a526c2\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD UNIQUE INDEX \`IDX_d9b90a82c6577f47a9b0ed5f23\` (\`account_uid\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP INDEX \`IDX_d9b90a82c6577f47a9b0ed5f23\``);
        await queryRunner.query(`DROP INDEX \`IDX_e8034125cb28e0814cd5a526c2\` ON \`invite_codes\``);
        await queryRunner.query(`DROP TABLE \`invite_codes\``);
    }

}
