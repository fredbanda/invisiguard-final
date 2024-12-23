"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react"; // Correct import for signOut

const SettingsPage = () => {
  const user = useCurrentUser();

  const onClick = () => {
    signOut();
  };

  return (
    <div className="container w-[600px] sm:w-[600px] items-center justify-center text-white/80 text-[1.2rem]">
      {/* Render session or loading state */}
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(user)}</pre>
      )}
      <button
        onClick={onClick}
        type="submit"
        className="w-full bg-black text-white mt-8 rounded-md"
      >
        Sign Out
      </button>
    </div>
  );
};

export default SettingsPage;
