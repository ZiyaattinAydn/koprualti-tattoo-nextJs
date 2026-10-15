-- Hosted PostgreSQL/RLS integration test. Run only against the dedicated project
-- before real artist identities are linked. All fixture writes roll back.
begin;
set local statement_timeout='45s';
create temporary table qa_guard(dummy boolean);
create function pg_temp.qa_assert(ok boolean,label text) returns void language plpgsql security invoker set search_path='' as $$ begin if ok is distinct from true then raise exception 'QA failed: %',label; end if; end $$;
select pg_temp.qa_assert((select count(*)=0 from public.artist_accounts where auth_user_id is not null),'no real identities may be replaced');
insert into auth.users(id) values
 ('a5000000-0000-4000-8000-000000000001'),('a5000000-0000-4000-8000-000000000002'),
 ('a5000000-0000-4000-8000-000000000003'),('a5000000-0000-4000-8000-000000000004');
update public.artist_accounts set auth_user_id=('a5000000-0000-4000-8000-'||right(id::text,12))::uuid;
insert into public.appointments(id,request_id,preferred_artist_id,branch,mode,services,customer_name,phone) values
 ('b5000000-0000-4000-8000-000000000001','c5000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','alsancak','standard',array['tattoo'],'SPRINT05 QA','05555555555'),
 ('b5000000-0000-4000-8000-000000000002','c5000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','alsancak','standard',array['tattoo'],'SPRINT05 QA','05555555555'),
 ('b5000000-0000-4000-8000-000000000003','c5000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000003','alsancak','standard',array['tattoo'],'SPRINT05 QA','05555555555'),
 ('b5000000-0000-4000-8000-000000000004','c5000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000004','karsiyaka','standard',array['tattoo'],'SPRINT05 QA','05555555555'),
 ('b5000000-0000-4000-8000-000000000005','c5000000-0000-4000-8000-000000000005',null,'alsancak','standard',array['tattoo'],'SPRINT05 QA','05555555555');
set local role authenticated;
select set_config('request.jwt.claim.sub','a5000000-0000-4000-8000-000000000002',true);
select pg_temp.qa_assert((select count(*)=1 from public.artist_accounts),'Su only reads own account');
select pg_temp.qa_assert((select count(*)=1 from public.artist_drafts),'Su only reads own draft');
select pg_temp.qa_assert((select count(*)=2 from public.appointments where customer_name='SPRINT05 QA'),'Su sees Su + shared only');
do $$declare blocked boolean:=false;begin
 begin update public.artist_accounts set role='manager' where slug='su'; exception when insufficient_privilege then blocked:=true;end;
 perform pg_temp.qa_assert(blocked,'role escalation denied');
 blocked:=false;
 begin update public.artist_drafts set profile='{}' where artist_id='10000000-0000-4000-8000-000000000003';exception when insufficient_privilege then blocked:=true;end;
 perform pg_temp.qa_assert(blocked,'foreign draft write denied');
 blocked:=false;
 begin perform public.studio_manage_artist('10000000-0000-4000-8000-000000000003',false,'alsancak');exception when insufficient_privilege then blocked:=true;end;
 perform pg_temp.qa_assert(blocked,'artist management denied');
end$$;
select public.studio_save_draft((select profile||'{"bio":"SPRINT05_PRIVATE_DRAFT","theme":"darkroom"}'::jsonb from public.artist_drafts),'[]',0);
set local role anon;
select pg_temp.qa_assert((select profile->>'bio'<>'SPRINT05_PRIVATE_DRAFT' from public.artist_public_profiles where slug='su'),'draft does not leak');
do $$declare blocked boolean:=false;begin begin perform count(*) from public.appointments;exception when insufficient_privilege then blocked:=true;end;perform pg_temp.qa_assert(blocked,'anonymous appointments denied');end$$;
set local role authenticated;
select public.studio_publish(1);
set local role anon;
select pg_temp.qa_assert((select profile->>'bio'='SPRINT05_PRIVATE_DRAFT' from public.artist_public_profiles where slug='su'),'published snapshot visible');
set local role authenticated;
do $$declare blocked boolean:=false;begin begin perform public.studio_save_draft((select profile from public.artist_drafts),'[]',0);exception when serialization_failure then blocked:=true;end;perform pg_temp.qa_assert(blocked,'stale draft version denied');end$$;
insert into storage.objects(bucket_id,name) values('artist-media','artists/10000000-0000-4000-8000-000000000002/portfolio/d5000000-0000-4000-8000-000000000001.webp');
do $$declare blocked boolean:=false;begin begin insert into storage.objects(bucket_id,name) values('artist-media','artists/10000000-0000-4000-8000-000000000003/portfolio/d5000000-0000-4000-8000-000000000002.webp');exception when insufficient_privilege then blocked:=true;end;perform pg_temp.qa_assert(blocked,'foreign storage upload denied');end$$;
set local role anon;
select pg_temp.qa_assert((select count(*)=0 from storage.objects where name like '%d5000000%'),'draft asset anonymous read denied');
set local role authenticated;
select public.studio_save_draft((select profile from public.artist_drafts),'[{"id":"e5000000-0000-4000-8000-000000000001","storage_path":"artists/10000000-0000-4000-8000-000000000002/portfolio/d5000000-0000-4000-8000-000000000001.webp","title":"QA only","description":"","style":"","featured":true,"sort_order":0}]',1);
select public.studio_publish(2);
set local role anon;
select pg_temp.qa_assert((select count(*)=1 from storage.objects where name like '%d5000000%'),'published asset readable');
set local role authenticated;
select set_config('request.jwt.claim.sub','a5000000-0000-4000-8000-000000000003',true);
select pg_temp.qa_assert((select count(*)=2 from public.appointments where customer_name='SPRINT05 QA'),'Birsu sees Birsu + shared only');
select pg_temp.qa_assert((select count(*)=0 from public.artist_portfolio),'Birsu cannot read Su portfolio');
select set_config('request.jwt.claim.sub','a5000000-0000-4000-8000-000000000004',true);
select pg_temp.qa_assert((select count(*)=2 from public.appointments where customer_name='SPRINT05 QA'),'Cansin sees Cansin + shared only');
select set_config('request.jwt.claim.sub','a5000000-0000-4000-8000-000000000001',true);
select pg_temp.qa_assert((select count(*)=5 from public.appointments where customer_name='SPRINT05 QA'),'Doktor sees all');
select public.studio_appointment('b5000000-0000-4000-8000-000000000005','assign','10000000-0000-4000-8000-000000000003');
select public.studio_manage_artist('10000000-0000-4000-8000-000000000003',false,'alsancak');
select set_config('request.jwt.claim.sub','a5000000-0000-4000-8000-000000000003',true);
select pg_temp.qa_assert((select count(*)=0 from public.artist_accounts),'deactivated account hidden');
select pg_temp.qa_assert((select count(*)=0 from public.appointments),'deactivated appointment access denied');
rollback;
select jsonb_build_object('result','PASS','scope','hosted PostgreSQL authenticated/anon roles, draft/live, Storage metadata policies, ownership, manager and deactivation','fixture_writes','rolled back') as hosted_rls_test;
