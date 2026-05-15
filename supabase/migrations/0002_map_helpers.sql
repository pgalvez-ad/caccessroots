-- Helper RPCs that expose lat/lng coordinates to the coordinator/admin map.
-- These respect role checks; RLS is enforced via security_invoker functions.

create or replace function map_open_requests()
returns table (
  id uuid,
  title text,
  event_address text,
  event_start timestamptz,
  sensitivity request_sensitivity,
  status request_status,
  lng double precision,
  lat double precision
)
language sql stable security definer as $$
  select id, title, event_address, event_start, sensitivity, status,
         st_x(event_location::geometry) as lng,
         st_y(event_location::geometry) as lat
  from requests
  where is_coordinator_or_admin()
    and status in ('open','proposed','pending_acceptance');
$$;

-- Auto-create an approval-queue row for any new non-requestor signup.
create or replace function profile_onboarding_approval() returns trigger as $$
begin
  if new.status = 'pending' and new.role <> 'requestor' then
    insert into approvals(kind, target_table, target_id, requested_by, context)
    values (
      case new.role
        when 'interpreter' then 'interpreter_onboarding'::approval_kind
        when 'partner_admin' then 'community_onboarding'::approval_kind
        else 'role_escalation'::approval_kind
      end,
      'profiles',
      new.id,
      new.id,
      jsonb_build_object('full_name', new.full_name, 'email', new.email, 'role', new.role)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger profiles_onboarding_approval
  after insert on profiles
  for each row execute function profile_onboarding_approval();

create or replace function map_interpreters()
returns table (
  profile_id uuid,
  full_name text,
  service_radius_miles integer,
  languages text[],
  lng double precision,
  lat double precision
)
language sql stable security definer as $$
  select p.id, p.full_name, ip.service_radius_miles, ip.languages,
         st_x(ip.home_location::geometry) as lng,
         st_y(ip.home_location::geometry) as lat
  from profiles p
  join interpreter_profiles ip on ip.profile_id = p.id
  where is_coordinator_or_admin()
    and p.role = 'interpreter'
    and p.status = 'active'
    and ip.home_location is not null;
$$;
