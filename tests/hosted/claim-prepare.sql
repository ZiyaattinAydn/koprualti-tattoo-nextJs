-- Temporary fixture for two real concurrent DB connections. No login credentials.
begin;
do $$begin if exists(select 1 from public.artist_accounts where auth_user_id is not null) then raise exception 'QA requires unlinked bootstrap roster';end if;end$$;
insert into auth.users(id) values('a6000000-0000-4000-8000-000000000002'),('a6000000-0000-4000-8000-000000000003');
update public.artist_accounts set auth_user_id=('a6000000-0000-4000-8000-'||right(id::text,12))::uuid where id in ('10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003') and auth_user_id is null;
insert into public.appointments(id,request_id,branch,mode,services,customer_name,phone) values('b6000000-0000-4000-8000-000000000001','c6000000-0000-4000-8000-000000000001','alsancak','standard',array['tattoo'],'SPRINT05 CONCURRENCY QA','05555555555');
commit;
select 'prepared' as fixture;
