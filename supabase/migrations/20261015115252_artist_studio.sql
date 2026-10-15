-- Sprint 05. No credentials or real user identities belong in migrations.
begin;
create schema if not exists studio_private;
revoke all on schema studio_private from public;
grant usage on schema studio_private to authenticated, service_role;

create table public.artist_accounts (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid unique references auth.users(id) on delete set null,
 invitation_token uuid,
 slug text not null unique check (slug ~ '^[a-z][a-z0-9-]{1,59}$'),
 display_name text not null check (length(display_name) between 1 and 100),
 branch text not null check (branch in ('alsancak','karsiyaka')),
 role text not null default 'artist' check (role in ('artist','manager')),
 is_active boolean not null default true,
 created_at timestamptz not null default now()
);
create table public.artist_drafts (
 artist_id uuid primary key references public.artist_accounts(id) on delete cascade,
 profile jsonb not null default '{}',
 version integer not null default 0,
 published_version integer not null default -1,
 updated_at timestamptz not null default now()
);
create table public.artist_portfolio (
 id uuid primary key,
 artist_id uuid not null references public.artist_accounts(id) on delete cascade,
 storage_path text not null,
 title text not null default '' check (length(title)<=140),
 description text not null default '' check (length(description)<=1000),
 style text not null default '' check (length(style)<=100),
 featured boolean not null default false,
 sort_order integer not null default 0 check (sort_order>=0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index artist_portfolio_order on public.artist_portfolio(artist_id,sort_order);
create table public.artist_public_profiles (
 artist_id uuid primary key references public.artist_accounts(id) on delete cascade,
 slug text not null unique,
 profile jsonb not null,
 works jsonb not null default '[]',
 published_at timestamptz not null default now(),
 is_active boolean not null default true
);
create table public.appointments (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null unique,
 preferred_artist_id uuid references public.artist_accounts(id),
 assigned_artist_id uuid references public.artist_accounts(id),
 branch text not null check (branch in ('alsancak','karsiyaka')),
 mode text not null check (mode in ('standard','ataturk')),
 services text[] not null,
 customer_name text not null check (length(customer_name) between 2 and 100),
 phone text not null check (length(phone) between 7 and 30),
 email text not null default '' check (length(email)<=254),
 idea text not null default '' check (length(idea)<=2000),
 placement text not null default '' check (length(placement)<=200),
 size text not null default '' check (length(size)<=100),
 reference_path text,
 status text not null default 'new' check (status in ('new','claimed','confirmed','completed','cancelled')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index appointments_preferred on public.appointments(preferred_artist_id,created_at desc);
create index appointments_assigned on public.appointments(assigned_artist_id,created_at desc);
create index appointments_shared on public.appointments(created_at desc) where preferred_artist_id is null and assigned_artist_id is null;
create table studio_private.submission_limits (client_hash text not null, created_at timestamptz not null default now());
create index submission_limits_hash_time on studio_private.submission_limits(client_hash,created_at);
alter table studio_private.submission_limits enable row level security;

-- These small, non-exposed helpers read the database on every request. An old
-- access token cannot bypass account deactivation or elevate an artist's role.
create function studio_private.artist_id() returns uuid language sql stable security definer set search_path = '' as $$
 select id from public.artist_accounts where auth_user_id=(select auth.uid()) and is_active
$$;
create function studio_private.is_manager() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.artist_accounts where auth_user_id=(select auth.uid()) and is_active and role='manager')
$$;
revoke all on function studio_private.artist_id(), studio_private.is_manager() from public;
grant execute on function studio_private.artist_id(), studio_private.is_manager() to authenticated;

alter table public.artist_accounts enable row level security;
alter table public.artist_drafts enable row level security;
alter table public.artist_portfolio enable row level security;
alter table public.artist_public_profiles enable row level security;
alter table public.appointments enable row level security;
revoke all on public.artist_accounts,public.artist_drafts,public.artist_portfolio,public.artist_public_profiles,public.appointments from anon,authenticated;
grant select on public.artist_accounts,public.artist_drafts,public.artist_portfolio,public.appointments to authenticated;
grant select on public.artist_public_profiles to anon,authenticated;
grant all on public.artist_accounts,public.artist_drafts,public.artist_portfolio,public.artist_public_profiles,public.appointments to service_role;
create policy accounts_read on public.artist_accounts for select to authenticated using (id=(select studio_private.artist_id()) or (select studio_private.is_manager()));
create policy drafts_read on public.artist_drafts for select to authenticated using (artist_id=(select studio_private.artist_id()));
create policy portfolio_read on public.artist_portfolio for select to authenticated using (artist_id=(select studio_private.artist_id()));
create policy published_read on public.artist_public_profiles for select to anon,authenticated using (is_active);
create policy appointments_read on public.appointments for select to authenticated using (
 (select studio_private.is_manager()) or (
 (select studio_private.artist_id()) is not null and (
 preferred_artist_id=(select studio_private.artist_id()) or (
 preferred_artist_id is null and (assigned_artist_id is null or assigned_artist_id=(select studio_private.artist_id())))))
);

-- All writes go through bounded RPCs. No artist can mutate role/auth identity,
-- branch, live snapshots or appointment assignment with a manipulated PATCH.
create function studio_private.valid_profile(p jsonb, aid uuid) returns boolean language plpgsql immutable set search_path='' as $$
declare k text; v text;
begin
 if jsonb_typeof(p)<>'object' or length(p::text)>16000 or coalesce(p->>'theme','') not in ('archive','darkroom','chaos') or length(coalesce(p->>'display_name','')) not between 1 and 100 then return false; end if;
 if length(coalesce(p->>'bio',''))>3000 or length(coalesce(p->>'nickname',''))>100 then return false; end if;
 if (select count(*) from jsonb_object_keys(p))<>10 or not (p ?& array['display_name','nickname','bio','specialties','styles','instagram_url','appointment_url','profile_image','cover_image','theme']) then return false; end if;
 foreach k in array array['display_name','nickname','bio','instagram_url','appointment_url','profile_image','cover_image','theme'] loop
 if jsonb_typeof(p->k)<>'string' then return false; end if;
 end loop;
 foreach k in array array['specialties','styles'] loop
 if jsonb_typeof(p->k)<>'array' or jsonb_array_length(p->k)>20 then return false; end if;
 if exists(select 1 from jsonb_array_elements(p->k) x where jsonb_typeof(x)<>'string' or length(x#>>'{}')>80) then return false; end if;
 end loop;
 if coalesce(p->>'instagram_url','')<>'' and (p->>'instagram_url') !~ '^https://(www\.)?instagram\.com/[A-Za-z0-9_.]+/?$' then return false; end if;
 if coalesce(p->>'appointment_url','')<>'' and (p->>'appointment_url') !~ '^/appointment/([?][A-Za-z0-9_%=&.-]*)?$' then return false; end if;
 foreach k in array array['profile_image','cover_image'] loop
 v:=p->>k;
 if v<>'' and v !~ '^/assets/[a-zA-Z0-9_.-]+$' and v !~ ('^artists/'||aid::text||'/(profile|covers)/[a-f0-9-]+\.(webp|jpg|png)$') then return false; end if;
 end loop;
 return true;
end $$;
revoke all on function studio_private.valid_profile(jsonb,uuid) from public;

create function studio_private.save_draft(p jsonb, w jsonb, expected_version integer) returns integer language plpgsql security definer set search_path='' as $$
declare aid uuid:=studio_private.artist_id(); current_version integer; item jsonb;
begin
 if aid is null then raise exception 'Forbidden' using errcode='42501'; end if;
 select version into current_version from public.artist_drafts where artist_id=aid for update;
 if current_version<>expected_version then raise exception 'Taslak başka bir oturumda değişti. Sayfayı yenileyin.' using errcode='40001'; end if;
 if not studio_private.valid_profile(p,aid) or jsonb_typeof(w)<>'array' or jsonb_array_length(w)>100 then raise exception 'Geçersiz profil veya portfolio'; end if;
 if (select count(distinct x->>'id') from jsonb_array_elements(w) x)<>jsonb_array_length(w) then raise exception 'Tekrarlanan portfolio kaydı'; end if;
 for item in select * from jsonb_array_elements(w) loop
 if (item->>'storage_path') is null or (item->>'storage_path') !~ ('^artists/'||aid::text||'/portfolio/[a-f0-9-]+\.(webp|jpg|png)$') or item->>'id' is null then raise exception 'Geçersiz görsel yolu'; end if;
 if not exists(select 1 from storage.objects where bucket_id='artist-media' and name=item->>'storage_path') then raise exception 'Görsel yüklenmemiş'; end if;
 end loop;
 -- Validate ownership/existence of uploaded profile images as well.
 for item in select to_jsonb(v) from unnest(array[p->>'profile_image',p->>'cover_image']) v loop
 if item#>>'{}' like 'artists/%' and not exists(select 1 from storage.objects where bucket_id='artist-media' and name=item#>>'{}') then raise exception 'Görsel yüklenmemiş'; end if;
 end loop;
 delete from public.artist_portfolio where artist_id=aid;
 insert into public.artist_portfolio(id,artist_id,storage_path,title,description,style,featured,sort_order)
 select (x->>'id')::uuid,aid,x->>'storage_path',coalesce(x->>'title',''),coalesce(x->>'description',''),coalesce(x->>'style',''),coalesce((x->>'featured')::boolean,false),(n-1)::int from jsonb_array_elements(w) with ordinality as t(x,n);
 update public.artist_drafts set profile=p,version=version+1,updated_at=now() where artist_id=aid;
 return current_version+1;
end $$;
create function public.studio_save_draft(p jsonb,w jsonb,expected_version integer) returns integer language sql security invoker set search_path='' as $$ select studio_private.save_draft(p,w,expected_version) $$;

create function studio_private.publish_draft(expected_version integer) returns void language plpgsql security definer set search_path='' as $$
declare a public.artist_accounts; d public.artist_drafts; works jsonb;
begin
 select * into a from public.artist_accounts where id=studio_private.artist_id() for share;
 if a.id is null then raise exception 'Forbidden' using errcode='42501'; end if;
 select * into d from public.artist_drafts where artist_id=a.id for update;
 if d.version<>expected_version then raise exception 'Taslak değişti. Önce yeniden kaydedin.' using errcode='40001'; end if;
 select coalesce(jsonb_agg(to_jsonb(p) - 'artist_id' order by sort_order),'[]') into works from public.artist_portfolio p where artist_id=a.id;
 insert into public.artist_public_profiles(artist_id,slug,profile,works,is_active,published_at)
 values(a.id,a.slug,d.profile||jsonb_build_object('branch',a.branch),works,true,now())
 on conflict(artist_id) do update set profile=excluded.profile,works=excluded.works,is_active=true,published_at=now();
 update public.artist_drafts set published_version=version where artist_id=a.id;
end $$;
create function public.studio_publish(expected_version integer) returns void language sql security invoker set search_path='' as $$ select studio_private.publish_draft(expected_version) $$;

create function studio_private.restore_draft(expected_version integer) returns void language plpgsql security definer set search_path='' as $$
declare aid uuid:=studio_private.artist_id(); live public.artist_public_profiles; v integer;
begin
 if aid is null then raise exception 'Forbidden' using errcode='42501'; end if;
 select version into v from public.artist_drafts where artist_id=aid for update;
 if v<>expected_version then raise exception 'Taslak değişti. Sayfayı yenileyin.' using errcode='40001'; end if;
 select * into live from public.artist_public_profiles where artist_id=aid;
 if live.artist_id is null then raise exception 'Yayınlanmış profil yok'; end if;
 delete from public.artist_portfolio where artist_id=aid;
 insert into public.artist_portfolio(id,artist_id,storage_path,title,description,style,featured,sort_order)
 select (x->>'id')::uuid,aid,x->>'storage_path',x->>'title',x->>'description',x->>'style',(x->>'featured')::boolean,(x->>'sort_order')::int from jsonb_array_elements(live.works) x;
 update public.artist_drafts set profile=live.profile-'branch',version=version+1,published_version=version+1,updated_at=now() where artist_id=aid;
end $$;
create function public.studio_restore(expected_version integer) returns void language sql security invoker set search_path='' as $$ select studio_private.restore_draft(expected_version) $$;

create function studio_private.appointment_change(appointment_id uuid, action text, target_artist uuid default null) returns void language plpgsql security definer set search_path='' as $$
declare aid uuid:=studio_private.artist_id(); manager boolean:=studio_private.is_manager(); changed uuid;
begin
 if aid is null then raise exception 'Forbidden' using errcode='42501'; end if;
 if action='claim' then
 update public.appointments set assigned_artist_id=aid,status='claimed',updated_at=now() where id=appointment_id and preferred_artist_id is null and assigned_artist_id is null and status='new' returning id into changed;
 if changed is null then raise exception 'Bu randevu artık alınamıyor.' using errcode='40001'; end if;
 elsif action='assign' then
 if not manager then raise exception 'Forbidden' using errcode='42501'; end if;
 if not exists(select 1 from public.artist_accounts where id=target_artist and is_active) then raise exception 'Aktif sanatçı seçin'; end if;
 update public.appointments set assigned_artist_id=target_artist,status='claimed',updated_at=now() where id=appointment_id and status not in ('cancelled','completed') returning id into changed;
 else
 if action not in ('confirmed','completed','cancelled') then raise exception 'Geçersiz durum'; end if;
 update public.appointments set status=action,updated_at=now() where id=appointment_id and status not in ('completed','cancelled') and (manager or assigned_artist_id=aid or (assigned_artist_id is null and preferred_artist_id=aid)) returning id into changed;
 end if;
 if changed is null then raise exception 'Randevu bulunamadı veya yetkiniz yok' using errcode='42501'; end if;
end $$;
create function public.studio_appointment(appointment_id uuid,action text,target_artist uuid default null) returns void language sql security invoker set search_path='' as $$ select studio_private.appointment_change(appointment_id,action,target_artist) $$;

create function studio_private.manage_artist(artist_id uuid, active boolean, new_branch text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not studio_private.is_manager() then raise exception 'Forbidden' using errcode='42501'; end if;
 if new_branch not in ('alsancak','karsiyaka') then raise exception 'Geçersiz şube'; end if;
 update public.artist_accounts set is_active=active,branch=new_branch where id=artist_id and role='artist';
 if not found then raise exception 'Sanatçı bulunamadı'; end if;
 update public.artist_public_profiles set is_active=active,profile=jsonb_set(profile,'{branch}',to_jsonb(new_branch)) where artist_public_profiles.artist_id=manage_artist.artist_id;
end $$;
create function public.studio_manage_artist(artist_id uuid,active boolean,new_branch text) returns void language sql security invoker set search_path='' as $$ select studio_private.manage_artist(artist_id,active,new_branch) $$;

-- Explicitly revoke default PUBLIC execution, including future helper overloads.
revoke all on all functions in schema studio_private from public,anon;
grant execute on function studio_private.artist_id(),studio_private.is_manager(),studio_private.save_draft(jsonb,jsonb,integer),studio_private.publish_draft(integer),studio_private.restore_draft(integer),studio_private.appointment_change(uuid,text,uuid),studio_private.manage_artist(uuid,boolean,text) to authenticated;
revoke all on function public.studio_save_draft(jsonb,jsonb,integer),public.studio_publish(integer),public.studio_restore(integer),public.studio_appointment(uuid,text,uuid),public.studio_manage_artist(uuid,boolean,text) from public,anon;
grant execute on function public.studio_save_draft(jsonb,jsonb,integer),public.studio_publish(integer),public.studio_restore(integer),public.studio_appointment(uuid,text,uuid),public.studio_manage_artist(uuid,boolean,text) to authenticated;

-- Private Storage: anon can only sign/read an object referenced by a live snapshot.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('artist-media','artist-media',false,8388608,array['image/webp','image/jpeg','image/png']);
create function studio_private.live_asset(path text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.artist_public_profiles p where p.is_active and (p.profile->>'profile_image'=path or p.profile->>'cover_image'=path or exists(select 1 from jsonb_array_elements(p.works) w where w->>'storage_path'=path)))
$$;
revoke all on function studio_private.live_asset(text) from public;
grant usage on schema studio_private to anon;
grant execute on function studio_private.live_asset(text) to anon,authenticated;
create policy artist_media_read on storage.objects for select to anon,authenticated using (bucket_id='artist-media' and studio_private.live_asset(name));
create policy artist_media_own_read on storage.objects for select to authenticated using (bucket_id='artist-media' and split_part(name,'/',1)='artists' and split_part(name,'/',2)=(select studio_private.artist_id())::text);
create policy artist_media_insert on storage.objects for insert to authenticated with check (bucket_id='artist-media' and name ~ ('^artists/'||(select studio_private.artist_id())::text||'/(profile|covers|portfolio)/[a-f0-9-]+\.(webp|jpg|png)$'));
-- Immutable random filenames avoid replacing a published image in place.
create policy artist_media_delete on storage.objects for delete to authenticated using (bucket_id='artist-media' and split_part(name,'/',2)=(select studio_private.artist_id())::text and not studio_private.live_asset(name));

-- Public creation is server-mediated. It uses a persistent DB rate limit,
-- bounded request body and an idempotency key. Anonymous reads remain forbidden.
create function public.create_appointment(payload jsonb,client_hash text) returns uuid language plpgsql security invoker set search_path='' as $$
declare aid uuid; result uuid;
begin
 if length(client_hash)<>64 then raise exception 'Invalid client'; end if;
 perform pg_advisory_xact_lock(hashtextextended(client_hash,0));
 select id into result from public.appointments where request_id=(payload->>'request_id')::uuid;
 if result is not null then return result; end if;
 delete from studio_private.submission_limits where created_at<now()-interval '1 hour';
 if (select count(*) from studio_private.submission_limits l where l.client_hash=create_appointment.client_hash)>=5 then raise exception 'Çok fazla talep. Lütfen daha sonra tekrar deneyin.' using errcode='54000'; end if;
 aid:=nullif(payload->>'preferred_artist_id','')::uuid;
 if aid is not null and not exists(select 1 from public.artist_accounts where id=aid and is_active and branch=payload->>'branch') then raise exception 'Sanatçı ve şube eşleşmiyor'; end if;
 if jsonb_typeof(payload->'services')<>'array' or jsonb_array_length(payload->'services') not between 1 and 3 or exists(select 1 from jsonb_array_elements_text(payload->'services') s where s not in ('tattoo','piercing','coverup')) then raise exception 'Geçersiz hizmet'; end if;
 insert into public.appointments(request_id,preferred_artist_id,branch,mode,services,customer_name,phone,email,idea,placement,size,reference_path)
 values((payload->>'request_id')::uuid,aid,payload->>'branch',payload->>'mode',array(select jsonb_array_elements_text(payload->'services')),payload->>'customer_name',payload->>'phone',payload->>'email',payload->>'idea',payload->>'placement',payload->>'size',payload->>'reference_path') returning id into result;
 insert into studio_private.submission_limits(client_hash) values(create_appointment.client_hash);
 return result;
end $$;
revoke all on function public.create_appointment(jsonb,text) from public,anon,authenticated;
grant execute on function public.create_appointment(jsonb,text) to service_role;
grant all on studio_private.submission_limits to service_role;

insert into public.artist_accounts(id,slug,display_name,branch,role) values
 ('10000000-0000-4000-8000-000000000001','doktor','Doktor','alsancak','manager'),
 ('10000000-0000-4000-8000-000000000002','su','Su','alsancak','artist'),
 ('10000000-0000-4000-8000-000000000003','birsu','Birsu','alsancak','artist'),
 ('10000000-0000-4000-8000-000000000004','cansin','Cansın','karsiyaka','artist');
insert into public.artist_drafts(artist_id,profile,published_version)
select id,jsonb_build_object('display_name',display_name,'nickname','','bio',case when slug='doktor' then 'Köprüaltı’nın kurucusu Doktor, stüdyoda dövme çalışmalarına devam ediyor.' else 'Biyografi ve seçili çalışmalar yakında.' end,'specialties','[]'::jsonb,'styles','[]'::jsonb,'instagram_url','','appointment_url','/appointment/?artist='||slug,'profile_image',case when slug='doktor' then '/assets/doctor-live.png' when slug='birsu' then '/assets/birsu-studio.jpeg' else '' end,'cover_image','','theme',case when slug='doktor' then 'chaos' else 'archive' end),0 from public.artist_accounts;
insert into public.artist_public_profiles(artist_id,slug,profile)
select a.id,a.slug,d.profile||jsonb_build_object('branch',a.branch) from public.artist_accounts a join public.artist_drafts d on d.artist_id=a.id;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('appointment-references','appointment-references',false,3145728,array['image/webp']);
create policy appointment_reference_read on storage.objects for select to authenticated using (bucket_id='appointment-references' and exists(select 1 from public.appointments a where a.reference_path=name));
commit;
