-- AlterTable
CREATE SEQUENCE blacklist_id_seq;
ALTER TABLE "BlackList" ALTER COLUMN "id" SET DEFAULT nextval('blacklist_id_seq');
ALTER SEQUENCE blacklist_id_seq OWNED BY "BlackList"."id";

-- AlterTable
CREATE SEQUENCE message_id_seq;
ALTER TABLE "Message" ALTER COLUMN "id" SET DEFAULT nextval('message_id_seq');
ALTER SEQUENCE message_id_seq OWNED BY "Message"."id";
