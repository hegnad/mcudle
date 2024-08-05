"use client";

import { useUserAuth } from "./_utils/auth-context";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from './landingPage.module.css';

const LandingPage = () => {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
  const [userStats, setUserStats] = useState({ totalGames: 0, correctGuesses: { "1": 0, "2": 0, "3": 0, "4": 0 } });

  useEffect(() => {
    if (user) {

      const storedUserStats = localStorage.getItem('userStats');
      if (storedUserStats) {
        setUserStats(JSON.parse(storedUserStats));
      }
    }
  }, [user]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className={styles.container}>
        {!user ? (
          <button
            onClick={gitHubSignIn}
            className={styles.lpButton}
          >
            Sign in with GitHub
          </button>
        ) : (
          <div className={styles.welcomeText}>
            <p>Welcome, {user.displayName} ({user.email})!</p>
            <br />
            <hr className={styles.headerLine} />
            <div className={styles.statsContainer}>
              <p>Total Games:</p>
              <h2>{userStats.totalGames}</h2>
              <br />
              <p>Correct Guess Distribution:</p>
              <div className={styles.guessDistribution}>
                <div className={styles.guessItem}>
                  <h2>{userStats.correctGuesses["1"]}</h2>
                  <p>#1</p>
                </div>
                <div className={styles.guessItem}>
                  <h2>{userStats.correctGuesses["2"]}</h2>
                  <p>#2</p>
                </div>
                <div className={styles.guessItem}>
                  <h2>{userStats.correctGuesses["3"]}</h2>
                  <p>#3</p>
                </div>
                <div className={styles.guessItem}>
                  <h2>{userStats.correctGuesses["4"]}</h2>
                  <p>#4</p>
                </div>
              </div>
            </div>
            <br />
            <div className="mt-4">
              <a
                href="/pages/"
                className={styles.lpButton}
              >
                Click here to continue to MCUDLE
              </a>
            </div>
            <button
              onClick={firebaseSignOut}
              className={styles.signOutButton}
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
