type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeader({ eyebrow, title, description, centered = false }: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-black tracking-[-0.055em] text-zinc-950 sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">{description}</p> : null}
    </div>
  );
}
