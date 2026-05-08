interface ATSProps {
  score: number;
  suggestions: {
    type: "good" | "improve";
    tip: string;
  }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const gradientClass =
    score > 70
      ? "from-green-100"
      : score > 49
        ? "from-yellow-100"
        : "from-red-100";
  const atsIcon =
    score > 70
      ? "/assets/icons/ats-good.svg"
      : score > 49
        ? "/assets/icons/ats-warning.svg"
        : "/assets/icons/ats-bad.svg";

  return (
    <div className={`rounded-2xl bg-linear-to-b ${gradientClass} to-white p-6 shadow-md`}>
      <div className="flex items-center gap-4">
        <img src={atsIcon} alt="" className="size-14" />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            ATS Score = {score}/100
          </h3>
          <p className="text-sm text-gray-600">
            This score estimates how well your resume may perform with applicant tracking systems.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            How to improve your ATS match
          </h4>
          <p className="mt-1 text-sm text-gray-600">
            Review the suggestions below to make your resume easier for hiring systems and recruiters to scan.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.tip} className="flex items-start gap-3">
              <img
                src={
                  suggestion.type === "good"
                    ? "/assets/icons/check.svg"
                    : "/assets/icons/warning.svg"
                }
                alt=""
                className="mt-1 size-4"
              />
              <p className="text-sm text-gray-700">{suggestion.tip}</p>
            </div>
          ))}
        </div>

        <p className="text-sm font-medium text-gray-900">
          Keep refining these areas to improve your chances of passing ATS screening.
        </p>
      </div>
    </div>
  );
};

export default ATS;
