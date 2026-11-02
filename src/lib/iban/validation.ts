export function normalizeIban(value: string) {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function formatIban(value: string) {
  return normalizeIban(value).replace(/.{1,4}/g, "$& ").trim();
}

export function isValidTurkishIban(value: string) {
  const iban = normalizeIban(value);

  if (!/^TR\d{24}$/.test(iban)) return false;

  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  let remainder = 0;

  for (const character of rearranged) {
    const digits = /[A-Z]/.test(character)
      ? String(character.charCodeAt(0) - 55)
      : character;

    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }

  return remainder === 1;
}
