with image_seed(item_name, image_url) as (
  values
    ('Tavuk Suyu', '/images/sazende-tavuk-suyu.jpg'),
    ('Mercimek', '/images/sazende-mercimek.jpg'),
    ('Ezogelin', '/images/sazende-ezogelin.jpg'),
    ('Adana Dürüm', '/images/sazende-adana-durum.jpg'),
    ('Tereyağlı Mercimek', '/images/sazende-tereyagli-mercimek.jpg'),
    ('Antep Usulü Beyran', '/images/sazende-beyran.jpg'),
    ('Lahmacun', '/images/sazende-lahmacun.jpg'),
    ('Kellepaça', '/images/sazende-kelle-paca.jpg')
)
update public.menu_items item
set image_url = image_seed.image_url
from image_seed
join public.businesses business on business.slug = 'sazende'
where item.business_id = business.id
  and item.name = image_seed.item_name;
