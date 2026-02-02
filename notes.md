### about project (ai resume analyzer)
- serverless
- auth, cloud, ai functionality in this project directly from frontend
- AI-powered Resume Analyzer with React, React Router v7, tailwind 4, typescript, zustard and Puter.js! Create job listings, upload candidate resumes, and use AI to automatically evaluate and match resumes to job requirements.
- real code , scalable , useful for real world (real product)

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------

1. Project Setup
- npm create vite@latest . = current folder me 
- puter.js uses User Pays Model // https://docs.puter.com/user-pays-model/
- make 2 terminal , one for app running (app), other for installing dependencies (terminal)
- install few dependencies and dev dependencies
    - npm install -D tw-animate-css (-D flag = install this package as a dev dependency. )
    - npm i clsx tailwind-merge pdfjs-dist zustand
- download assets (icons & images) from link in the desc and copy & paste the css in app.css
 
---------------------------------------------------------------------------------
---------------------------------------------------------------------------------
2. Create Homepage, Navbar & Resume Card Component
- setup meta tags for home page :  routes ->  home.tsx -> meta function
- create Home component in home.tsx
- create Navbar component in components folder
- we need resumes mock data for better visualization
    - So, app -> create constants folder -> resumes ka dummy data
    - create types folder in root -> for all types we're using
- write logic to show resumes in home page
    - if resumes.length > 0 then show all the resumes in ResumeCard component
    - pass resume info to ResumeCard component as 'resume' prop 
- in, ResumeCard component 
    - destructure the resume prop as {id,jobTitle,companyName} like this
    - make ScoreCircle.tsx component for ScoreCircle & pass score prop in ScoreCircle component

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------
3. Authentication  
- This below script is our backend which is responsible for cloud storage, auth, data storage, 
  ai integration in one single script of puter
    - paste this script in root.tsx, just below opening body tag (<script src="https://js.puter.com/v2/"></script>)
- create folder lib inside app -> puter.ts file
    - It's a helper layer that makes it easy for your React app to use Puter's cloud services (login, file storage, and AI tools).
    - It is basically a bridge between your app and Puter.js (a cloud operating system platform)
    - to see in detail, check comments inside the file
- types folder -> create puter.d.ts file (for only puter types)
- why we used zustand - state management tool (for usePuterStore function ) (38:00 - 41:41)
- usePuterStore is just a wrapper of puter.js functions
- implementing authentication:
    - in routes.ts (routes config file) -> add new route auth.tsx
    - create a auth.tsx file inside routes folder
    - redirection logic in auth.tsx & home.tsx files
    - write init function in root.tsx (init function -> waits for Puter.js to load and then checks the user login status - if yes, sets isAuthenticated -> true, if no, sets isAuthenticated -> false) 
        - used to check is user is authenticated or not like this if(!auth.isAuthenticated){}

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------
4. Upload Form & File Uploader Component  

