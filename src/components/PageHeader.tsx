import Reveal from "./Reveal";
import SplitLines from "./SplitLines";
import { SectionLabel } from "./sections";

export default function PageHeader({
  label,
  title,
  tail,
  lede,
}: {
  label: string;
  title: string;
  tail?: string;
  lede?: string;
}) {
  return (
    <header className="bg-paper px-6 pb-16 pt-16 sm:px-10 sm:pb-20 sm:pt-24">
      <Reveal>
        <SectionLabel>{label}</SectionLabel>
      </Reveal>
      <SplitLines
        as="h1"
        lines={[tail ? { text: title, tail } : { text: title }]}
        className="display mt-6 text-[13vw] leading-[0.84] sm:text-[7rem]"
        delay={0.05}
      />
      {lede && (
        <Reveal delay={0.08}>
          <p className="mt-8 max-w-xl text-[0.95rem] leading-relaxed text-black/65">
            {lede}
          </p>
        </Reveal>
      )}
    </header>
  );
}
