-- WisdomLingo seed data.
-- Mirrors frontend/src/data/seed.ts so the site looks identical once connected.

-- 5. SEED DATA (matches the fallback content bundled in App.tsx)
-- ---------------------------------------------------------------------

insert into public.courses (title, category, level, duration, fee, description, display_order)
values
  ('German A1 - Beginner',        'german', 'A1', '8 weeks',  'PKR 15,000', 'Alphabet, pronunciation, greetings, numbers and everyday conversation. Prepares you for the Goethe / OSD A1 exam.', 1),
  ('German A2 - Elementary',      'german', 'A2', '8 weeks',  'PKR 18,000', 'Past tense, modal verbs and practical topics such as shopping, travel and appointments.', 2),
  ('German B1 - Intermediate',    'german', 'B1', '10 weeks', 'PKR 22,000', 'The level most Ausbildung contracts and student visas require. Connectors, subordinate clauses and formal letters.', 3),
  ('German B2 - Upper Intermediate','german','B2', '12 weeks', 'PKR 28,000', 'Academic and professional German: argumentative writing, news comprehension and debate.', 4),
  ('German C1 - Advanced',        'german', 'C1', '14 weeks', 'PKR 35,000', 'Near-native fluency for university study and professional licensing.', 5),
  ('German C2 - Mastery',         'german', 'C2', '16 weeks', 'PKR 45,000', 'The highest CEFR level, with full Goethe C2 preparation and one-to-one coaching.', 6),
  ('IELTS Preparation',           'english', 'Academic & General', '6 weeks', 'PKR 20,000', 'Band-focused training across all four modules with weekly mock tests and individual feedback.', 7),
  ('Spoken English',              'english', 'Beginner - Advanced', '8 weeks', 'PKR 12,000', 'Confidence-first conversation classes: accent clarity, fluency, interviews and workplace communication.', 8),
  ('Quran with Tajweed',          'religious', 'Nazra & Hifz', 'Flexible', 'PKR 6,000 / month', 'Qualified male and female teachers for Nazra, Tajweed and Hifz, on campus or online.', 9),
  ('Arabic Language',             'religious', 'Beginner - Intermediate', '12 weeks', 'PKR 10,000', 'Classical and Modern Standard Arabic: Nahw, Sarf and reading comprehension.', 10),
  ('Persian (Farsi)',             'religious', 'Beginner - Intermediate', '12 weeks', 'PKR 10,000', 'Script, grammar and conversational Persian so you can read Rumi, Hafiz and Iqbal in the original.', 11)
on conflict do nothing;

insert into public.study_countries (name, flag, tagline, description, benefits, requirements, tuition, intake, display_order)
values
  ('Germany', 'DE', 'Tuition-free public universities',
   'Europe''s largest economy and the leading destination for Pakistani students.',
   array['No tuition fee at public universities','18-month post-study work visa','Blocked account approx. EUR 11,904 per year','Part-time work: 120 full / 240 half days','Pathway to permanent residence in 21-33 months'],
   array['FSc / A-Levels or Bachelor degree','German B1-B2, or IELTS 6.0 for English programmes','APS certificate','Blocked account and health insurance'],
   'EUR 0 - 500 / semester (public)', 'Winter (Oct) & Summer (Apr)', 1),
  ('Sweden', 'SE', 'Innovation and world-class research',
   'English-taught master''s programmes with strong links between universities and industry.',
   array['Hundreds of English-taught programmes','12-month post-study residence permit','Scholarships from the Swedish Institute','Family members can accompany the student','High standard of living and safety'],
   array['Bachelor degree for master''s entry','IELTS 6.5 overall','Proof of funds (approx. SEK 10,314 / month)','Motivation letter and CV'],
   'SEK 80,000 - 145,000 / year', 'Autumn (Aug) & Spring (Jan)', 2),
  ('Cyprus', 'CY', 'Affordable European degrees',
   'A budget-friendly entry into European education with a high visa success rate.',
   array['Low tuition and living costs','Study without IELTS at many universities','High visa success rate','English-medium instruction','Mediterranean climate and safe campuses'],
   array['FSc / Intermediate certificate','Passport valid for 2+ years','Bank statement covering one year of costs','Medical and police clearance'],
   'EUR 3,000 - 6,000 / year', 'Sept, Jan & May', 3),
  ('Turkey', 'TR', 'Where Europe meets Asia',
   'Culturally close to home and academically ambitious, with strong engineering and medical faculties.',
   array['Affordable tuition and hostels','Turkiye Burslari scholarships available','Halal food and familiar culture','Fast visa processing','Degrees recognised across Europe'],
   array['FSc / Intermediate with good marks','YOS or SAT for some universities','Passport and equivalence certificate','Financial proof'],
   'USD 1,500 - 6,000 / year', 'Fall (Sept) & Spring (Feb)', 4),
  ('Austria', 'AT', 'Low fees, high quality of life',
   'German-speaking, centrally located and consistently ranked among the best places to live.',
   array['Tuition around EUR 726 per semester','Red-White-Red card pathway to work','20 hours part-time work per week','Vienna ranked top city for quality of life','Schengen travel access'],
   array['German A2-B2 depending on programme','Recognised secondary or bachelor degree','Proof of funds (approx. EUR 13,000 / year)','Accommodation confirmation'],
   'EUR 726 / semester (public)', 'Winter (Oct) & Summer (Mar)', 5),
  ('Switzerland', 'CH', 'Hospitality and banking excellence',
   'Home of the world''s leading hospitality schools, with paid internships built into most programmes.',
   array['Paid internships inside hospitality degrees','Globally ranked institutions','Multilingual environment','Very high graduate salaries','15 hours part-time work per week'],
   array['Strong academic record','IELTS 6.0-6.5 or equivalent','Proof of funds (approx. CHF 21,000 / year)','Interview for hospitality schools'],
   'CHF 1,000 - 25,000 / year', 'Feb & Sept', 6)
