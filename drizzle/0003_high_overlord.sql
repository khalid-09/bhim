CREATE INDEX "idx_quality_companyid" ON "quality" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_worklog_companyid" ON "work_log" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_worklog_karigarname" ON "work_log" USING btree ("karigar_name");--> statement-breakpoint
CREATE INDEX "idx_worklog_date" ON "work_log" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_worklog_userid" ON "work_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_worklog_company_date" ON "work_log" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "idx_worklog_karigar_date" ON "work_log" USING btree ("karigar_name","date");