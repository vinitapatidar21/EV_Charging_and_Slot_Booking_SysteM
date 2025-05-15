
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="bg-ev-lightblue w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-ev-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! We couldn't find the page you're looking for.</p>
        <Link to="/">
          <Button className="bg-ev-blue hover:bg-blue-600 px-8 py-2">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
