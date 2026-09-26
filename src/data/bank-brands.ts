export type BankId = "akbank" | "garanti-bbva" | "yapi-kredi" | "ziraat-bankasi";

export type BankBrand = {
  id: BankId;
  name: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  badgeClassName: string;
  imageClassName: string;
};

export const bankBrands: Record<BankId, BankBrand> = {
  akbank: {
    id: "akbank",
    name: "Akbank",
    logoSrc: "/images/banks/akbank.svg",
    logoAlt: "Akbank logosu",
    logoWidth: 250,
    logoHeight: 28,
    badgeClassName: "border-red-100 bg-white",
    imageClassName: "w-[62px]",
  },
  "garanti-bbva": {
    id: "garanti-bbva",
    name: "Garanti BBVA",
    logoSrc: "/images/banks/garanti-bbva.svg",
    logoAlt: "Garanti BBVA logosu",
    logoWidth: 310,
    logoHeight: 59,
    badgeClassName: "border-emerald-100 bg-white",
    imageClassName: "w-[68px]",
  },
  "yapi-kredi": {
    id: "yapi-kredi",
    name: "Yapı Kredi Bankası",
    logoSrc: "/images/banks/yapi-kredi.svg",
    logoAlt: "Yapı Kredi logosu",
    logoWidth: 185,
    logoHeight: 32,
    badgeClassName: "border-blue-900 bg-[#004481]",
    imageClassName: "w-[68px]",
  },
  "ziraat-bankasi": {
    id: "ziraat-bankasi",
    name: "Ziraat Bankası",
    logoSrc: "/images/banks/ziraat-bankasi.jpg",
    logoAlt: "Ziraat Bankası logosu",
    logoWidth: 100,
    logoHeight: 150,
    badgeClassName: "border-red-100 bg-white",
    imageClassName: "w-4",
  },
};

export function getBankBrand(bankId?: BankId) {
  return bankId ? bankBrands[bankId] : undefined;
}