- routes folder -> create upload.tsx file for upload form page & add this route in routes config file (routes.tsx)
- to check is form processing and showing statusText dynamically, use useState
    - below block ko you can say escape into JavaScript or you can call it dynamic block 
      (keep it's structure same for all upcoming projects)
        {isProcessing? 
            (<h2>yes</h2>): 
            (<p>no</p>)
        } 
        
- (e:FormEvent<HTMLFormElement> )  -> FormEvent<HTMLFormElement> tells TypeScript that e is a form submission event from a form element, giving you access to properties like e.preventDefault() and e.currentTarget (the form itself) with proper type safety.
- create FileUploader.tsx component (for upload functionality)
- use npm i react-dropzone for upload button functionality  (see Usage section of react dropzone for initial setup)
- pass onFileSelect prop to FileUploader component in upload.tsx file 
- create handleFileSelect function in Upload.tsx file that does -> setFile(file)
- destructure that onFileSelect prop in the FileUploader component (assign FileUploaderProps interface)
    - In FileUploaderProps interface in FileUploader.tsx
    // syntax (typescript)
    propName?: (parameterName: parameterType) => returnType;

    // other variations example:
    onClick?: () => void;                 // no parameters, returns nothing
    onChange?: (value: string) => void;   // one parameter, returns nothing
    onSave?: (data: object) => boolean;   // one parameter, returns boolean
    onFileSelect?: (file: File | null) => void; // optional prop that is a function taking a File (or null) and returning nothing

- Here's the flow (v.imp): 
    1. User drops/selects a file → onDrop function runs
    2. onDrop gets the file and calls:
        - onFileSelect?.(file);  // sends file to parent
    3. Parent component receives it
        - function handleFileSelect(file: File | null){
                setFile(file);  // updates file state
        }
    4. File state update hogi matlab → React re-renders the component
    5. The div appears showing the file name and size (since file is now not null)

- get the acceptedFiles function from the useDropzone hook & set the accept files format, multiple files or not , maxfile size in the useDropzone hook
- create formatSize function in utils.ts (to format size in "mb" human readable format)
- When you select or drop a file using the file uploader, the browser creates a File object for that file. This object has properties like:
    name: The name of the file (e.g., resume.pdf)
    size: The size of the file in bytes (e.g., 123456)
- Issue : when you click on uploaded resume, it opens it and opens the dialog box again to uplaod another file  -> onClick={(e) => e.stopPropagation()} stops that 
- Issue : when the user clicks on cross icon, the file is not removing => The problem is that onFileSelect?.(null) only calls the parent callback and clears the parent's state but the file which is showing in the frontend relies on const file = acceptedFiles[0] || null; inside on drop function, which still contains the previous file.
To fix this, you need to clear the file at the component level. Add local state to track the file independently.
like this: const [selectedFile, setSelectedFile] = useState<File | null>(null);
and now clear the file in the component lvl like this: setSelectedFile(null);

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------
5. PDF-Image Conversion & AI Feedback Phase 
- in this phase, we gonna upload the form to puter storage and then utilise puter ai services to generate ai reviews
- in upload.tsx, create handleFormSubmit func to handle the form submit
    - e.preventDefault to stop the page from reloading
    - get the form data & send it to handleAnalyse func
- in upload.tsx -> make async handleAnalyse func to upload the file in puter storage 
- update the setIsProcessing & statusText("uploading the file")
- upload the resume file (useState waali) using fs.upload([file])
- you have import this above fs from usePuterStore like this, const { auth, isLoading, fs, ai, kv } = usePuterStore();
- Now make convertPdfToImage func in lib -> pdf2img.ts file to convert the pdf into image
- now upload that convert image in puter cloud using fs.upload([imageFile.file])
- now, generate unique id using generateUUID func in lib -> utils.ts file
- now, create a data object with all the form data & upload to puter's key value storage using kv.set()
- now, get the feedback from puter's ai using ai.feedback(resume path, prompt)
- now, extract the feedback & assign to data.feedback after parsing to js obj
- finally, update the data obj and again do..  await kv.set()
- and then redirect the user in the resume page of that particular UUID

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------
6. Resume feedback Page
- make a new route with a name as resume.tsx 
    - configure the route in routes.ts
- extract the id (dynamic parameter) in resume.tsx using userParams()
    - redirect user with it's uuid like this (navigate())
    - you may have to reload the server for new route to be recognized.

- meta data for resume route/url.
- make the feedback page layout 
- redirect user if he is not loggedin 
- make the additional components for showing details , these 3 components (Summary.tsx, ATS.tsx,Details.tsx ) and show them in resume.tsx

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------
7. Resume Feedback Components
- make summary component 
    - ScoreGauge component from description 
    - create custom Category component in the same file 
    - create ScoreBadge component and imported in Summary.tsx file

- make ATS, Accordian, Details component

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------
8. Fetch Real Data on the Homepage 
- create loadResume function using useEffect in ResumeCard.tsx
- you can also, only upload the resume, without putting the title, description etc.. so for that 
  add the conditions so that application doesn't break
  (to conditionally show the companyName, jobTitle , resumeUrl in Resume Card) - if they doesn't exist show heading "Resume"

- fetch all the resumes on the home page 
- make some conditional checks like
    1. if No resumes found. Upload your first resume to get feedback.
    2. if loadingResumes is true, show a loading image
    3. if resume.length === 0 , show a button to upload the resume (for first time users)

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------
9. Wipe App Data
- 