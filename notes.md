### about project (ai resume analyzer)
- serverless
- auth, cloud, ai functionality in this project directly from frontend
- AI-powered Resume Analyzer with React, React Router v7, tailwind 4, typescript, zustard and Puter.js! Create job listings, upload candidate resumes, and use AI to automatically evaluate and match resumes to job requirements.
- real code , scalable , useful for real world (real product)

-----------------------------------------------------------------------------------------------------------------------------------------------

1. Project Setup
- npm create vite@latest . = current folder me 
- puter.js uses User Pays Model // https://docs.puter.com/user-pays-model/
- make 2 terminal , one for app running (dev), other for installing dependencies (terminal)
- install few dependencies and dev dependencies
    - npm install -D tw-animate-css
    - npm i clsx tailwind-merge pdfjs-dist zustand

- download assets from link in desc and copy & paste the app.css
 
-----------------------------------------------------------------------------------------------------------------------------------------------
2. Create Homepage, Navbar & Resume Card Component
- set up meta tags in routes :  routes ->  home.tsx
- create Home component in home.tsx
- constants -> dummy data, types -> for all types we using
- Create Navbar, ResumeCar, ScoreCircle components
- resume card component 
    - destructure the resume prop 
    - ScoreCard.tsx for scorecard 

-----------------------------------------------------------------------------------------------------------------------------------------------
3. Authentication  
-  paste puter cdn link to implement puter, in root.tsx, just below body opening tag
- why we used zustand (usePuter function ) (38:00 - 41:41)
- usePuter is just a wrapper of puter.js function
-  start implementing authentication
    - routes -> auth.tsx
    - add this new route(path) to routes.ts (routes config file)
    - make a form in auth.tsx
    - make some states to track the state of the loading process
    - redirecting logic in auth.tsx and home.tsx

-----------------------------------------------------------------------------------------------------------------------------------------------
4. next phase : Upload Form & File Uploader Component  

- upload.tsx for upload form page
- isko you say escape into JavaScript or you can it dynamic block 
    (keep it's structure same for all upcoming projects below)

    {isProcessing? 
        (<h2>hello</h2>): 
        (<p>bye</p>)
    } 

- normal structure of component function
varibles => useEffect(hooks) => functions => return statement

- (e:FormEvent<HTMLFormElement> )  // check chatgpt project (ai_resume_doubts)
- create Form and FileUploader.tsx component 
- use npm i react-dropzone (for upload button functionality)
- In, interface FileUploaderProps in FileUploader.tsx
// syntax (typescript)
propName?: (parameterName: parameterType) => returnType;

// other variations example:
onClick?: () => void;                 // no parameters, returns nothing
onChange?: (value: string) => void;   // one parameter, returns nothing
onSave?: (data: object) => boolean;   // one parameter, returns boolean
onFileSelect?: (file: File | null) => void; // optional prop that is a function taking a File (or null) and returning nothing


- When you select or drop a file using the file uploader, the browser creates a File object for that file. This object has properties like:
    name: The name of the file (e.g., resume.pdf)
    size: The size of the file in bytes (e.g., 123456)

-----------------------------------------------------------------------------------------------------------------------------------------------
5. next phase :  PDF-Image Conversion & AI Feedback (upload form to puter storage and then utilise puter ai services to generate ai review)
- in upload.tsx -> make handleAnalyse to upload the file in puter storage 
  also create convertPdfToImage(File) function & copy it's code new file lib -> pdf2img.ts  from the desc link
- generate a unique id for ai analysis (uuid)
- AI feedback integration.

-----------------------------------------------------------------------------------------------------------------------------------------------
6. Resume feedback Page
- make a new route with a name as resume.tsx 
    - configure the route in routes.ts
- extract the id (dynamic parameter) in resume.tsx using userParams()
    - redirect user with it's uuid like this (navigate())
    - you may have to reload the server for new route to be recognized.

- meta data for resume route/url.
- make the feedback page layout 
- redirect user if he is not loggedin 

---------------------------------------------------------------------
-------------------------------------------------
7. make the additional components for showing details , these 3 components (Summary.tsx, ATS.tsx,Details.tsx ) and show them in resume.tsx