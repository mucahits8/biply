"use client";

export default function IbanError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 text-zinc-900">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Ödeme bilgileri şu anda görüntülenemiyor</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Güncel hesap bilgisini doğrulayamadık. Lütfen biraz sonra tekrar deneyin.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Tekrar dene
        </button>
      </div>
    </main>
  );
}
