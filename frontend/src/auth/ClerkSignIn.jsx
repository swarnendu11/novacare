/**
 * Full-page Clerk Sign In (Google, email, etc.) – dark theme.
 * When Clerk is not configured, redirects to /login.
 */

import { Navigate } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const useClerk = clerkKey && clerkKey !== "YOUR_PUBLISHABLE_KEY";

export default function ClerkSignIn() {
  if (!useClerk) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212126] p-4">
      <SignIn
        appearance={{ baseTheme: dark }}
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}
