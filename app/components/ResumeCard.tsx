import { Link } from "react-router"
import ScoreCircle from "./ScoreCircle"

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black font-bold break-words">{companyName}</h2>
                    <p className="text-lg break-words text-gray-500">{jobTitle}</p>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    <img src={imagePath} alt="resume" className="w-full h-[350px] max-sm:h-[200px] object-cover object-top " />
                </div>
            </div>

        </Link>
    )
}


export default ResumeCard



// 1. Destructures the resume prop:
// {resume:{id,companyName,jobTitle,feedback}}
// This means the function expects a prop called resume, and it immediately extracts the properties id, companyName, jobTitle, and feedback from it.

// 2. Type annotation:
// :{resume:Resume}
// This tells TypeScript that the prop passed to the component must be an object with a property resume of type Resume.