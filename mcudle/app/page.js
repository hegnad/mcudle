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
            <p>Welcome, {user.displayName} ({user.email})!</p>
            <br />
            <div className="mt-4">
              <a
                href="/pages/"
                className="
                  w-full
                  flex justify-between p-5 
                  border border-FF8A00 rounded-lg mb-5
                  bg-151518 text-white hover:bg-FF8A00
                  transition-all duration-300 ease-in-out
                  transform hover:scale-105
                  text-center
                "
              >
                Click here to continue to MCUDLE
              </a>
            </div>
            <button
              onClick={firebaseSignOut}
              className="w-1/3 bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-800"
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
