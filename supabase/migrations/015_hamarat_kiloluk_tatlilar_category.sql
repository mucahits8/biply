insert into public.menu_categories (business_id, name, sort_order, is_active)
select business.id, 'Kiloluk Tatlılar', 55, true
from public.businesses business
where business.slug = 'hamarat'
  and not exists (
    select 1
    from public.menu_categories category
    where category.business_id = business.id
      and category.name = 'Kiloluk Tatlılar'
  );
