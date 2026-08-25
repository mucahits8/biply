with image_seed(category_name, item_name, image_url) as (
  values
    ('Izgaralar', 'Adana', '/images/sazende-adana-porsiyon.jpg'),
    ('Izgaralar', 'Urfa', '/images/sazende-urfa-porsiyon.jpg'),
    ('Izgaralar', 'Karışık Izgara', '/images/sazende-karisik-izgara.jpg'),
    ('Et Dönerler', 'Tam Ekmek Et Döner', '/images/sazende-tam-ekmek-et-doner.jpg'),
    ('Et Dönerler', '3 Çeyrek Et Döner', '/images/sazende-et-doner-3-ceyrek.jpg'),
    ('Tavuk Dönerler', 'Bütün Ekmek', '/images/sazende-tam-ekmek-tavuk-doner.jpg'),
    ('Tavuk Dönerler', 'Tombik', '/images/sazende-tombik-tavuk-doner.jpg'),
    ('Tavuk Dönerler', 'Yarım Ekmek', '/images/sazende-yarim-ekmek-tavuk-doner.jpg'),
    ('Salatalar', 'Çoban Salata', '/images/sazende-coban-salata.jpg'),
    ('Salatalar', 'Cacık', '/images/sazende-cacik.jpg'),
    ('Salatalar', 'Ezme', '/images/sazende-ezme.jpg'),
    ('Salatalar', 'Roka Salatası', '/images/sazende-roka-salatasi.jpg'),
    ('Salatalar', 'Roka', '/images/sazende-roka-salatasi.jpg'),
    ('Salatalar', 'Mevsim Salata', '/images/sazende-mevsim-salata.jpg'),
    ('Salatalar', 'Haydari', '/images/sazende-haydari.jpg'),
    ('Salatalar', 'Adana Salatası', '/images/sazende-adana-salatasi.jpg'),
    ('Salatalar', 'Yoğurt', '/images/sazende-yogurt.jpg'),
    ('Çorbalar', 'Dana Ayak Paça Kemiksiz', '/images/sazende-ayak-paca.jpg'),
    ('Çorbalar', 'Dil Paça', '/images/sazende-dil-paca.jpg'),
    ('Çorbalar', 'Munbar Dolması', '/images/sazende-munbar-dolmasi.jpg')
)
update public.menu_items item
set image_url = image_seed.image_url
from image_seed
join public.businesses business
  on business.slug = 'sazende'
join public.menu_categories category
  on category.business_id = business.id
 and category.name = image_seed.category_name
where item.business_id = business.id
  and item.category_id = category.id
  and item.name = image_seed.item_name;
