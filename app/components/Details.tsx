import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";
import { cn } from "~/lib/utils";

type Tip = {
  type: "good" | "improve";
  tip: string;
  explanation: string;
};

interface DetailsProps {
  feedback: Feedback;
}

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const isStrong = score > 70;
  const isGoodStart = score > 39;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1",
        isStrong
          ? "bg-badge-green text-green-600"
          : isGoodStart
            ? "bg-badge-yellow text-yellow-600"
            : "bg-badge-red text-red-600",
      )}
    >
      <img
        src={
          isStrong
            ? "/assets/icons/check.svg"
            : "/assets/icons/warning.svg"
        }
        alt=""
        className="size-4"
      />
      <p className="text-sm font-semibold">{score}/100</p>
    </div>
  );
};

interface CategoryHeaderProps {
  title: string;
  categoryScore: number;
}

const CategoryHeader = ({ title, categoryScore }: CategoryHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

interface CategoryContentProps {
  tips: Tip[];
}

const CategoryContent = ({ tips }: CategoryContentProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {tips.map((tip) => (
          <div key={tip.tip} className="flex items-start gap-3">
            <img
              src={
                tip.type === "good"
                  ? "/assets/icons/check.svg"
                  : "/assets/icons/warning.svg"
              }
              alt=""
              className="mt-1 size-4"
            />
            <p className="text-sm font-medium text-gray-800">{tip.tip}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {tips.map((tip) => (
          <div
            key={tip.explanation}
            className={cn(
              "rounded-xl border p-4",
              tip.type === "good"
                ? "border-green-200 bg-badge-green"
                : "border-yellow-200 bg-badge-yellow",
            )}
          >
            <p
              className={cn(
                "text-sm font-semibold",
                tip.type === "good" ? "text-green-700" : "text-yellow-700",
              )}
            >
              {tip.tip}
            </p>
            <p className="mt-2 text-sm text-gray-700">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: DetailsProps) => {
  const categories = [
    {
      id: "tone-and-style",
      title: "Tone & Style",
      score: feedback.toneAndStyle.score,
      tips: feedback.toneAndStyle.tips,
    },
    {
      id: "content",
      title: "Content",
      score: feedback.content.score,
      tips: feedback.content.tips,
    },
    {
      id: "structure",
      title: "Structure",
      score: feedback.structure.score,
      tips: feedback.structure.tips,
    },
    {
      id: "skills",
      title: "Skills",
      score: feedback.skills.score,
      tips: feedback.skills.tips,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <Accordion defaultOpen="tone-and-style" allowMultiple>
        {categories.map((category) => (
          <AccordionItem key={category.id} id={category.id}>
            <AccordionHeader itemId={category.id}>
              <CategoryHeader
                title={category.title}
                categoryScore={category.score}
              />
            </AccordionHeader>
            <AccordionContent itemId={category.id}>
              <CategoryContent tips={category.tips} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;
