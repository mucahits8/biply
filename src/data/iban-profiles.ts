export type IbanProfile = {
  slug: string;
  businessName: string;
  recipientName: string;
  iban: string;
  bankName?: string;
  description?: string;
  draft?: boolean;
};

export const ibanProfiles: IbanProfile[] = [
  {
    slug: "arzum-kuafor",
    businessName: "Arzum Kuaför",
    recipientName: "Arzu Kaya",
    iban: "TR80 0006 2000 4590 0006 6747 57",
    bankName: "Garanti BBVA",
    description: "Arzum Kuaför",
  },
  {
    slug: "iban1",
    businessName: "Örnek İşletme",
    recipientName: "Örnek Hesap Sahibi",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama",
  },
  {
    slug: "iban2",
    businessName: "Örnek İşletme 2",
    recipientName: "Örnek Hesap Sahibi 2",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 2",
  },
  {
    slug: "iban3",
    businessName: "Örnek İşletme 3",
    recipientName: "Örnek Hesap Sahibi 3",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 3",
  },
  {
    slug: "iban4",
    businessName: "Örnek İşletme 4",
    recipientName: "Örnek Hesap Sahibi 4",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 4",
  },
  {
    slug: "iban5",
    businessName: "Örnek İşletme 5",
    recipientName: "Örnek Hesap Sahibi 5",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 5",
  },
];

export function getIbanProfileBySlug(slug: string) {
  return ibanProfiles.find((profile) => profile.slug === slug);
}

export function getCompactIban(iban: string) {
  return iban.replace(/\s+/g, "").toUpperCase();
}
