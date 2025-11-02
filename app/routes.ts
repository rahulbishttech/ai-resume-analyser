import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/auth","routes/auth.tsx"),
    route("/upload","routes/upload.tsx"),  // (*1)
    route("/resume/:id", "routes/resume.tsx")

] satisfies RouteConfig;




// (*1)
// The colon (:) before id means that id is 
// a dynamic route parameter (also called a URL parameter).
// It tells the router that this part of the URL is variable, not a fixed path.