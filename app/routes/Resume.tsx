import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => [
  { title: "Resumind | Review " },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`, { replace: true });
    }
  }, [auth.isAuthenticated, id, isLoading, navigate]);

  useEffect(() => {
    if (isLoading || !auth.isAuthenticated || !id) return;

    let nextResumeUrl = "";
    let nextImageUrl = "";
    let isMounted = true;

    const loadResume = async () => {
      setIsLoadingResume(true);
      setLoadError("");

      try {
        const resume = await kv.get(`resume:${id}`);

        if (!resume) {
          setLoadError("We could not find that resume review.");
          return;
        }

        const data = JSON.parse(resume) as Resume;

        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) {
          setLoadError("The resume PDF could not be loaded.");
          return;
        }

        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        nextResumeUrl = URL.createObjectURL(pdfBlob);

        const imageBlob = await fs.read(data.imagePath);
        if (!imageBlob) {
          setLoadError("The resume preview image could not be loaded.");
          return;
        }
        nextImageUrl = URL.createObjectURL(imageBlob);

        if (!isMounted) return;
        setResumeUrl(nextResumeUrl);
        setImageUrl(nextImageUrl);
        setFeedback(data.feedback);
      } catch (error) {
        console.error(error);
        setLoadError("Something went wrong while opening this review.");
      } finally {
        if (isMounted) setIsLoadingResume(false);
      }
    };

    loadResume();

    return () => {
      isMounted = false;
      if (nextResumeUrl) URL.revokeObjectURL(nextResumeUrl);
      if (nextImageUrl) URL.revokeObjectURL(nextImageUrl);
    };
  }, [auth.isAuthenticated, fs, id, isLoading, kv]);

  return (
    <main className="page-shell">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img
            src="/assets/icons/back.svg"
            alt="logo"
            className="w-2.5 h-2.5"
          />
          <span className="text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse gap-8">
        <section className="feedback-section resume-panel bg-[url('/assets/images/bg-small.svg')] bg-cover h-[90vh] sticky top-8 items-center justify-center">
          {isLoadingResume && (
            <div className="flex flex-col items-center gap-4 text-center">
              <img src="/assets/images/resume-scan-2.gif" className="w-48" />
              <p className="text-muted">Loading your resume review...</p>
            </div>
          )}
          {!isLoadingResume && loadError && (
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-error font-semibold">{loadError}</p>
              <Link to="/upload" className="primary-button w-fit">
                Upload Resume
              </Link>
            </div>
          )}
          {!isLoadingResume && !loadError && imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : !loadError ? (
            <img src="/assets/images/resume-scan-2.gif" className="w-full" />
          ) : (
            <div className="resume-panel">
              <p className="text-muted">
                Start a new upload and we will create a fresh review for you.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
export default Resume;
