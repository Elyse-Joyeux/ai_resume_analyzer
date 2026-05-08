interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const badgeClass =
    score > 70
      ? "bg-badge-green text-green-600"
      : score > 49
        ? "bg-badge-yellow text-yellow-600"
        : "bg-badge-red text-red-600";
  const label = score > 70 ? "Strong" : score > 49 ? "Good start" : "Needs Work";

  return (
    <div className={`rounded-full px-3 py-1 ${badgeClass}`}>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default ScoreBadge;
