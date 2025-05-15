
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Use navigate instead of Navigate component
    navigate('/', { replace: true });
  }, [navigate]);
  
  return null; // Return nothing while redirecting
};

export default Index;
