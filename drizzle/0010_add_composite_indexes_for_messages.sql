CREATE INDEX "messages_sender_created_idx" ON "messages" USING btree ("sender_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "messages_recipient_created_idx" ON "messages" USING btree ("recipient_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "messages_parent_created_idx" ON "messages" USING btree ("parent_message_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "messages_recipient_status_idx" ON "messages" USING btree ("recipient_id","status");