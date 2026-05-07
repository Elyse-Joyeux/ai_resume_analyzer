import { Link } from "react-router";
import ScoreCircle from './ScoreCircle'

const ResumeCard = ({resume: { id, companyName, jobTitle, feedback, imagePath },}: {resume: Resume;}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
        <h2 className="text-2xl max-sm:text-xl text-black! font-bold wrap-break-words">
          {companyName}
        </h2>
        <h3 className="text-base wrap-break-words text-gray-500">{jobTitle}</h3>
      </div>
      <div className="shrink-0">
        <ScoreCircle score={feedback.overallScore}/>
        </div>
      </div>
      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img src={imagePath} alt="resume" className="w-full h-87.5 max-sm:h-50 object-cover object-top"/>
        </div>
      </div>
      
    </Link>
  );
};

export default ResumeCard;
