-- AureVeil seed data intentionally excludes auth.users because Supabase auth users should be created through Auth.
-- After creating development users, run inserts using their actual UUIDs. The UI also ships with local fictional artwork
-- so the visual experience is populated before a Supabase project is attached.
insert into public.artworks (creator_id,slug,title,description,category,medium,style,tags,visibility)
select id,'first-work-'||substr(id::text,1,6),'First Work','Development seed artwork','Illustration','Digital','Editorial',array['editorial','development'],'public'::public.artwork_visibility
from public.profiles limit 1
on conflict do nothing;
