import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1678273276812 implements MigrationInterface {
    name = 'migrate1678273276812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`account_uid\` varchar(21) NOT NULL, \`profile\` varchar(255) NOT NULL, \`account\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(60) NOT NULL, \`status\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_4d56d52597e38ed7249847e096\` (\`account\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sentences\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sentence_uid\` varchar(21) NOT NULL, \`content\` varchar(1000) NOT NULL, \`translation\` varchar(1000) NOT NULL, \`note\` text NOT NULL, \`account_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_5e16871ac838203b384dfb1431\` (\`sentence_uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sentences\` ADD CONSTRAINT \`FK_2690fd324fa899c9fcd719f074b\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sentences\` DROP FOREIGN KEY \`FK_2690fd324fa899c9fcd719f074b\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e16871ac838203b384dfb1431\` ON \`sentences\``);
        await queryRunner.query(`DROP TABLE \`sentences\``);
        await queryRunner.query(`DROP INDEX \`IDX_4d56d52597e38ed7249847e096\` ON \`accounts\``);
        await queryRunner.query(`DROP TABLE \`accounts\``);
    }

}
