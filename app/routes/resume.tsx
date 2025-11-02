import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => (
    [
        { title: "Resumind | Review" },
        { name: "description", content: "Detailed Review of your Resume" }
    ]
)


const Resume = () => {

    const {auth, kv, isLoading,fs} = usePuterStore();
    const { id } = useParams();

    const [imageUrl, setImageUrl ] = useState('');
    const [resumeUrl, setResumeUrl ] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);  // | is a TypeScript union operator
    const navigate = useNavigate();

    // navigate if not authenticated and not loading
    useEffect(()=>{
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    },[isLoading]);

    // recall this function as soon we get the access of id of the resume we wanna fetch
    useEffect(() => {

        const loadResume = async () => {
        
            const resume = await kv.get(`resume:${id}`); // (*1)
            console.log(resume)
            if (!resume) return;

            console.log("1");
            const data = JSON.parse(resume);


            // you can read files (like pdf, img) => by using blob
            // files from puter cloud storage returned as blob 
            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;
            
            // so we need to convert pdf blob => pdf file & convert image blog => image file
            const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
            const resumeUrl = URL.createObjectURL(pdfBlob);   
            setResumeUrl(resumeUrl);


            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);


            console.log(imageUrl, resumeUrl, data.feedback);
        }

        loadResume();


    }, [id])

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="back button" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to home Page</span>
                </Link>
            </nav>


            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {
                        imageUrl && resumeUrl && (
                            <div className="animate-in fade-in duration-1000 gradient-border h-[90%] w-fit max-sm:h-fit max-sm:m-0 ">
                                <a href={resumeUrl} target="_blank">
                                    <img 
                                        src={imageUrl}
                                        title="resume"
                                        className="w-full h-full object-contain rounded-2xl"
                                    />
                                </a>
                            </div>
                        )
                    }
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl font-bold !text-black">Resume Review</h2>
                    {
                        feedback? (
                            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                               <Summary feedback={feedback}/>
                               <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                               <Details feedback={feedback}/>
                            </div>
                        ):(
                            <img src="images/resume-scan-2.gif" className="w-full" />
                        )
                    }
                </section>
            </div>

        </main>
    )
}

export default Resume



// (*1)
// getting the value from puter Storage from the resume key value pair that we set in upload.tsx (line 74)