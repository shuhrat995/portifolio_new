import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal className={centered ? "text-center" : ""}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed text-slate-400 ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      ) : null}
      <span
        className={`mt-6 block h-px w-24 bg-gradient-to-r from-brand-500 via-aqua-400 to-transparent ${
          centered ? "mx-auto" : ""
        }`}
      />
    </Reveal>
  );
}
