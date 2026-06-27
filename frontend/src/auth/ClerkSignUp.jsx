/**
 * Full-page Clerk Sign Up (register with Google, email, etc.) – dark theme.
 * When Clerk is not configured, redirects to /register.
 */

import { Navigate } from "react-router-dom";
import { SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const useClerk = clerkKey && clerkKey !== "YOUR_PUBLISHABLE_KEY";

export default function ClerkSignUp() {
  if (!useClerk) return <Navigate to="/register" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212126] p-4">
      <SignUp
        appearance={{ baseTheme: dark }}
        signInUrl="/sign-in"
        afterSignUpUrl="/"
        routing="path"
        path="/sign-up"
      />
    </div>
  );
}
