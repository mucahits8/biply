with business as (
  insert into public.businesses (name, slug, subtitle)
  values ('Hamarat Pastane & Kafe', 'hamarat', 'Pastane • Kafe • Fast Food')
  on conflict (slug) do update
  set name = excluded.name,
      subtitle = excluded.subtitle
  returning id
),
category_seed(name, sort_order) as (
  values
    ('Fast Food', 10),
    ('Unlu Mamüller', 20),
    ('Yaş Pasta', 30),
    ('Adet Pasta', 40),
    ('Tatlılar', 50),
    ('Sıcak İçecekler', 60),
    ('Soğuk İçecekler', 70)
),
categories as (
  insert into public.menu_categories (business_id, name, sort_order)
  select business.id, category_seed.name, category_seed.sort_order
  from business
  cross join category_seed
  where not exists (
    select 1
    from public.menu_categories existing
    where existing.business_id = business.id
      and existing.name = category_seed.name
  )
  returning id, business_id, name
),
all_categories as (
  select c.id, c.business_id, c.name
  from public.menu_categories c
  join business b on b.id = c.business_id
),
item_seed(category_name, name, price, sort_order) as (
  values
    ('Fast Food', 'Hamburger', 135, 10),
    ('Fast Food', 'Hamarat Burger', 165, 20),
    ('Fast Food', 'Patso', 105, 30),
    ('Fast Food', 'Karışık Tost', 115, 40),
    ('Fast Food', 'Peynirli Tost', 90, 50),
    ('Fast Food', 'Sandviç', 95, 60),
    ('Unlu Mamüller', 'Simit', 25, 10),
    ('Unlu Mamüller', 'Poğaça', 35, 20),
    ('Unlu Mamüller', 'Açma', 35, 30),
    ('Unlu Mamüller', 'Gül Böreği', 70, 40),
    ('Unlu Mamüller', 'Kol Böreği', 85, 50),
    ('Unlu Mamüller', 'Su Böreği', 95, 60),
    ('Unlu Mamüller', 'Kapalı Pizza', 75, 70),
    ('Unlu Mamüller', 'Mini Pizza', 55, 80),
    ('Unlu Mamüller', 'Kurabiye Çeşitleri', 80, 90),
    ('Yaş Pasta', 'Yaş Pasta 01', 145, 10),
    ('Yaş Pasta', 'Yaş Pasta 02', 150, 20),
    ('Yaş Pasta', 'Yaş Pasta 03', 155, 30),
    ('Yaş Pasta', 'Baton Yaş Pasta', 450, 40),
    ('Yaş Pasta', 'Mini Baton Yaş Pasta', 250, 50),
    ('Yaş Pasta', 'Mozaik Pasta', 110, 60),
    ('Adet Pasta', 'Köstebek Pasta Mini', 95, 10),
    ('Adet Pasta', 'Ekler Mini', 85, 20),
    ('Adet Pasta', 'Muffin', 80, 30),
    ('Adet Pasta', 'Magnolia', 125, 40),
    ('Adet Pasta', 'Profiterol', 115, 50),
    ('Adet Pasta', 'Supangle', 110, 60),
    ('Adet Pasta', 'Cheesecake', 145, 70),
    ('Adet Pasta', 'Malaga', 150, 80),
    ('Tatlılar', 'Fındıklı ve Cevizli Baklava', 170, 10),
    ('Tatlılar', 'Soğuk Baklava', 160, 20),
    ('Tatlılar', 'Burma Kadayıf', 150, 30),
    ('Tatlılar', 'Laz Böreği', 125, 40),
    ('Tatlılar', 'Revani', 90, 50),
    ('Tatlılar', 'Şekerpare', 90, 60),
    ('Tatlılar', 'Sütlaç', 100, 70),
    ('Tatlılar', 'Kazandibi', 105, 80),
    ('Sıcak İçecekler', 'Küçük Çay', 30, 10),
    ('Sıcak İçecekler', 'Fincan Çay', 40, 20),
    ('Sıcak İçecekler', 'Türk Kahvesi', 80, 30),
    ('Sıcak İçecekler', 'Nescafe', 75, 40),
    ('Sıcak İçecekler', 'Filtre Kahve', 90, 50),
    ('Sıcak İçecekler', 'Sütlü Filtre Kahve', 105, 60),
    ('Sıcak İçecekler', 'Latte', 110, 70),
    ('Sıcak İçecekler', 'Sıcak Çikolata', 95, 80),
    ('Sıcak İçecekler', 'Sahlep', 95, 90),
    ('Soğuk İçecekler', 'Su', 25, 10),
    ('Soğuk İçecekler', 'Soda', 35, 20),
    ('Soğuk İçecekler', 'Meyveli Soda', 45, 30),
    ('Soğuk İçecekler', 'Şişe İçecek', 65, 40),
    ('Soğuk İçecekler', 'Limonata', 75, 50),
    ('Soğuk İçecekler', 'Hamarat Şerbeti', 80, 60),
    ('Soğuk İçecekler', 'Küçük Meyve Suyu', 40, 70)
)
insert into public.menu_items (
  business_id, category_id, name, description, price, weight, image_url, sort_order,
  is_active, is_available, kcal, kcal_is_estimated, allergens, allergen_note,
  allergen_is_verified
)
select
  c.business_id,
  c.id,
  item_seed.name,
  null,
  item_seed.price,
  null,
  null,
  item_seed.sort_order,
  true,
  true,
  null,
  true,
  '{}',
  null,
  false
from all_categories c
join item_seed on item_seed.category_name = c.name
where not exists (
  select 1
  from public.menu_items existing
  where existing.business_id = c.business_id
    and existing.category_id = c.id
    and existing.name = item_seed.name
);
