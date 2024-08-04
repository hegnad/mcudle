"use client";

import { useUserAuth } from "./_utils/auth-context";
import Link from "next/link";

const LandingPage = () => {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  return (
    <main className="flex items-center justify-center min-h-screen">
        <div className="p-4 w-full max-w-md">
            {!user ? (
                <button 
                    onClick={gitHubSignIn}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Sign in with GitHub
                </button>
            ) : (
                <div className="text-center">
                    <p>Welcome, {user.displayName} ({user.email})</p>
    
                    <br />
                        <div className="mt-4">
                            <a
                                href="/pages/"
                                className="
                                    w-full
                                    flex justify-between p-5 
                                    border border-gray-500 rounded-lg mb-5
                                    bg-blue-950 text-white hover:bg-blue-800 
                                    transition-all duration-300 ease-in-out
                                    transform hover:scale-105
                                    text-center
                                    "
                            >
                                Go to Shopping List
                            </a>
                        </div>

                    <button 
                        onClick={firebaseSignOut}
                        className="w-1/3 bg-red-500 text-white p-2 rounded mt-4"
                    >
                        Sign Out
                    </button>

                </div>
            )}
        </div>
    </main>
  );
};

export default LandingPage;