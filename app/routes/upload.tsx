import Navbar from "~/components/Navbar";
import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage, type PdfConversionResult } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/constants";
import { Navigate, useNavigate } from "react-router";
// import navigate




const Upload = () => {

    const { auth, isLoading, fs, ai, kv } = usePuterStore();  // fs = file storage, kv = key value storage functions

    // variables
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);  // useState<Type>(initialValue)

    const navigate = useNavigate();

    // functions

    const handleAnalyze = async ({ companyName, jobTitle, jobDesc, file }: { companyName: string, jobTitle: string, jobDesc: string, file: File }) => {
        setIsProcessing(true);
        setStatusText("Uploading the file...");
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText("Error: Failed to upload File"); // Returns the result of the function call here

        setStatusText("Converting to image...");

        const imageFile: PdfConversionResult = await convertPdfToImage(file);
        console.log(imageFile)

        if (!imageFile.file) return setStatusText("Error: failed to convert PDF to Image");

        setStatusText("uploading the image...");
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText("Error: failed to upload Image");

        setStatusText("Preparing data...");

        // unique id for ai anlaysis
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath : uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDesc,
            feedback : ''
        }

        // puter's key value storage
        await kv.set(`resume : ${uuid}`, JSON.stringify(data));
        setStatusText('Analyzing...');

        // feedback from puter's ai
        const feedback = await ai.feedback(uploadedFile.path, prepareInstructions({jobTitle, jobDescription:jobDesc}) ); // (*2)

        if(!feedback) return setStatusText("Error: Failed to load Resume");

        // if we have passed the above step,that mean we have feedback, so we can extract the feedback
        const feedbackText = typeof feedback.message.content === "string"
             ? feedback.message.content : feedback.message.content[0].text;
            
        // convert to js objects and assign to data -> feedback
        data.feedback = JSON.parse(feedbackText);

        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analysis complete, redirecting...");

        // redirect the user 
        console.log(data);
        navigate(`/resume/${uuid}`);

    }

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        console.log("form submitted");
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;

        const formData = new FormData(form);
        const companyName = formData.get("company-name") as string;  // (*1)
        const jobTitle = formData.get("job-title") as string;
        const jobDesc = formData.get("job-description") as string;
        // console.log({companyName, jobTitle, jobDesc, file});

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDesc, file });

    }

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    //  return
    return (
        <main className="bg-[url(/images/bg-main.svg)] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">

                    <h1>Smart Feedback for your dream job.</h1>

                    {isProcessing ?
                        (
                            <>
                                <h2>{statusText}</h2>
                                <img src="/images/resume-scan.gif" alt="resume scan image" />
                            </>
                        ) :
                        (
                            <h2>Drop your Resume for ATS Score and improvement tips</h2>
                        )
                    }

                    {!isProcessing &&
                        (
                            <form id="upload-form" onSubmit={handleFormSubmit} className="flex flex-col gap-4 mt-8">
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>

                                <button type="submit" className="primary-button">Analyze Resume</button>
                            </form>
                        )
                    }



                </div>


            </section>






        </main>
    )
}

export default Upload;






// (*1)
// By default, formData.get() can return a string, a File, or null.
// Using as string helps TypeScript know you expect a string,
// so you don’t get type errors when using these values as text.


// (*2)
// Useful when the property name and variable name are different.
// const feeback = ai.feedback(uploadedFile.path, prepareInstructions({jobTitle, jobDescription:jobDesc}) ); 

// object key value 
// {
//   jobTitle: jobTitle,         // value from jobTitle variable
//   jobDescription: jobDesc     // value from jobDesc variable
// }    

