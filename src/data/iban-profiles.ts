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
];

export function getIbanProfileBySlug(slug: string) {
  return ibanProfiles.find((profile) => profile.slug === slug);
}

export function getCompactIban(iban: string) {
  return iban.replace(/\s+/g, "").toUpperCase();
}
