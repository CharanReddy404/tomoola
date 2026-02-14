-- Seed: 9 Karnataka Folk Art Forms
INSERT INTO "ArtForm" (id, name, slug, description, region, category, "createdAt") VALUES
  ('af_dollu', 'Dollu Kunitha', 'dollu-kunitha', 'A major popular drum dance of Karnataka accompanied by the beats of the Dollu, involving high-energy synchronized movements.', 'North Karnataka', 'Percussion', NOW()),
  ('af_yaksha', 'Yakshagana', 'yakshagana', 'A traditional folk theater form combining dance, music, dialogue, costume, make-up, and stage techniques with a unique style.', 'Coastal Karnataka', 'Theater', NOW()),
  ('af_huli', 'Huli Vesha', 'huli-vesha', 'A folk dance where performers paint their bodies with tiger stripes and perform energetic routines during festivals.', 'Coastal Karnataka', 'Dance', NOW()),
  ('af_veera', 'Veeragase', 'veeragase', 'A vigorous folk dance based on Hindu mythology, typically performed during Shravana and Karthika months.', 'North Karnataka', 'Ritualistic', NOW()),
  ('af_kamsale', 'Kamsale', 'kamsale', 'A rhythmic dance performed by devotees of Lord Mahadeshwara using brass cymbals with complex movements.', 'South Karnataka', 'Devotional', NOW()),
  ('af_pata', 'Pata Kunitha', 'pata-kunitha', 'A traditional folk dance performed with decorated wooden frames, popular in southern Karnataka.', 'South Karnataka', 'Dance', NOW()),
  ('af_pooja', 'Pooja Kunitha', 'pooja-kunitha', 'A ritualistic dance where performers carry a bamboo structure decorated with colorful cloths on their heads.', 'South Karnataka', 'Ritualistic', NOW()),
  ('af_garudi', 'Garudi Gombe', 'garudi-gombe', 'A large puppet dance form where performers wear massive puppet costumes and dance to folk music.', 'South Karnataka', 'Puppetry', NOW()),
  ('af_chenda', 'Chenda Melam', 'chenda-melam', 'A powerful percussion ensemble featuring the Chenda drum, creating thunderous rhythmic patterns.', 'Coastal Karnataka', 'Percussion', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Seed: Admin user (phone: 9999999999)
INSERT INTO "User" (id, phone, name, role, "createdAt", "updatedAt") VALUES
  ('usr_admin', '9999999999', 'ToMoola Admin', 'ADMIN', NOW(), NOW())
ON CONFLICT (phone) DO NOTHING;
