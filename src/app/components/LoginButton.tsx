'use client';

export default function LoginButton() {
  return (
    <button 
      onClick={() => window.location.href = '/api/auth/login'} 
      className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
    >
      log in with tesla
    </button>
  );
} 