interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const badgeClass =
    score > 70
      ? "bg-emerald-200 text-emerald-950 ring-1 ring-emerald-400/60 dark:bg-emerald-500/20 dark:text-emerald-100 dark:ring-emerald-300/30"
      : score > 49
        ? "bg-amber-200 text-amber-950 ring-1 ring-amber-400/60 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-300/30"
        : "bg-red-200 text-red-950 ring-1 ring-red-400/60 dark:bg-red-500/20 dark:text-red-100 dark:ring-red-300/30";
  const label = score > 70 ? "Strong" : score > 49 ? "Good start" : "Needs Work";

  return (
    <div className={`rounded-full px-3 py-1 ${badgeClass}`}>
      <p className="text-sm font-extrabold">{label}</p>
    </div>
  );
};

export default ScoreBadge;
