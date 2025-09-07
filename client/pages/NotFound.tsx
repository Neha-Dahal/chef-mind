import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
      <p className="mt-3 text-muted-foreground">Oops! Page not found.</p>
      <a href="/" className="mt-6 inline-flex text-sm font-medium text-primary underline underline-offset-4">
        Return to Home
      </a>
    </div>
  );
};

export default NotFound;
