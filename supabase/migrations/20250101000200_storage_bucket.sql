-- WisdomLingo migration 003: public course-images storage bucket.

-- 4. STORAGE BUCKET  (course-images)
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('course-images', 'course-images', true)
on conflict (id) do update set public = true;

drop policy if exists "course images public read" on storage.objects;
create policy "course images public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'course-images');

drop policy if exists "course images admin insert" on storage.objects;
create policy "course images admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'course-images');

drop policy if exists "course images admin update" on storage.objects;
create policy "course images admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'course-images')
  with check (bucket_id = 'course-images');

drop policy if exists "course images admin delete" on storage.objects;
create policy "course images admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'course-images');

-- ---------------------------------------------------------------------
