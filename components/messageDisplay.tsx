'use client'
import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BarChart3, Code, Highlighter, ImageIcon, Link, MessageSquare, Mic, Quote, Copy, Check, ChevronDown, ChevronUp, Share2, MessageCircle, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { calculateVoteStats, getPollVotes, submitVote, VoteStats } from "@/actions/action";
import PollVisualization from "@/components/PollVisulaization";
import { createClient } from "@/utils/supabase/client";
import { supabase } from "@/utils/supabase";

export const Message = React.memo(({ message, currentUser, showAvatar = true, onReply, onReact }) => {
  const [copied, setCopied] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const isOwnMessage = message.user_id === currentUser?.id;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CopyButton = ({ text, className = "" }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleCopy(text)}
            className={`p-1 rounded hover:bg-accent transition-colors ${className}`}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{copied ? 'Copied!' : 'Copy to clipboard'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const MessageActions = () => (
    <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onReply?.(message)}>
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowReactions(!showReactions)}>
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <div className="group relative">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            <CopyButton text={message.content} className="absolute top-0 right-0" />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2 group relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
              <img
                src={message.metadata?.imageUrl || "/api/placeholder/800/600"}
                alt="Image message"
                className="object-cover w-full h-full transition-transform hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {message.content && (
              <p className="text-sm text-muted-foreground">{message.content}</p>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-2 group relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <Badge variant="secondary" className="text-xs">
                  {message.metadata?.language || 'plaintext'}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                >
                  {isCodeExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <CopyButton text={message.content} />
              </div>
            </div>
            <div className={`relative ${!isCodeExpanded && 'max-h-[300px] overflow-hidden'}`}>
              <SyntaxHighlighter
                language={message.metadata?.language || 'javascript'}
                style={vscDarkPlus}
                showLineNumbers
                wrapLines
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                {message.content}
              </SyntaxHighlighter>
              {!isCodeExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              )}
            </div>
            {!isCodeExpanded && message.content.split('\n').length > 10 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => setIsCodeExpanded(true)}
              >
                Show more
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-2 bg-accent/50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">Voice Message</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {message.metadata?.duration}s
              </Badge>
            </div>
            <audio
              src={message.metadata?.audioUrl}
              controls
              className="w-full"
              controlsList="nodownload"
            />
          </div>
        );

      case 'poll':
        const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
        const [hasVoted, setHasVoted] = useState(false);
        const [voteStats, setVoteStats] = useState<VoteStats[]>([]);
        const [isVoting, setIsVoting] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
          const loadVoteStats = async () => {
            const supabase =   createClient()

            try {
              const votes = await getPollVotes(message.id);

              // Calculate total votes
              const totalVotes = votes.length;

              // Calculate votes per option
              const voteCounts = new Array(message.metadata?.options?.length || 0).fill(0);
              votes.forEach(vote => {
                vote.option_indices.forEach(index => {
                  voteCounts[index]++;
                });
              });

              // Calculate stats
              const stats = voteCounts.map(count => ({
                votes: count,
                percentage: totalVotes > 0 ? (count / totalVotes) * 100 : 0
              }));

              setVoteStats(stats);

              // Check if user has already voted
              const userVote = votes.find(vote => vote.user_id === currentUser?.id);
              if (userVote) {
                setHasVoted(true);
                setSelectedOptions(userVote.option_indices);
              }
            } catch (error) {
              console.error('Error loading vote stats:', error);
            } finally {
              setIsLoading(false);
            }
          };

          loadVoteStats();
        }, [message.id, currentUser?.id]);

        const handleVote = async () => {
          if (!selectedOptions.length || isVoting || !currentUser?.id) return;

          setIsVoting(true);
          try {
            const { error } = await supabase
              .from('poll_votes')
              .insert({
                poll_id: message.id,
                user_id: currentUser.id,
                option_indices: selectedOptions
              });

            if (error) throw error;

            // Refresh vote stats
            const votes = await getPollVotes(message.id);
            const totalVotes = votes.length;
            const voteCounts = new Array(message.metadata?.options?.length || 0).fill(0);
            votes.forEach(vote => {
              vote.option_indices.forEach(index => {
                voteCounts[index]++;
              });
            });

            setVoteStats(voteCounts.map(count => ({
              votes: count,
              percentage: totalVotes > 0 ? (count / totalVotes) * 100 : 0
            })));
            setHasVoted(true);
          } catch (error) {
            console.error('Failed to submit vote:', error);
          } finally {
            setIsVoting(false);
          }
        };

        const handleOptionSelect = (index: number) => {
          if (hasVoted) return;

          if (message.metadata?.settings?.type === 'single') {
            setSelectedOptions([index]);
          } else {
            setSelectedOptions(prev =>
              prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
            );
          }
        };

        if (isLoading) {
          return (
            <div className="space-y-3 bg-accent/50 p-4 rounded-xl animate-pulse">
              <div className="h-8 bg-muted rounded-lg w-3/4" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded-lg" />
                ))}
              </div>
            </div>
          );
        }

        const totalVotes = voteStats.reduce((sum, stat) => sum + stat.votes, 0);

        return (
          <div className="space-y-3 bg-accent/50 p-4 rounded-xl">
            <div className="flex items-start gap-2">
              <BarChart3 className="h-5 w-5 mt-1 shrink-0 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium text-lg">{message.metadata?.question}</h4>
                {totalVotes > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {message.metadata?.options?.map((option, index) => {
                const stat = voteStats[index] || { votes: 0, percentage: 0 };
                const isSelected = selectedOptions.includes(index);

                return (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`relative overflow-hidden ${
                      hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-accent/50'
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-3 rounded-lg border p-3 relative z-10">
                      <Badge
                        variant={isSelected ? "default" : "outline"}
                        className={`h-6 w-6 shrink-0 transition-colors ${
                          isSelected ? 'bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        {index + 1}
                      </Badge>
                      <span className="text-sm flex-1">{option}</span>
                      {(hasVoted || stat.votes > 0) && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                          <span>{stat.votes}</span>
                          <span>•</span>
                          <span>{stat.percentage.toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                    {(hasVoted || stat.votes > 0) && (
                      <div
                        className="absolute inset-0 bg-primary/10 z-0 transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {!hasVoted && selectedOptions.length > 0 && (
              <Button
                onClick={handleVote}
                disabled={isVoting}
                className="w-full mt-2"
              >
                {isVoting ? 'Submitting...' : 'Vote'}
                {message.metadata?.settings?.type === 'multiple' && !isVoting &&
                  ` (${selectedOptions.length} selected)`
                }
              </Button>
            )}

            {hasVoted && (
              <p className="text-xs text-center text-muted-foreground">
                You've voted in this poll
              </p>
            )}
          </div>
        );

      case 'link':
        return (
          <Card className="p-4 space-y-2 hover:shadow-lg transition-shadow group">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 shrink-0 text-primary" />
              <a
                href={message.metadata?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline"
              >
                {message.metadata?.title || message.metadata?.url}
              </a>
            </div>
            {message.metadata?.preview && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={message.metadata.preview || "/api/placeholder/800/400"}
                  alt="Link preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            {message.content && (
              <p className="text-sm text-muted-foreground">
                {message.content}
              </p>
            )}
          </Card>
        );

      case 'quote':
        return (
          <div className="space-y-2 group relative">
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Quoted Message</span>
            </div>
            <blockquote className="border-l-4 border-primary pl-4 italic bg-accent/50 p-3 rounded-r-lg">
              {message.metadata?.sourceText}
            </blockquote>
            {message.content && (
              <p className="text-sm mt-2">{message.content}</p>
            )}
            <CopyButton text={message.metadata?.sourceText} />
          </div>
        );

      case 'highlight':
        return (
          <div className="space-y-2 group relative">
            <div className="flex items-center gap-2">
              <Highlighter className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Highlighted Text</span>
            </div>
            <Alert className={`${getHighlightClass(message.metadata?.highlightColor)}`}>
              <AlertDescription>
                {message.content}
              </AlertDescription>
            </Alert>
            <CopyButton text={message.content} />
          </div>
        );

      // ... (other message types remain the same as before)

      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };
  const getHighlightClass = (color) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'green': return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      default: return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-2 group/message hover:bg-accent/10 rounded-xl transition-colors ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isOwnMessage && showAvatar && (
        <div className="relative">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarImage
              src={`https://avatar.vercel.sh/${message.user_id}`}
              alt={`${message.user_id}'s avatar`}
            />
            <AvatarFallback>
              {message.user_id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        </div>
      )}
      {!isOwnMessage && !showAvatar && <div className="w-8" />}
      <div className="flex-1 max-w-[75%]">
        <div
          className={`group relative p-4 rounded-xl ${
            isOwnMessage
              ? "bg-primary/10 dark:bg-primary/20"
              : "bg-muted"
          }`}
        >
          {!isOwnMessage && (
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-medium hover:underline cursor-pointer">
                {message.user_id}
              </p>
              <Badge variant="secondary" className="h-5 px-1">
                {message.type}
              </Badge>
              {message.metadata?.isPinned && (
                <Badge variant="outline" className="text-xs">
                  Pinned
                </Badge>
              )}
            </div>
          )}
          {renderContent()}
          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
            <span>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
            {message.edited && <span className="italic">(edited)</span>}
            {message.metadata?.readBy?.length > 0 && (
              <span>• Read by {message.metadata.readBy.length}</span>
            )}
          </div>
          {/*<MessageActions />*/}
        </div>
        {showReactions && (
          <div className="mt-1 flex items-center gap-1">
            {['👍', '❤️', '😄', '🎉', '🤔', '👀'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReact?.(message.id, emoji)}
                className="p-1 hover:bg-accent rounded-full transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        {message.reactions?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(
              message.reactions.reduce((acc, reaction) => {
                acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                return acc;
              }, {})
            ).map(([emoji, count]) => (
              <Badge
                key={emoji}
                variant="secondary"
                className="text-xs gap-1 hover:bg-accent cursor-pointer"
              >
                {emoji} {count}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default Message;