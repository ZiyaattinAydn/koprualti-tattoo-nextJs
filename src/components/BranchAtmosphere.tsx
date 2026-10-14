import styles from "./BranchExplorer.module.css";

// Existing Köprüaltı motifs, in reserved space rather than dynamically measured
// card corners. CSS scales them in place; content updates never remount them.
const motifsBySection = {
  entry: ["fauna-swallow", "symbols-eye-emblem", "botanical-rosebud"],
  story: ["symbols-dagger-heart", "botanical-crescent", "fauna-cobra"],
  artists: ["classic-sword-heart", "fauna-swallow"],
  archive: ["botanical-rose", "classic-dice-pair"],
  location: ["fauna-koi", "botanical-clover"],
  booking: ["symbols-anatomical-heart", "symbols-crown"],
} as const;

export function BranchAtmosphere({
  variant = "entry",
  background = false,
}: {
  variant?: keyof typeof motifsBySection;
  background?: boolean;
}) {
  return (
    <div
      className={background ? styles.sectionAtmosphere : styles.atmosphere}
      aria-hidden="true"
      data-branch-doodles
    >
      {motifsBySection[variant].map((motif) => (
        <img
          key={motif}
          src={`/assets/doodles/${motif}-chalk.webp`}
          alt=""
          width={100}
          height={120}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}
