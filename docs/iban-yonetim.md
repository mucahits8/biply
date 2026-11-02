# IBAN yönetimi

`/iban-yonetim` sayfası Biply'deki mevcut IBAN sayfalarını düzenler. Giriş,
projede kullanılan Supabase Auth hesabıyla yapılır. Kaydedilen bilgiler
`public.iban_profile_overrides` tablosunda tutulur ve `/iban/[slug]` sayfası
her istekte güncel kaydı okur. Kod içindeki kayıtlar başlangıç verisidir;
veritabanındaki bir kayıt varsa o gösterilir.

## İlk kurulum

1. `supabase/migrations/019_iban_profile_editor.sql` dosyasını ilgili Supabase
   projesine uygula.
2. Supabase Auth'ta giriş yapacak kullanıcıyı oluştur veya mevcut kullanıcıyı
   seç. Bu hesaba IBAN yetkisini SQL Editor'da ver:

   ```sql
   insert into public.iban_admins (user_id)
   select id from auth.users
   where lower(email) = lower('yonetici@ornek.com')
   on conflict (user_id) do nothing;
   ```

3. Hesabın e-posta/şifresiyle `/iban-yonetim` adresinde giriş yap. Kaydedilen
   değişikliklerin `/iban/<sayfa>` adresinde göründüğünü doğrula.

IBAN yöneticileri yalnızca `iban_admins` tablosunda kayıtlı kullanıcılar olabilir.
RLS, herkese yalnızca canlı sayfalar için gereken okuma iznini verir. Yazma izni
giriş yapmış IBAN yöneticileriyle sınırlıdır. Supabase gizli anahtarını tarayıcıya
veya `NEXT_PUBLIC_` değişkenlerine koyma.

Yönetim oturumu yaklaşık bir saat sürer. Oturum süresi dolduğunda yeniden giriş
yapılır. Ödeme bilgisinin güncel halini doğrulamak için veritabanı erişilemiyorsa
canlı sayfa eski IBAN'a geri dönmez; geçici hata gösterir.
