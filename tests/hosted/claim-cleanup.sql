-- Remove only this test's exact UUIDs and bindings, preserving all real records.
drop function if exists public.studio_qa_claim();
notify pgrst,'reload schema';
begin;
delete from public.appointments where id='b6000000-0000-4000-8000-000000000001' and request_id='c6000000-0000-4000-8000-000000000001';
update public.artist_accounts set auth_user_id=null where auth_user_id in ('a6000000-0000-4000-8000-000000000002','a6000000-0000-4000-8000-000000000003');
delete from auth.users where id in ('a6000000-0000-4000-8000-000000000002','a6000000-0000-4000-8000-000000000003');
commit;
select jsonb_build_object('qa_auth_users',(select count(*) from auth.users where id in ('a6000000-0000-4000-8000-000000000002','a6000000-0000-4000-8000-000000000003')),'qa_appointments',(select count(*) from public.appointments where id='b6000000-0000-4000-8000-000000000001')) as cleanup;
