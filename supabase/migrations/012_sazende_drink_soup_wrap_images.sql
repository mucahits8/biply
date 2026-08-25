with image_seed(category_name, item_name, image_url) as (
  values
    ('İçecekler', 'Su', '/images/sazende-su.jpg'),
    ('İçecekler', 'Soda', '/images/sazende-soda.jpg'),
    ('İçecekler', 'Şalgam', '/images/sazende-salgam.jpg'),
    ('İçecekler', 'Küçük Ayran', '/images/sazende-kucuk-ayran.jpg'),
    ('İçecekler', 'Büyük Ayran', '/images/sazende-buyuk-ayran.jpg'),
    ('İçecekler', 'Kutu Sarıyer', '/images/sazende-kutu-sariyer.jpg'),
    ('İçecekler', 'Sarıyer Kola Litrelik', '/images/sazende-litrelik-sariyer.jpg'),
    ('Çorbalar', 'Tuzlama', '/images/sazende-tuzlama.jpg'),
    ('Çorbalar', 'İşkembe (Kazan)', '/images/sazende-iskembe-damar-dana-ayak.jpg'),
    ('Çorbalar', 'Damar Tuzlama', '/images/sazende-iskembe-damar-dana-ayak.jpg'),
    ('Çorbalar', 'Dana Ayak Paça Kemiksiz', '/images/sazende-iskembe-damar-dana-ayak.jpg'),
    ('Çorbalar', 'Tereyağlı Mercimek', '/images/sazende-tereyagli-mercimek-yeni.jpg'),
    ('Izgaralar', 'Urfa', '/images/sazende-urfa.jpg'),
    ('Dürümler', 'Urfa Dürüm', '/images/sazende-urfa.jpg'),
    ('Dürümler', 'Tavuk Şiş Dürüm', '/images/sazende-tavuk-sis-durum.jpg'),
    ('Dürümler', 'Köfte Dürüm', '/images/sazende-kofte-durum.jpg'),
    ('Et Dönerler', 'Tombik Et Döner', '/images/sazende-tombik-et-doner.jpg'),
    ('Et Dönerler', 'Tereyağlı İskender', '/images/sazende-tereyagli-iskender.jpg'),
    ('Fırınlar', 'B. Boy Kıymalı Pide', '/images/sazende-kiymali-pide.jpg'),
    ('Fırınlar', 'Fındık Lahmacun', '/images/sazende-findik-lahmacun.jpg'),
    ('Fırınlar', 'Sucuklu Pide', '/images/sazende-sucuklu-pide.jpg')
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
