// ScrollManager.js
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const ScrollIndicator = ({ onClick, unreadCount }) => (
  <div className="">
    <Button
      onClick={onClick}
      className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white group"
      size="sm"
    >
      <ArrowDown className="h-4 w-4 mr-2 animate-bounce" />
      <span>{unreadCount} new message{unreadCount > 1 ? "s" : ""}</span>
    </Button>
  </div>
);

const ScrollManager = ({ messages, scrollContainerRef }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(messages.length);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Check if we're near bottom of the scroll container
  const checkIfNearBottom = useCallback((container) => {
    const threshold = 150; // Increased threshold for better detection
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    return position < threshold;
  }, []);

  // Scroll to bottom with a guaranteed complete scroll
  const performScrollToBottom = useCallback((container) => {
    const maxScrollAttempts = 3;
    let scrollAttempt = 0;

    const scrollWithCheck = () => {
      const targetScrollTop = container.scrollHeight;
      container.scrollTo({
        top: targetScrollTop,
        behavior: scrollAttempt === 0 ? 'smooth' : 'auto'
      });

      // Verify scroll position after a small delay
      setTimeout(() => {
        if (!checkIfNearBottom(container) && scrollAttempt < maxScrollAttempts) {
          scrollAttempt++;
          scrollWithCheck();
        }
      }, 100);
    };

    scrollWithCheck();
  }, [checkIfNearBottom]);

  // Handle scroll events
  useEffect(() => {
    if (!scrollContainerRef?.current) return;
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      const nearBottom = checkIfNearBottom(container);
      setIsNearBottom(nearBottom);

      if (nearBottom) {
        setShowIndicator(false);
        setUnreadCount(0);
        setUserHasScrolled(false);
      } else if (!userHasScrolled) {
        setUserHasScrolled(true);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef, checkIfNearBottom]);

  // Handle new messages
  useEffect(() => {
    if (!scrollContainerRef?.current || !messages.length) return;
    const container = scrollContainerRef.current;

    if (messages.length > lastMessageCount) {
      if (isNearBottom && !userHasScrolled) {
        // Add a small delay to allow content to render
        setTimeout(() => {
          performScrollToBottom(container);
        }, 50);
      } else {
        setShowIndicator(true);
        setUnreadCount(prev => prev + (messages.length - lastMessageCount));
      }

      setLastMessageCount(messages.length);
    }
  }, [messages, scrollContainerRef, userHasScrolled, lastMessageCount, isNearBottom, performScrollToBottom]);

  // Scroll to bottom handler for manual clicks
  const scrollToBottom = useCallback(() => {
    if (!scrollContainerRef?.current) return;
    performScrollToBottom(scrollContainerRef.current);
    setShowIndicator(false);
    setUnreadCount(0);
    setUserHasScrolled(false);
  }, [scrollContainerRef, performScrollToBottom]);

  return showIndicator ? (
    <div className="relative">
      <ScrollIndicator onClick={scrollToBottom} unreadCount={unreadCount} />
    </div>
  ) : null;
};

export default ScrollManager;