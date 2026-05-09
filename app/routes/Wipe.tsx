import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { formatSize } from "~/lib/utils";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Wipe Data" },
  { name: "description", content: "Clear stored resume reviews and files." },
];

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [statusText, setStatusText] = useState("");

  const loadFiles = async () => {
    setIsLoadingFiles(true);
    setStatusText("");

    try {
      const nextFiles = (await fs.readDir("./")) as FSItem[] | undefined;
      setFiles(nextFiles || []);
    } catch (error) {
      console.error(error);
      setStatusText("Could not load stored app files.");
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe", { replace: true });
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isLoading || !auth.isAuthenticated) return;
    loadFiles();
  }, [auth.isAuthenticated, isLoading]);

  const handleDelete = async () => {
    if (!confirmWipe) {
      setConfirmWipe(true);
      setStatusText("Click Wipe App Data again to confirm.");
      return;
    }

    setIsDeleting(true);
    setStatusText("Wiping stored resumes and review data...");

    try {
      await Promise.all(files.map((file) => fs.delete(file.path)));
      await kv.flush();
      setFiles([]);
      setConfirmWipe(false);
      setStatusText("All stored resume data has been cleared.");
    } catch (error) {
      console.error(error);
      setStatusText("Something went wrong while wiping app data.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="danger-zone">
        <div className="hero-panel">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="status-chip w-fit">Account Settings</div>
              <h1 className="text-4xl font-bold tracking-tight">
                Wipe Resumind data
              </h1>
              <p className="text-muted max-w-3xl leading-7">
                Remove uploaded resume files, generated preview images, and
                saved review records from your Puter storage. This action is
                useful when you want a clean workspace.
              </p>
            </div>

            {isLoading || isLoadingFiles ? (
              <div className="review-card p-6">
                <p className="text-muted">Loading stored files...</p>
              </div>
            ) : error ? (
              <div className="review-card p-6">
                <p className="text-error font-semibold">{error}</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <div className="review-card p-6">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-2xl font-bold">Stored Files</h2>
                      <p className="text-muted">
                        Signed in as {auth.user?.username || "your account"}
                      </p>
                    </div>
                    <span className="status-chip">{files.length} files</span>
                  </div>

                  {files.length > 0 ? (
                    <div className="wipe-file-list">
                      {files.map((file) => (
                        <div key={file.id} className="wipe-file-row">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {file.name}
                            </p>
                            <p className="text-muted text-sm truncate">
                              {file.path}
                            </p>
                          </div>
                          <p className="text-muted text-sm shrink-0">
                            {file.size ? formatSize(file.size) : "Folder"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                      <p className="font-semibold">No stored files found.</p>
                      <p className="text-muted mt-2">
                        Your workspace is already clean.
                      </p>
                    </div>
                  )}
                </div>

                <aside className="review-card p-6 h-fit">
                  <h2 className="text-2xl font-bold">Danger Zone</h2>
                  <p className="text-muted mt-3 leading-7">
                    Wiping data cannot be undone. Your uploaded PDFs, generated
                    resume images, and saved feedback entries will be removed.
                  </p>

                  {statusText && (
                    <p className="mt-5 text-sm font-semibold text-muted">
                      {statusText}
                    </p>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      className="danger-button"
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting || files.length === 0}
                    >
                      {isDeleting
                        ? "Wiping..."
                        : confirmWipe
                        ? "Confirm Wipe"
                        : "Wipe App Data"}
                    </button>
                    {confirmWipe && (
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => {
                          setConfirmWipe(false);
                          setStatusText("");
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </aside>
              </div>
            )}

            <Link to="/" className="secondary-button w-fit">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WipeApp;
