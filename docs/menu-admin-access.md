# Menü Admin Yetkilendirme

Her işletme ayrı Supabase Auth kullanıcısına bağlanmalıdır. Menü verileri `business_id`
ile ayrılır; admin erişimi ise `business_admins` tablosundaki kullanıcı-işletme eşleşmesiyle
kontrol edilir.

## Yeni İşletme Admini

1. Supabase Dashboard'da `Authentication` > `Users` bölümünden işletmeye özel kullanıcı oluştur.
2. İşletmenin `businesses.slug` kaydının var olduğundan emin ol.
3. Kullanıcıyı işletmeye bağla:

```sql
insert into public.business_admins (business_id, user_id, role)
select businesses.id, users.id, 'owner'
from public.businesses businesses
join auth.users users on users.email = 'isletme@example.com'
where businesses.slug = 'isletme-slug'
on conflict (business_id, user_id) do update
set role = excluded.role;
```

Örnek:

```sql
insert into public.business_admins (business_id, user_id, role)
select businesses.id, users.id, 'owner'
from public.businesses businesses
join auth.users users on users.email = 'hamarat@example.com'
where businesses.slug = 'hamarat'
on conflict (business_id, user_id) do update
set role = excluded.role;
```

Bu eşleşme yoksa kullanıcı giriş yapabilir, fakat ilgili işletmenin admin panelini açamaz.
