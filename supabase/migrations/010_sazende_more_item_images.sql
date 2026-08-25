with image_seed(item_name, image_url) as (
  values
    ('Kellepaça', '/images/sazende-kelle-paca-yeni.jpg'),
    ('Kaşarlı Kuşbaşılı Pide', '/images/sazende-kasarli-kusbasili-pide.jpg'),
    ('B. Boy Kaşarlı Pide', '/images/sazende-kasarli-kusbasili-pide.jpg'),
    ('Kuşbaşılı Pide', '/images/sazende-kusbasili-pide.jpg'),
    ('Sucuklu Kaşarlı Pide', '/images/sazende-sucuklu-kasarli-pide.jpg'),
    ('Kavurmalı Kaşarlı Pide', '/images/sazende-kavurmali-kasarli-pide.jpg'),
    ('Kavurmalı Pide', '/images/sazende-kavurmali-kasarli-pide.jpg'),
    ('Karışık Pide', '/images/sazende-karisik-pide.jpg'),
    ('Tavuk Şiş', '/images/sazende-tavuk-sis.jpg'),
    ('Tavuk Kanat', '/images/sazende-tavuk-kanat.jpg'),
    ('Kanat', '/images/sazende-tavuk-kanat.jpg'),
    ('Kaşarlı Lahmacun', '/images/sazende-kasarli-lahmacun.jpg')
)
update public.menu_items item
set image_url = image_seed.image_url
from image_seed
join public.businesses business on business.slug = 'sazende'
where item.business_id = business.id
  and item.name = image_seed.item_name;
