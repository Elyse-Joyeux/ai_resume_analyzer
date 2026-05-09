import { type FormEvent, useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2image";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [formErrors, setFormErrors] = useState<{
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    file?: string;
  }>({});

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    setFormErrors((current) => ({ ...current, file: undefined }));
  };

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/upload", { replace: true });
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Unknown error";

  const parseFeedback = (rawContent: string): Feedback | null => {
    if (!rawContent.trim()) return null;

    const normalized = rawContent
      .replace(/```json|```/g, "")
      .replace(/\r/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const match = normalized.match(/\{[\s\S]*\}/);
    const jsonString = match ? match[0] : normalized;

    try {
      return JSON.parse(jsonString) as Feedback;
    } catch (error) {
      console.warn("Fallback feedback parse failed", error, jsonString);
      return null;
    }
  };

  const buildFallbackFeedback = (rawContent: string): Feedback => ({
    overallScore: 0,
    ATS: {
      score: 0,
      tips: [
        {
          type: "improve",
          tip: "Unable to parse ATS feedback",
        },
      ],
    },
    toneAndStyle: {
      score: 0,
      tips: [
        {
          type: "improve",
          tip: "Unable to parse tone and style feedback",
          explanation: rawContent || "The AI response was empty or unavailable.",
        },
      ],
    },
    content: {
      score: 0,
      tips: [
        {
          type: "improve",
          tip: "Unable to parse content feedback",
          explanation: rawContent || "The AI response was empty or unavailable.",
        },
      ],
    },
    structure: {
      score: 0,
      tips: [
        {
          type: "improve",
          tip: "Unable to parse structure feedback",
          explanation: rawContent || "The AI response was empty or unavailable.",
        },
      ],
    },
    skills: {
      score: 0,
      tips: [
        {
          type: "improve",
          tip: "Unable to parse skills feedback",
          explanation: rawContent || "The AI response was empty or unavailable.",
        },
      ],
    },
  });

  const extractFeedbackText = (feedback: AIResponse | undefined): string => {
    const content = feedback?.message?.content;

    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
      return content
        .map((item) => {
          if (typeof item === "string") return item;
          if (typeof item?.text === "string") return item.text;
          if (typeof item?.content === "string") return item.content;
          return "";
        })
        .join("");
    }

    return "";
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/upload", { replace: true });
      return;
    }

    setIsProcessing(true);
    setStatusText("Starting resume analysis...");

    try {
      setStatusText("Uploading the file...");
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) {
        setStatusText("Error: Failed to upload file.");
        return;
      }

      setStatusText("Converting to image...");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) {
        setStatusText(
          imageFile.error || "Error: Failed to convert PDF to image.",
        );
        return;
      }

      setStatusText("Uploading the preview image...");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) {
        setStatusText("Error: Failed to upload image.");
        return;
      }

      setStatusText("Preparing analysis record...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      } as any;
      const savedDraft = await kv.set(`resume:${uuid}`, JSON.stringify(data));
      if (!savedDraft) {
        setStatusText("Error: Failed to save resume details.");
        return;
      }

      setStatusText("Analyzing resume with AI...");
      let rawContent = "";
      try {
        const feedback = await ai.feedback(
          uploadedFile.path,
          prepareInstructions({ jobTitle, jobDescription }),
        );
        rawContent = extractFeedbackText(feedback);
      } catch (error) {
        console.error("AI feedback failed", error);
        rawContent = `AI analysis failed: ${getErrorMessage(error)}`;
      }

      const parsedFeedback = parseFeedback(rawContent);
      data.feedback = parsedFeedback ?? buildFallbackFeedback(rawContent);
      const savedResult = await kv.set(`resume:${uuid}`, JSON.stringify(data));
      if (!savedResult) {
        setStatusText("Error: Failed to save analysis results.");
        return;
      }

      setStatusText(
        parsedFeedback
          ? "Analysis complete. Redirecting to results..."
          : "Saved your resume. Redirecting with a fallback review...",
      );
      navigate(`/resume/${uuid}`, { replace: true });
    } catch (err) {
      console.error(err);
      setStatusText("Error: Something went wrong during analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: typeof formErrors = {};

    if (!companyName.trim()) {
      errors.companyName = "Please enter the company name.";
    }
    if (!jobTitle.trim()) {
      errors.jobTitle = "Please enter the job title.";
    }
    if (!jobDescription.trim()) {
      errors.jobDescription = "Please describe the job.";
    }
    if (!file) {
      errors.file = "Please upload a PDF resume.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatusText("Please fill all fields before analyzing.");
      return;
    }

    if (!file) {
      setStatusText("Please upload a PDF resume.");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="hero-panel">
        <div className="hero-grid">
          <div className="space-y-8">
            <div className="page-heading max-w-3xl text-left py-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Smart feedback for your dream job
              </h1>
              <h2 className="text-lg text-muted mt-4">
                Upload a resume, share the role details, and get tailored ATS,
                structure, and wording guidance.
              </h2>
            </div>

            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="form-panel flex flex-col gap-6"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  className="input-field"
                  id="company-name"
                  value={companyName}
                  onChange={(event) => {
                    setCompanyName(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      companyName: undefined,
                    }));
                  }}
                  placeholder="Example: Tech Scaleup Inc."
                  type="text"
                />
                {formErrors.companyName && (
                  <p className="text-muted mt-2">{formErrors.companyName}</p>
                )}
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  className="input-field"
                  id="job-title"
                  value={jobTitle}
                  onChange={(event) => {
                    setJobTitle(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      jobTitle: undefined,
                    }));
                  }}
                  placeholder="Example: Product Marketing Manager"
                  type="text"
                />
                {formErrors.jobTitle && (
                  <p className="text-muted mt-2">{formErrors.jobTitle}</p>
                )}
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  className="text-area"
                  id="job-description"
                  value={jobDescription}
                  onChange={(event) => {
                    setJobDescription(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      jobDescription: undefined,
                    }));
                  }}
                  rows={5}
                  placeholder="Paste the role description or highlight key responsibilities."
                />
                {formErrors.jobDescription && (
                  <p className="text-muted mt-2">{formErrors.jobDescription}</p>
                )}
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
                {formErrors.file && (
                  <p className="text-muted mt-2">{formErrors.file}</p>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="primary-button"
                  type="submit"
                  disabled={isProcessing || isLoading}
                  aria-busy={isProcessing}
                >
                  {isLoading
                    ? "Checking account..."
                    : isProcessing
                    ? "Analyzing resume..."
                    : "Analyze Resume"}
                </button>
                <p className="text-muted">
                  Select a PDF resume and get feedback in seconds.
                </p>
              </div>

              {statusText && <p className="text-muted mt-2">{statusText}</p>}
            </form>
          </div>

          <div className="hero-preview">
            <img src="/assets/images/resume-scan-2.gif" alt="Resume preview" />
            <div className="hero-card">
              <h3>What you’ll get</h3>
              <ul className="hero-features">
                <li>ATS keyword matching and score insights</li>
                <li>Resume format and content clarity tips</li>
                <li>Job-specific alignment for stronger applications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Upload;
