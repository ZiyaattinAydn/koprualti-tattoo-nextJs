-- Apply claim-prepare.sql first. Replace __QA_PASSWORD__ in memory only; never
-- persist the credential to this SQL file or commit it to source control.
begin;
update auth.users set instance_id='00000000-0000-0000-0000-000000000000',aud='authenticated',role='authenticated',
 email=case right(id::text,1) when '2' then 'sprint05-su-qa@example.invalid' else 'sprint05-birsu-qa@example.invalid' end,
 encrypted_password=extensions.crypt('__QA_PASSWORD__',extensions.gen_salt('bf')),
 email_confirmed_at=now(),raw_app_meta_data='{"provider":"email","providers":["email"],"sprint05_qa":true}',raw_user_meta_data='{"email_verified":true}',
 confirmation_token='',recovery_token='',email_change_token_new='',email_change='',created_at=now(),updated_at=now()
 where id in ('a6000000-0000-4000-8000-000000000002','a6000000-0000-4000-8000-000000000003');
insert into auth.identities(user_id,provider_id,identity_data,provider,created_at,updated_at)
 select id,id::text,jsonb_build_object('sub',id::text,'email',email,'email_verified',true),'email',now(),now() from auth.users where id in ('a6000000-0000-4000-8000-000000000002','a6000000-0000-4000-8000-000000000003');
-- This short-lived SECURITY INVOKER wrapper adds timing only. It cannot bypass
-- the real claim RPC's permissions. Only the two QA identities may call it.
create function public.studio_qa_claim() returns jsonb language plpgsql security invoker set search_path='' as $$
declare started timestamptz:=clock_timestamp(); outcome text;
begin
 if auth.uid() not in ('a6000000-0000-4000-8000-000000000002'::uuid,'a6000000-0000-4000-8000-000000000003'::uuid) or auth.uid() is null then raise exception 'QA identity required' using errcode='42501';end if;
 begin
  perform public.studio_appointment('b6000000-0000-4000-8000-000000000001','claim',null);
  perform pg_sleep(5);
  outcome:='claimed';
 exception when serialization_failure then outcome:='conflict';end;
 return jsonb_build_object('actor',auth.uid(),'backend_pid',pg_backend_pid(),'started_at',started,'finished_at',clock_timestamp(),'outcome',outcome);
end$$;
revoke all on function public.studio_qa_claim() from public,anon;
grant execute on function public.studio_qa_claim() to authenticated;
notify pgrst,'reload schema';
commit;
select 'HTTP QA ready' as fixture;
