import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, isLoading, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/", { replace: true });
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isLoading || !auth.isAuthenticated) return;

    const loadResumes = async () => {
      setLoadingResumes(true);

      try {
        const resumes = (await kv.list("resume:*", true)) as KVItem[];

        const parsedResumes = resumes?.map(
          (resume) => JSON.parse(resume.value) as Resume,
        );

        setResumes(parsedResumes || []);
      } catch (error) {
        console.error(error);
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [auth.isAuthenticated, isLoading, kv]);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="hero-panel">
        <div className="hero-grid">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-4 py-2 text-sm font-semibold text-indigo-500 dark:bg-indigo-300/15 dark:text-indigo-500">
              Resume AI, smarter decisions
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              Track your applications and get intelligent resume feedback.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-500">
              Upload a resume, compare your work, and receive career-focused
              improvements from our AI assistant.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="primary-button w-fit text-lg font-semibold"
              >
                Upload Resume
              </Link>
              <Link
                to="/wipe"
                className="secondary-button w-fit text-lg font-semibold"
              >
                Wipe Data
              </Link>
            </div>
          </div>
          <div className="hero-preview">
            <img
              src="/assets/images/resume_03.png"
              alt="Resume overview"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      <section className="main-section">
        <div className="page-heading py-16">
          <h2 className="text-3xl font-bold">Track Your Work</h2>
          {!loadingResumes && resumes?.length === 0 ? (
            <h3 className="text-2xl font-semibold mt-1">
              No resumes found. Upload your first resume to get feedback.
            </h3>
          ) : (
            <h3 className="text-2xl font-semibold ">
              Review your submissions and check AI-powered feedback.
            </h3>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/images/resume-scan-2.gif" className="w-50" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