on conflict do nothing;

insert into public.apprenticeships (title, field, salary, duration, description, requirements, benefits, display_order)
values
  ('IT & Software (Fachinformatiker)', 'IT', 'EUR 1,000 - 1,300 / month', '3 years',
   'Train as an IT specialist in application development or systems integration with a German company.',
   array['German B1 (B2 preferred)','FSc Pre-Engineering / ICS or equivalent','Basic programming or networking knowledge','Age 18-30'],
   array['Paid from day one','Permanent job offer on completion','Health and pension insurance included','Employer usually sponsors the visa'], 1),
  ('Nursing (Pflegefachmann/-frau)', 'Nursing', 'EUR 1,200 - 1,500 / month', '3 years',
   'Germany''s most in-demand profession, combining classroom study with paid clinical placements.',
   array['German B1 minimum, B2 for licensing','FSc Pre-Medical or nursing diploma','Medical fitness certificate','Clean police record'],
   array['Highest apprenticeship salary bracket','Guaranteed employment after training','Fast-track family reunion','PR eligibility after 21 months of work'], 2),
  ('Hotel & Hospitality (Hotelfachmann)', 'Hospitality', 'EUR 900 - 1,200 / month', '3 years',
   'Front office, food service, events and housekeeping rotations in established hotel groups.',
   array['German A2-B1','Matric / FSc','Customer-service mindset','Willingness to work shifts'],
   array['Free or subsidised staff accommodation','Meals included on duty','Tips and seasonal bonuses','Skills transferable across Europe'], 3),
  ('Painting & Varnishing (Maler und Lackierer)', 'Painting', 'EUR 850 - 1,100 / month', '3 years',
   'A skilled trade with constant demand: surface preparation, decorative techniques and industrial coating.',
   array['German A2-B1','Matric or equivalent','Physically fit, no colour blindness','Age 18-35'],
   array['Shortest language requirement','Overtime paid at premium rates','Meister qualification pathway','Strong self-employment prospects'], 4),
  ('Bakery & Confectionery (Backer / Konditor)', 'Bakery', 'EUR 800 - 1,050 / month', '3 years',
   'German and continental baking: breads, pastries, tortes and chocolate work.',
   array['German A2-B1','Matric or equivalent','Early-shift availability','Food-hygiene certificate'],
   array['Very high acceptance rate','Product allowance and bonuses','Konditormeister career track','Employer-supported visa file'], 5)
on conflict do nothing;

-- ---------------------------------------------------------------------
-- 6. ADMIN USER
--    Create admin@wisdomlingo.com in Dashboard > Authentication > Users
--    ("Add user" > "Create new user", tick "Auto Confirm User").
--    Every authenticated user is treated as an admin by the policies above.
--    To restrict writes to one address instead, replace the write policies
--    with, for example:
--
--      create policy "courses admin write" on public.courses for all
--        to authenticated
--        using (auth.jwt() ->> 'email' = 'admin@wisdomlingo.com')
--        with check (auth.jwt() ->> 'email' = 'admin@wisdomlingo.com');
-- ---------------------------------------------------------------------
