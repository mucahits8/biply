with image_seed(category_name, item_name, image_url) as (
  values
    ('Fast Food', 'Patso', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/a8e34b7e-46f7-4490-8e6e-8ca350bb9fcc.png'),
    ('Fast Food', 'Patates cipsi', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/f1e998d3-9c4e-424d-a521-d974236da985.jpg'),
    ('Fast Food', 'Hamburger', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/3c36663e-7394-4e41-a093-92cfc5f438cc.jpg'),
    ('Fast Food', 'Karışık Tost', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/69234c74-a17d-41a8-b7d4-0b9cc3c3e8f1.png'),
    ('Fast Food', 'Peynirli Tost', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/864e83e3-4031-4f37-ab37-d63f51ca9879.jpg'),
    ('Unlu Mamüller', 'Poğaça', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/c502ecb5-ba32-4157-a6fd-1af086571157.jpg'),
    ('Unlu Mamüller', 'Açma', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/7d192eaf-1a89-43f8-a466-f6a22039b855.jpg'),
    ('Unlu Mamüller', 'Kol Böreği (Kıymalı)', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/68964df7-6714-403f-b079-0d56efd7181a.jpg'),
    ('Unlu Mamüller', 'Kol Böreği (Peynirli-Pazılı)', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/aee6feef-2dd4-495b-a6e7-92e778f91a69.jpg'),
    ('Unlu Mamüller', 'Su Böreği', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/c348d6da-5dda-4c62-96df-362e9e538996.jpg'),
    ('Unlu Mamüller', 'Mini Pizza', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/a338fa0e-2505-4273-9b53-4cfb4fe32ea7.avif'),
    ('Unlu Mamüller', 'Kurabiye Çeşitleri', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/873c2c2e-b9c5-47e0-a903-07be8c84d77e.webp'),
    ('Unlu Mamüller', 'Simit', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/cb614645-4a50-4fe2-87ff-95a0c0b6c217.webp'),
    ('Yaş Pasta', 'Yaş Pasta 01', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/b874b196-17fc-4e45-96a4-1aa269a136d4.jpg'),
    ('Yaş Pasta', 'Yaş Pasta 02', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/e7868936-21ee-4009-a86d-e45e8016193a.jpg'),
    ('Yaş Pasta', 'Yaş Pasta 03', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/87d1f27a-ce11-4e6c-a95d-2da231403eaf.jpg'),
    ('Yaş Pasta', 'Mini Baton Yaş Pasta', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/8bf2582a-087b-42d1-bc1a-8a238479be1d.jpg'),
    ('Yaş Pasta', 'Baton Yaş Pasta', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/09df0ae5-fa68-41c3-a207-f0b605b27e33.jpg'),
    ('Adet Pasta', 'Köstebek Pasta Mini', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/fe547ee9-0954-4ca0-b45d-0897561b0a5b.jpg'),
    ('Adet Pasta', 'Ekler Mini', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/e5cd5eb6-f4cf-4ae9-aec8-17762d470d66.jpg'),
    ('Adet Pasta', 'Muffin', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/51b7b0e8-c5d8-4256-99a9-5eb312bb5253.jpg'),
    ('Adet Pasta', 'Magnolia', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/bbd28ed1-75d9-4522-b046-35158d0d1bdb.jpg'),
    ('Adet Pasta', 'Profiterol', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/363c02f6-c978-4ea9-a12e-49cdaea74d05.jpeg'),
    ('Adet Pasta', 'Supangle', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/94af330f-71a9-4ea0-9349-124baf991233.jpg'),
    ('Adet Pasta', 'Cheesecake', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/5c07bc01-5cf7-4462-a701-0821b37d1b55.webp'),
    ('Adet Pasta', 'Malaga', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/75629904-b317-4996-9cee-14e6c272145f.jpg'),
    ('Tatlılar', 'Fındıklı ve Cevizli Baklava', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/5805ba22-6ae7-476e-b1fc-ead80f0ca64b.jpg'),
    ('Tatlılar', 'Soğuk Baklava', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/dce25eb3-8bf5-43d6-a0e3-f85ac6b3ef3f.avif'),
    ('Tatlılar', 'Burma Kadayıf', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/b4e6de33-c28a-496b-9d35-647b393e130a.jpg'),
    ('Tatlılar', 'Laz Böreği', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/dd4fb726-ba19-4db9-a167-c325a9c3a26c.png'),
    ('Tatlılar', 'Revani', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/0fd6985c-257e-40ef-96f9-dba1b2d0ed83.gif'),
    ('Tatlılar', 'Şekerpare', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/7bfea73b-afdc-4377-b866-4e86bea7acc4.jpg'),
    ('Tatlılar', 'Sütlaç', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/03230e65-3dc5-40a4-a854-717380c34a80.jpg'),
    ('Tatlılar', 'Kazandibi', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/0cbfd5a3-d178-41f9-9153-d209a8cfb2de.webp'),
    ('Tatlılar', 'Tulumba', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/233e80af-b0ad-4c7c-8aa4-d83b1cde5291.jpg'),
    ('Tatlılar', 'Fıstıklı Baklava', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/e00dca64-fb08-4e7f-a7c8-ea8415e6a434.jpg'),
    ('Tatlılar', 'Büzme Baklava', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/aa1e997e-e3ab-47f4-aa44-d7135778981a.jpg'),
    ('Adet Pasta', 'İzmir Bomba', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/d792dc02-3f29-4261-87cc-fa2df9e79d0f.jpg'),
    ('Tatlılar', 'Beze (kaymak)', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/b5b2109f-781a-4236-a779-bea7e2f756cf.png'),
    ('Sıcak İçecekler', 'Fincan Çay', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/48477274-82ca-499d-9de2-7545c32313f2.jpg'),
    ('Sıcak İçecekler', 'Türk Kahvesi', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/941233b6-1c65-4c27-9eb3-1a0fac9daf68.jpg'),
    ('Sıcak İçecekler', 'Nescafe', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/d83cdfce-c18a-477c-8dfb-b74080fcf1c0.jpg'),
    ('Sıcak İçecekler', 'Filtre Kahve', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/4b983cd1-aa23-4e5a-8f0c-24c891d2a5e3.webp'),
    ('Sıcak İçecekler', 'Sütlü Filtre Kahve', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/984a99c6-64c9-4aca-a45b-d11d7973d81a.webp'),
    ('Sıcak İçecekler', 'Latte', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/2d0a7e53-eb6c-4887-ab02-7ae65fafcbb1.webp'),
    ('Sıcak İçecekler', 'Sıcak Çikolata', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/33bad32f-ae95-4692-9d56-fbb95980f745.jpg'),
    ('Sıcak İçecekler', 'Sahlep', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/32532a62-8b0c-4d61-8a6c-6df5725cb9a5.jpg'),
    ('Soğuk İçecekler', 'Su', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/b8aa37eb-ada7-483b-b867-25f4bc1e6db5.webp'),
    ('Soğuk İçecekler', 'Soda', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/77e6f1e9-1bc9-4a9d-be6e-5c1e59f43612.jpg'),
    ('Soğuk İçecekler', 'Meyveli Soda', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/50c3150f-5bd7-42be-9167-31587ac27480.jpg'),
    ('Soğuk İçecekler', 'Şişe İçecek', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/5679ab1f-f89d-48fb-ab45-7adbec83483c.webp'),
    ('Soğuk İçecekler', 'Limonata', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/943305fc-3573-44dc-b223-b6c6d4016ba3.jpg'),
    ('Soğuk İçecekler', 'Hamarat Şerbeti', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/b4f601ae-cf12-4749-852c-e57cbe2b70ab.png'),
    ('Soğuk İçecekler', 'Küçük Meyve Suyu', 'https://dbzpgkpcbiveuahujgbz.supabase.co/storage/v1/object/public/menu-images/items/hamarat/e6066530-725a-4c88-95ab-a163b4abf711.jpg')
)
update public.menu_items item
set image_url = image_seed.image_url
from image_seed
join public.menu_categories category on category.name = image_seed.category_name
join public.businesses business on business.id = category.business_id
where item.category_id = category.id
  and item.business_id = business.id
  and business.slug = 'hamarat'
  and item.name = image_seed.item_name;
