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
    businessName: "Belemir Pastanesi",
    recipientName: "Ali Tiryaki",
    iban: "TR93 0001 0002 4428 4039 7350 05",
    bankName: "Ziraat Bankası",
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
    businessName: "Berke Çildam",
    recipientName: "Berke Çildam",
    iban: "TR96 0004 6001 2088 8000 2540 21",
    bankName: "Akbank",
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
  {
    slug: "iban6",
    businessName: "Örnek İşletme 6",
    recipientName: "Örnek Hesap Sahibi 6",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 6",
  },
  {
    slug: "iban7",
    businessName: "Örnek İşletme 7",
    recipientName: "Örnek Hesap Sahibi 7",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 7",
  },
  {
    slug: "iban8",
    businessName: "Örnek İşletme 8",
    recipientName: "Örnek Hesap Sahibi 8",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 8",
  },
  {
    slug: "iban9",
    businessName: "Örnek İşletme 9",
    recipientName: "Örnek Hesap Sahibi 9",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 9",
  },
  {
    slug: "iban10",
    businessName: "Örnek İşletme 10",
    recipientName: "Örnek Hesap Sahibi 10",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bankName: "Örnek Banka",
    description: "Örnek Açıklama 10",
  },
];

export function getIbanProfileBySlug(slug: string) {
  return ibanProfiles.find((profile) => profile.slug === slug);
}

export function getCompactIban(iban: string) {
  return iban.replace(/\s+/g, "").toUpperCase();
}
