import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import Summary from '../components/Summaru'
import ATS from '../components/ATS'
import Details from '../components/Details'


export const meta: () => any = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, isLoading, fs, kv } = usePuterStore();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumePath, setResumePath] = useState<string | null>(null);
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [auth.isAuthenticated, id, isLoading, navigate]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);
      setFeedback(data.feedback);
      setResumePath(data.resumePath);

      const imageBlob = await fs.read(data.imagePath);
      if (imageBlob) {
        const nextImageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(nextImageUrl);
      }
    };

    loadResume();
  }, [fs, id, kv]);

  const openResume = async () => {
    if (!resumePath) return;

    const resumeTab = window.open("", "_blank");
    resumeTab?.document.write("<p>Opening resume...</p>");

    try {
      const resumeBlob = await fs.read(resumePath);
      if (!resumeBlob) {
        resumeTab?.close();
        return;
      }

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);

      if (resumeTab) {
        resumeTab.document.open();
        resumeTab.document.write(`
          <!doctype html>
          <html>
            <head>
              <title>Resume</title>
              <style>
                html, body {
                  margin: 0;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                }

                iframe {
                  width: 100%;
                  height: 100%;
                  border: 0;
                }
              </style>
            </head>
            <body>
              <iframe src="${resumeUrl}" title="Resume"></iframe>
            </body>
          </html>
        `);
        resumeTab.document.close();
      } else {
        window.open(resumeUrl, "_blank");
      }
    } catch (err) {
      resumeTab?.close();
      console.error("Failed to open resume PDF", err);
    }
  };
  return (
    <main className="pt-0!">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img
            src="/assets/icons/back.svg"
            alt="logo"
            className="w-2.5 h-2.5"
          />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/assets/images/bg-small.svg')] bg-cover h-screen sticky top-0 items-center justify-center">
          {imageUrl ? (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 max-h-[90%] max-w-xl h-fit w-fit">
              <button
                type="button"
                onClick={openResume}
                className="block cursor-pointer rounded-2xl transition-opacity hover:opacity-85"
              >
                <img
                  src={imageUrl}
                  className="w-full cursor-pointer object-contain rounded-2xl"
                  alt="resume"
                />
              </button>
            </div>
          ) : (
            <img
              src="/assets/images/resume-scan.gif"
              alt="Loading resume"
              className="w-full max-w-48"
            />
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl text-black! font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback}/>
              <ATS score={feedback.ATS.score || 0 } suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback}/>

            </div>
          ) : (
            <img
              src="/assets/images/resume-scan.gif"
              alt="Loading feedback"
              className="w-full max-w-48"
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
