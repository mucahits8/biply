import type { Metadata } from "next";
import { IbanAdminClient } from "@/components/iban/IbanAdminClient";

export const metadata: Metadata = {
  title: "IBAN Yönetimi | Biply",
  description: "Biply IBAN sayfalarınızın hesap bilgilerini yönetin.",
  robots: { index: false, follow: false },
};

export default function IbanAdminPage() {
  return <IbanAdminClient />;
}
