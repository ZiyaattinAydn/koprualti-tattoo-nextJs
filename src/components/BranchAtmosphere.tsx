import styles from "./BranchExplorer.module.css";

// Existing Köprüaltı motifs, in reserved space rather than dynamically measured
// card corners. CSS scales them in place; content updates never remount them.
export function BranchAtmosphere({
  variant = "entry",
}: {
  variant?: "entry" | "story";
}) {
  const motifs =
    variant === "entry"
      ? ["fauna-swallow", "symbols-eye-emblem", "botanical-rosebud"]
      : ["symbols-dagger-heart", "botanical-crescent", "fauna-cobra"];
  return (
    <div className={styles.atmosphere} aria-hidden="true" data-branch-doodles>
      {motifs.map((motif) => (
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
