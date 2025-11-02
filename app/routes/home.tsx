import Navbar from "~/components/Navbar";  // ~ path is configed on tsconfig.json 
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyser" },
    { name: "description", content: "Get Instant Feedback to your Resumes" },
  ];
}

export default function Home() {

  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // redirect to auth page if user comes to directly home page (without auth)
  useEffect(() => {
    // console.log(auth.isAuthenticated);
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated])


  // fetch all the resumes
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      console.log("parsedResumes", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes();
  }, [])

  return <main className="bg-[url(/images/bg-main.svg)] bg-cover">
    <Navbar />

    {/* {window.puter.ai} */}

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>

        {!loadingResumes && resumes?.length === 0 ? (
          <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ) : (
          <h2>Review your submissions and check AI-powered feedback.</h2>

        )}

      </div>


      {loadingResumes && (
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" />
        </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
        <section className="resumes-section">
          {
            resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))
          }
        </section>
      )}


      {!loadingResumes && resumes?.length === 0 && (
        <div className="flex flex-col justify-center items-center mt-10 gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
            Uplaod Resume
          </Link>
        </div>
      )}



    </section>






  </main>;
}
