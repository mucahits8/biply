with image_seed(category_name, item_name, image_url) as (
  values
    ('Sulu Yemekler', 'Kuru Fasülye', '/images/sazende-kuru-fasulye.jpg'),
    ('Sulu Yemekler', 'Taze Fasülye', '/images/sazende-taze-fasulye.jpg'),
    ('Sulu Yemekler', 'Patlıcan Musakka', '/images/sazende-patlican-musakka.jpg'),
    ('Sulu Yemekler', 'Karnıyarık', '/images/sazende-karniyarik.jpg'),
    ('Sulu Yemekler', 'Arnavut Ciğeri', '/images/sazende-arnavut-cigeri.jpg'),
    ('Sulu Yemekler', 'Tas Kebabı', '/images/sazende-tas-kebabi.jpg'),
    ('Sulu Yemekler', 'İzmir Köfte', '/images/sazende-izmir-kofte.jpg'),
    ('Sulu Yemekler', 'Tavuk Sote', '/images/sazende-tavuk-sote.jpg'),
    ('Sulu Yemekler', 'Pirinç Pilavı', '/images/sazende-pirinc-pilavi.jpg'),
    ('Sulu Yemekler', 'Bulgur Pilavı', '/images/sazende-bulgur-pilavi.jpg'),
    ('Sulu Yemekler', 'Pırasa', '/images/sazende-pirasa.jpg'),
    ('Sulu Yemekler', 'Ispanak', '/images/sazende-ispanak.jpg'),
    ('Sulu Yemekler', 'Karnabahar', '/images/sazende-karnabahar.jpg'),
    ('Sulu Yemekler', 'Fırın Köfte', '/images/sazende-firin-kofte.jpg'),
    ('Sulu Yemekler', 'Çoban Kavurma', '/images/sazende-coban-kavurma.jpg')
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
