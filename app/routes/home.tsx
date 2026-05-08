import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import ResumeCard from "../components/ResumeCard";
import {usePuterStore} from '~/lib/puter'
import {useNavigate} from 'react-router'
import {useEffect, useState} from 'react'
import {Link} from 'react-router'



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)
  
  

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  useEffect(()=>{
    const loadResumes = async ()=>{
      setLoadingResumes(true)
      const resumes = (await kv.list('resume:*', true)) as KVItem[]

      const parsedResumes = resumes?.map((resume)=>(
        JSON.parse(resume.value) as Resume
      ))

      console.log("parsedResumes", parsedResumes)
      setResumes(parsedResumes || [])
      setLoadingResumes(false)
    }

    if (auth.isAuthenticated) loadResumes()
  }, [auth.isAuthenticated, kv])

  return (
    <main className="bg-[url('/assets/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-headinng py-16">
          <h1>Track Your Applications & Resume Ratings</h1>

          {!loadingResumes && resumes.length === 0 ? (
            <h2>No resumes found. Upload your first resumes to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback</h2>
          )} 
          
        </div> 
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/images/resume-scan.gif" className="w-50" />
          </div>
        )}        
        
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
            
          </div>
        )}
      </section>
    </main>
  );
}
