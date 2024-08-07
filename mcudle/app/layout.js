import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./_utils/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MCUDLE",
  description: "A Daily Guessing Game for Marvel Cinematic Universe Movies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
