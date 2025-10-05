1. about project (ai resume analyzer)
- serverless
- auth, cloud, ai functionality in this project directly from frontend
- AI-powered Resume Analyzer with React, React Router v7, tailwind 4, typescript, zustard and Puter.js! Create job listings, upload candidate resumes, and use AI to automatically evaluate and match resumes to job requirements.
- real code , scalable , useful for real world (real product)


2. npm create vite@latest . = current folder me 

3. puter.js uses User Pays Model // https://docs.puter.com/user-pays-model/

4. make 2 terminal , one for app running other for installing dependencies(-D)

5. install few dependencies and dev dependencies
- npm install -D tw-animate-css
- npm i clsx tailwind-merge pdfjs-dist zustand

6. set up meta tags in routes -> home.tsx

7. hero sec, navbar,resume card and  app -> components

8. constant -> dummy data, types -> for all types we using

9. resume card component 
    - destructure the resume prop 
    - ScoreCard.tsx for scorecard 
-------------------------------------
## next phase : auth

1. Authentication & Introduction to Puter API  
 - why we used zustand (usePuter function ) (38:00 - 41:41)
 - 

2. start implementing authentication
- routes -> auth.tsx
- add this new route(path) to routes.ts (routes config file)
- make a form in auth.tsx
- make some states to track the state of the laoding process