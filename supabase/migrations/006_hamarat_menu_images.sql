with image_seed(category_name, image_url) as (
  values
    ('Fast Food', '/images/hamarat-fast-food.png'),
    ('Unlu Mamüller', '/images/hamarat-unlu-mamuller.png'),
    ('Yaş Pasta', '/images/hamarat-yas-pasta.png'),
    ('Adet Pasta', '/images/hamarat-yas-pasta.png'),
    ('Tatlılar', '/images/hamarat-tatlilar.png'),
    ('Sıcak İçecekler', '/images/hamarat-sicak-icecekler.png'),
    ('Soğuk İçecekler', '/images/hamarat-soguk-icecekler.jpg')
)
update public.menu_items item
set image_url = image_seed.image_url
from public.menu_categories category
join public.businesses business on business.id = category.business_id
join image_seed on image_seed.category_name = category.name
where item.business_id = business.id
  and item.category_id = category.id
  and business.slug = 'hamarat';
