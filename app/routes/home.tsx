import Navbar from "~/components/Navbar";  // ~ path is configed on tsconfig.json 
import type { Route } from "./+types/home";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyser" },
    { name: "description", content: "Get Instant Feedback to your Resumes" },
  ];
}

export default function Home() {

  const { auth } = usePuterStore();
  const navigate = useNavigate();


  // redirect to auth page if user comes to directly home page (without auth)
  useEffect(() => {
    // console.log(auth.isAuthenticated);
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated])


  return <main className="bg-[url(/images/bg-main.svg)] bg-cover">
    <Navbar />

    {/* {window.puter.ai} */}

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
      {resumes.length > 0 && (
        <section className="resumes-section">
          {
            resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))
          }
        </section>
      )}



    </section>






  </main>;
}
