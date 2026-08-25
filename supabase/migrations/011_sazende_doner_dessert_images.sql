with image_seed(category_name, item_name, image_url) as (
  values
    ('Tavuk Dönerler', 'Porsiyon', '/images/sazende-tavuk-doner-porsiyon-pilavustu.jpg'),
    ('Tavuk Dönerler', 'Pilavüstü', '/images/sazende-tavuk-doner-porsiyon-pilavustu.jpg'),
    ('Tavuk Dönerler', '3 Çeyrek', '/images/sazende-tavuk-doner-3-ceyrek.jpg'),
    ('Et Dönerler', 'Yarım Ekmek Et Döner', '/images/sazende-et-doner-yarim-ekmek.jpg'),
    ('Et Dönerler', 'Pilavüstü Et Döner', '/images/sazende-et-doner-porsiyon-pilavustu.jpg'),
    ('Et Dönerler', 'Porsiyon Et Döner', '/images/sazende-et-doner-porsiyon-pilavustu.jpg'),
    ('Et Dönerler', 'Beyti', '/images/sazende-beyti.jpg'),
    ('Tatlılar', 'Sütlaç', '/images/sazende-sutlac.jpg'),
    ('Tatlılar', 'Künefe', '/images/sazende-kunefe.jpg'),
    ('Tatlılar', 'Kemalpaşa', '/images/sazende-kemalpasa.jpg')
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
