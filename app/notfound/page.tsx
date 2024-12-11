'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Home, Loader2, Search, Wifi, BatteryLow, Usb } from 'lucide-react';
import "@/app/globals.css";

const NotFoundPage = () => {
  const router = useRouter();
  const [loadingText, setLoadingText] = useState('');
  const [showError, setShowError] = useState(false);

  // Life analogies for 404
  const lifeAnalogies = [
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "Like Your Morning Coffee... Missing!",
      description: "You know that feeling when you're out of coffee and the day just doesn't work? That's this page right now."
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "WiFi Bars, but No Internet",
      description: "Full signal but nothing loads. We've all been there, and we're there right now."
    },
    {
      icon: <BatteryLow className="h-8 w-8" />,
      title: "1% Battery, No Charger",
      description: "This page is as missing as your charger when your battery is about to die."
    },
    {
      icon: <Usb className="h-8 w-8" />,
      title: "USB: Wrong Side... Again",
      description: "Third time's the charm? Not this time. This page is as flipped as your USB attempts."
    }
  ];

  // Random tech support messages
  const loadingMessages = [
    "Have you tried turning it off and on again?",
    "Checking if the hamsters powering our servers are awake...",
    "Searching the internet's lost and found...",
    "Error 404: Page went out for coffee...",
    "Looking behind the couch cushions...",
    "Asking the intern if they moved it...",
    "Blaming it on the developer...",
    "Consulting the ancient scrolls of HTML...",
    "Page is probably stuck in traffic...",
    "Training a new search pigeon..."
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(loadingMessages[currentIndex]);
      currentIndex = (currentIndex + 1) % loadingMessages.length;
    }, 3000);

    // Show error message after some loading messages
    setTimeout(() => {
      setShowError(true);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const [selectedAnalogy, setSelectedAnalogy] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedAnalogy((prev) => (prev + 1) % lifeAnalogies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="-mt-24 pt-24 min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Main Error */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent animate-bounce">
            404
          </h1>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-xl animate-pulse rounded-full" />
            <div className="relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/20">
              {lifeAnalogies[selectedAnalogy].icon}
              <h2 className="text-2xl font-bold mt-4">
                {lifeAnalogies[selectedAnalogy].title}
              </h2>
              <p className="text-muted-foreground mt-2">
                {lifeAnalogies[selectedAnalogy].description}
              </p>
            </div>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="h-16">
          {!showError ? (
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              {loadingText}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground animate-fade-in">
              <p>Ok fine, we give up. The page is really not here. 🤷‍♂️</p>
              <p className="mt-1">But hey, at least we had fun looking for it!</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium px-8 py-3 rounded-xl hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </button>

          <p className="text-sm text-muted-foreground">
            Or continue staring at this page. We won't judge. 👀
          </p>
        </div>

        {/* Easter Egg */}
        <div
          className="text-xs text-muted-foreground/50 cursor-help hover:text-muted-foreground transition-colors"
          title="You found the easter egg! Here's a virtual cookie 🍪"
        >
          *No pages were harmed in the making of this 404
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;