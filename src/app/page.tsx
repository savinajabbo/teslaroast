import LoginButton from './components/LoginButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          tesla roast
        </h1>
        <p className="text-gray-600 mb-8">
          
        </p>
        <LoginButton />
      </div>
    </main>
  );
} 