import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

// react router meta function (see root.tsx)
export const meta = () => (
    [
        { title: "Resumind | Auth" },
        { name: "description", content: "Log into your account" }
    ]
)

const Auth = () => {

    const { isLoading, auth } = usePuterStore();

    // to get the search query parameter
    const location = useLocation();  // gives you details about the browser’s address bar, including any search/query parameters.
    const next = location.search.split("next=")[1];  // (*1)
    const navigate = useNavigate();

    // redirect if user is already logged in
    useEffect(() => {
        console.log("inside ue");
        if (auth.isAuthenticated){
            console.log("next", next);
            navigate(next);
            console.log("inside if");
        } 
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-[url(/images/bg-main.svg)] bg-cover min-h-screen flex items-center justify-center ">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Login to Continue your Job Journey</h2>
                    </div>
                    <div>
                        {isLoading ?
                            (<button className="auth-button animate-pulse">Loading...</button>) :
                            (
                                <>
                                    {auth.isAuthenticated ?
                                        (<button className="auth-button" onClick={auth.signOut}><p>Log Out</p> </button>) :
                                        (<button className="auth-button" onClick={auth.signIn}><p>Login In</p> </button>)
                                    }
                                </>
                            )
                        }
                    </div>
                </section>
            </div>


        </main>
    )
}

export default Auth




// *1
// location.search: is the part of the URL after the ?
// location.search.split("next=")[1] : splits the url into array from the text 'next=' in the url and get the part after that [1]
// for e.g.
// https://example.com?next=home
// location.search = '?next=home'
// array returned = ["?", "home"]
// next/ ("next=")[1] = home  






