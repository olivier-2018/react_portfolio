import React from "react";

const lastUpdate = import.meta.env.VITE_GIT_COMMIT_DATE;

export function Footer() {
  return (
    <footer className="w-full py-4 text-center text-sm text-muted-foreground bg-background border-t border-border mt-12">
      &copy; {new Date().getFullYear()} Olivier Bron. All rights reserved. (Last updated: {new Date(lastUpdate).toLocaleDateString()}) )  
    </footer>
  );
}