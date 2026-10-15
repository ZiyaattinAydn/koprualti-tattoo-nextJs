begin;
-- The private rate-limit log is explicitly service-only, including future
-- projects where the service role is configured without bypassrls.
alter table studio_private.submission_limits add column id bigint generated always as identity primary key;
grant usage, select on sequence studio_private.submission_limits_id_seq to service_role;
create policy submission_limits_service on studio_private.submission_limits for all to service_role using (true) with check (true);
-- Supabase installs this event-trigger helper on new hosted projects. It has
-- no application RPC purpose and should not be executable by API roles.
do $$ begin
 if to_regprocedure('public.rls_auto_enable()') is not null then
  revoke execute on function public.rls_auto_enable() from public,anon,authenticated;
 end if;
end $$;
commit;
