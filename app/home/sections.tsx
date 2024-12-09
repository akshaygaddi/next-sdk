import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Code,
  Link,
  BookmarkPlus,
  ThumbsUp,
  BarChart2,
  Compass,
  Bookmark,
  Search,
  Clock,
  TrendingUp,
  ListPlus,
  FolderPlus,
  Hash,
  Eye,
  Share2,
  FileText,
  Vote,
  Timer,
  Users,
  ArrowRight,
  PlusCircle,
  Shield,
  Check,
  Mic,
  ChevronRight,
  PieChart,
  Send,
  Pause,
  Play,
  Image,
  BookOpen,
  ChevronLeft,
  Star,
  Heart,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  VolumeX,
  Volume2,
} from "lucide-react";

// Content Discovery Section
export const ContentDiscoverySection = () => {
  const [selectedTopic, setSelectedTopic] = useState("react");
  const [searchQuery, setSearchQuery] = useState("");

  const topics = [
    { id: "react", name: "React", trending: true, count: "2.4K" },
    { id: "nodejs", name: "Node.js", trending: false, count: "1.8K" },
    { id: "typescript", name: "TypeScript", trending: true, count: "3.1K" },
  ];

  const recommendations = [
    {
      title: "Understanding React Hooks",
      type: "Article",
      engagement: "4.2K reads",
      rating: 4.8,
      tags: ["React", "JavaScript", "Frontend"],
    },
    {
      title: "Node.js Best Practices",
      type: "Discussion",
      engagement: "892 participants",
      rating: 4.9,
      tags: ["Node.js", "Backend", "Performance"],
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feature Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-500 px-4 py-2 rounded-full flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Smart Content Discovery
          </div>
        </div>

        {/* Gradient Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Discover What Matters
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI-powered content discovery with personalized recommendations and
            trending topics
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trending Topics */}
          <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Trending Topics</h3>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedTopic === topic.id
                      ? "bg-orange-500 text-white"
                      : "bg-white/50 dark:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span className="font-medium">{topic.name}</span>
                    </div>
                    <span className="text-sm opacity-75">
                      {topic.count} posts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Feed */}
          <div className="lg:col-span-2 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-2xl p-6 border border-white/20">
            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search content..."
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 rounded-xl pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
            </div>

            {/* Recommended Content */}
            <div className="space-y-6">
              {recommendations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-orange-500 font-medium">
                      {item.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {item.engagement}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-3">{item.title}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    {item.tags.map((tag, tidx) => (
                      <span
                        key={tidx}
                        className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-500 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Room Statistics */}
      <div className="grid grid-cols-4 gap-6 mt-12">
        <div className="text-center p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            24/7
          </div>
          <div className="text-sm text-gray-500">Active Discussions</div>
        </div>
        <div className="text-center p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            5.2K+
          </div>
          <div className="text-sm text-gray-500">Code Snippets Shared</div>
        </div>
        <div className="text-center p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            98%
          </div>
          <div className="text-sm text-gray-500">Resolution Rate</div>
        </div>
        <div className="text-center p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            15min
          </div>
          <div className="text-sm text-gray-500">Avg. Response Time</div>
        </div>
      </div>

      {/* Room Features List */}
      <div className="mt-12 grid grid-cols-3 gap-6">
        <div className="p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
          <Code className="w-6 h-6 text-orange-500 mb-4" />
          <h4 className="font-semibold mb-2">Smart Code Sharing</h4>
          <p className="text-sm text-gray-500">
            Syntax highlighting, live collaboration, and instant validation for
            all programming languages
          </p>
        </div>
        <div className="p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
          <Link className="w-6 h-6 text-orange-500 mb-4" />
          <h4 className="font-semibold mb-2">Rich Link Previews</h4>
          <p className="text-sm text-gray-500">
            Automatically generate rich previews for shared links with metadata
            and thumbnails
          </p>
        </div>
        <div className="p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
          <Vote className="w-6 h-6 text-orange-500 mb-4" />
          <h4 className="font-semibold mb-2">Instant Polls</h4>
          <p className="text-sm text-gray-500">
            Create quick polls and surveys with real-time results and analytics
          </p>
        </div>
        <div className="p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
          <FileText className="w-6 h-6 text-orange-500 mb-4" />
          <h4 className="font-semibold mb-2">Smart Notes</h4>
          <p className="text-sm text-gray-500">
            Save and organize discussion highlights with automatic
            categorization
          </p>
        </div>
        <div className="p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
          <Timer className="w-6 h-6 text-orange-500 mb-4" />
          <h4 className="font-semibold mb-2">Timed Discussions</h4>
          <p className="text-sm text-gray-500">
            Set time limits for focused discussions and decision-making
          </p>
        </div>
        <div className="p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
          <Users className="w-6 h-6 text-orange-500 mb-4" />
          <h4 className="font-semibold mb-2">Team Channels</h4>
          <p className="text-sm text-gray-500">
            Create dedicated spaces for team collaboration and project
            discussions
          </p>
        </div>
      </div>
    </section>
  );
};

// export const SmartRoomsDemo = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//
//   // Demo messages showing different types of content
//   const messages = [
//     {
//       type: 'text',
//       user: 'Alex',
//       avatar: 'A',
//       content: 'Check out this new API endpoint I just built:'
//     },
//     {
//       type: 'code',
//       user: 'Alex',
//       avatar: 'A',
//       language: 'javascript',
//       content: `// Authentication endpoint
// async function authenticate(credentials) {
//   const response = await fetch('/api/auth', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(credentials)
//   });
//   return response.json();
// }`,
//       reactions: ['👍', '🚀']
//     },
//     {
//       type: 'voice',
//       user: 'Sarah',
//       avatar: 'S',
//       duration: '0:45',
//       waveform: [0.2, 0.5, 0.8, 0.3, 0.6, 0.4, 0.7, 0.9, 0.5, 0.3]
//     },
//     {
//       type: 'poll',
//       user: 'Mike',
//       avatar: 'M',
//       question: 'Which framework should we use?',
//       options: [
//         { text: 'React', votes: 45 },
//         { text: 'Vue', votes: 30 },
//         { text: 'Angular', votes: 25 }
//       ],
//       totalVotes: 100
//     },
//     {
//       type: 'image',
//       user: 'Emily',
//       avatar: 'E',
//       caption: 'New dashboard design preview',
//       reactions: ['❤️', '👀']
//     }
//   ];
//
//   const contentTypes = [
//     {
//       id: 'overview',
//       icon: MessageSquare,
//       label: 'Overview'
//     },
//     {
//       id: 'code',
//       icon: Code,
//       label: 'Code Snippets'
//     },
//     {
//       id: 'voice',
//       icon: Mic,
//       label: 'Voice Notes'
//     },
//     {
//       id: 'poll',
//       icon: PieChart,
//       label: 'Quick Polls'
//     },
//     {
//       id: 'media',
//       icon: Image,
//       label: 'Media Sharing'
//     }
//   ];
//
//   return (
//     <div className="w-full max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <span className="inline-flex items-center px-4 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
//           <MessageSquare className="w-4 h-4 mr-2" />
//           Interactive Communication Hub
//         </span>
//         <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
//           Share Any Type of Content
//         </h2>
//         <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//           Express ideas through code, voice, polls, and media in our feature-rich chat rooms
//         </p>
//       </div>
//
//       {/* Interactive Demo */}
//       <div className="bg-white/30 dark:bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-200/20">
//         {/* Content Type Navigation */}
//         <div className="flex overflow-x-auto p-4 gap-2 border-b border-gray-200/20">
//           {contentTypes.map((type) => (
//             <button
//               key={type.id}
//               onClick={() => setActiveTab(type.id)}
//               className={`flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
//                 activeTab === type.id
//                   ? 'bg-orange-500 text-white'
//                   : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
//               }`}
//             >
//               <type.icon className="w-4 h-4 mr-2" />
//               {type.label}
//             </button>
//           ))}
//         </div>
//
//         {/* Content Area */}
//         <div className="p-6">
//           {/* Message Composer */}
//           <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
//             <div className="flex items-center gap-2 mb-4">
//               <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
//                 <Code className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//               </button>
//               <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
//                 <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//               </button>
//               <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
//                 <Image className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//               </button>
//               <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
//                 <PieChart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//               </button>
//               <div className="flex-1">
//                 <input
//                   type="text"
//                   placeholder="Type your message..."
//                   className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-600/50 border border-gray-200/20"
//                 />
//               </div>
//               <button className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//
//           {/* Messages Feed */}
//           <div className="space-y-6">
//             {messages.map((message, idx) => (
//               <div key={idx} className="transform transition-all duration-300 hover:translate-x-2">
//                 {message.type === 'code' && (
//                   <div className="flex gap-4">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold">
//                       {message.avatar}
//                     </div>
//                     <div className="flex-1">
//                       <div className="mb-2 font-semibold">{message.user}</div>
//                       <div className="bg-gray-900 text-gray-100 p-4 rounded-xl">
//                         <div className="flex justify-between items-center mb-2 text-gray-400">
//                           <span>{message.language}</span>
//                           <button className="hover:text-white transition-colors">
//                             <Code className="w-4 h-4" />
//                           </button>
//                         </div>
//                         <pre className="text-sm overflow-x-auto">{message.content}</pre>
//                       </div>
//                       <div className="flex gap-2 mt-2">
//                         {message.reactions.map((reaction, i) => (
//                           <span key={i} className="px-2 py-1 rounded-lg bg-white/50 dark:bg-gray-700/50 text-sm">
//                             {reaction}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//
//                 {message.type === 'voice' && (
//                   <div className="flex gap-4">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold">
//                       {message.avatar}
//                     </div>
//                     <div className="flex-1">
//                       <div className="mb-2 font-semibold">{message.user}</div>
//                       <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-xl">
//                         <div className="flex items-center gap-4">
//                           <button
//                             onClick={() => setIsPlaying(!isPlaying)}
//                             className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center"
//                           >
//                             {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//                           </button>
//                           <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
//                             {message.waveform.map((height, i) => (
//                               <div
//                                 key={i}
//                                 className="inline-block w-1 h-full mx-px bg-orange-500"
//                                 style={{ height: `${height * 100}%` }}
//                               />
//                             ))}
//                           </div>
//                           <span className="text-sm text-gray-600 dark:text-gray-300">{message.duration}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//
//                 {message.type === 'poll' && (
//                   <div className="flex gap-4">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold">
//                       {message.avatar}
//                     </div>
//                     <div className="flex-1">
//                       <div className="mb-2 font-semibold">{message.user}</div>
//                       <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-xl">
//                         <h4 className="font-semibold mb-4">{message.question}</h4>
//                         {message.options.map((option, i) => (
//                           <div key={i} className="mb-3">
//                             <div className="flex justify-between mb-1">
//                               <span>{option.text}</span>
//                               <span>{(option.votes / message.totalVotes * 100).toFixed(0)}%</span>
//                             </div>
//                             <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
//                               <div
//                                 className="h-full bg-orange-500 transition-all duration-500"
//                                 style={{ width: `${(option.votes / message.totalVotes) * 100}%` }}
//                               />
//                             </div>
//                           </div>
//                         ))}
//                         <div className="text-sm text-gray-500 mt-4">
//                           {message.totalVotes} total votes
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//
//                 {message.type === 'image' && (
//                   <div className="flex gap-4">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold">
//                       {message.avatar}
//                     </div>
//                     <div className="flex-1">
//                       <div className="mb-2 font-semibold">{message.user}</div>
//                       <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-xl">
//                         <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-2 flex items-center justify-center">
//                           <img src="/api/placeholder/800/450" alt="Dashboard preview" className="rounded-lg" />
//                         </div>
//                         <p className="text-sm text-gray-600 dark:text-gray-300">{message.caption}</p>
//                         <div className="flex gap-2 mt-2">
//                           {message.reactions.map((reaction, i) => (
//                             <span key={i} className="px-2 py-1 rounded-lg bg-white/50 dark:bg-gray-700/50 text-sm">
//                               {reaction}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//
//       {/* Feature Highlights */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
//         <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/20">
//           <Code className="w-8 h-8 text-orange-500 mb-4" />
//           <h3 className="font-semibold mb-2">Code Snippets</h3>
//           <p className="text-sm text-gray-600 dark:text-gray-300">Share and discuss code with syntax highlighting and validation</p>
//         </div>
//         <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/20">
//           <Mic className="w-8 h-8 text-orange-500 mb-4" />
//           <h3 className="font-semibold mb-2">Voice Notes</h3>
//           <p className="text-sm text-gray-600 dark:text-gray-300">Record and share voice messages with waveform visualization</p>
//         </div>
//         <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/20">
//           <PieChart className="w-8 h-8 text-orange-500 mb-4" />
//           <h3 className="font-semibold mb-2">Quick Polls</h3>
//           <p className="text-sm text-gray-600 dark:text-gray-300">Create instant polls and gather team feedback in real-time</p>
//         </div>
//         <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/20">
//           <Image className="w-8 h-8 text-orange-500 mb-4" />
//           <h3 className="font-semibold mb-2">Media Sharing</h3>
//           <p className="text-sm text-gray-600 dark:text-gray-300">Share images and files with preview and instant reactions</p>
//         </div>
//       </div>
//
//       {/* Quick Actions Bar */}
//       <div className="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/20">
//         <h3 className="font-semibold mb-4">Quick Actions</h3>
//         <div className="flex flex-wrap gap-4">
//           <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
//             <Code className="w-4 h-4" />
//             New Code Snippet
//           </button>
//           <button
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//               isRecording
//                 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
//                 : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
//             }`}
//             onClick={() => setIsRecording(!isRecording)}
//           >
//             <Mic className="w-4 h-4" />
//             {isRecording ? 'Stop Recording' : 'Record Voice'}
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
//             <PieChart className="w-4 h-4" />
//             Create Poll
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
//             <Image className="w-4 h-4" />
//             Upload Media
//           </button>
//         </div>
//       </div>
//
//       {/* Tooltip Helper */}
//       <div className="mt-8 text-center text-sm text-gray-500">
//         <p>Press Tab to cycle through content types, Space to start/stop voice recording</p>
//       </div>
//     </div>
//   );
// };

export const MicroLearningHub = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Tips", count: 15892 },
    { id: "code", label: "Code Snippets", count: 8453 },
    { id: "design", label: "Design Patterns", count: 4127 },
    { id: "tools", label: "Tools & Setup", count: 3312 },
  ];

  const tips = [
    {
      title: "React Hooks Best Practice",
      category: "code",
      duration: "15s",
      code: `useEffect(() => {
  // Clean up subscriptions
  const subscription = someAPI.subscribe();
  return () => {
    subscription.unsubscribe();
  }
}, []);`,
      likes: 1240,
      validations: 89,
      author: "Sarah Chen",
      expertise: "Senior React Dev",
      tags: ["React", "Hooks", "Clean Code"],
    },
    {
      title: "CSS Grid Quick Tip",
      category: "code",
      duration: "12s",
      code: `/* Responsive grid layout */
.grid-container {
  display: grid;
  grid-template-columns: 
    repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}`,
      likes: 890,
      validations: 92,
      author: "Alex Rivera",
      expertise: "UI Engineer",
      tags: ["CSS", "Grid", "Responsive"],
    },
    {
      title: "VS Code Productivity",
      category: "tools",
      duration: "20s",
      code: `// Custom keyboard shortcut
{
  "key": "ctrl+alt+t",
  "command": "workbench.action.terminal.new"
}`,
      likes: 756,
      validations: 78,
      author: "Mike Johnson",
      expertise: "Dev Tools Expert",
      tags: ["VS Code", "Productivity"],
    },
  ];

  const metrics = [
    { value: "15K+", label: "Tips Shared", icon: BookOpen },
    { value: "4.8", label: "Avg Rating", icon: Star },
    { value: "92%", label: "Success Rate", icon: Users },
    { value: "2.5M", label: "Monthly Views", icon: Clock },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4 mr-2" />
          Quick Knowledge Hub
        </span>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Learn in Bite-Sized Pieces
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover and share validated micro-learning content from industry
          experts
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl bg-white/50 dark:bg-gray-800/50 p-6 backdrop-blur-sm border border-gray-200/20 group hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="relative z-10">
              <metric.icon className="w-6 h-6 text-orange-500 mb-2" />
              <div className="text-3xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {metric.label}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-orange-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Category Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.id
                ? "bg-orange-500 text-white"
                : "bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30"
            }`}
          >
            {category.label}
            <span className="text-sm opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="group bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-200/20 hover:border-orange-500/20 transition-all duration-300"
          >
            {/* Tip Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg mb-1">{tip.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {tip.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      {tip.author[0]}
                    </div>
                    {tip.author}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <BookmarkPlus className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Preview */}
            <div className="relative mb-4">
              <div className="absolute top-0 right-0 bg-gray-800 text-gray-400 px-2 py-1 text-xs rounded-tr-lg">
                {tip.tags[0]}
              </div>
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Code className="w-4 h-4" />
                  </button>
                </div>
                <pre className="p-4 text-gray-100 text-sm overflow-x-auto">
                  {tip.code}
                </pre>
              </div>
            </div>

            {/* Tip Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{tip.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">{tip.validations} validations</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all duration-300">
                Try It Now
              </button>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-4">
              {tip.tags.map((tag, tagIdx) => (
                <span
                  key={tagIdx}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Create */}
      <div className="text-center">
        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
          Share Your Knowledge
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export const LearningReels = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const reels = [
    {
      id: 1,
      author: "Sarah Chen",
      username: "@sarahcodes",
      title: "React useEffect Cleanup",
      description:
        "Why you need cleanup functions in useEffect! #react #hooks #javascript",
      likes: "45.2K",
      comments: "1,234",
      saves: "8,901",
      shares: "3,421",
      duration: "0:28",
      isFollowing: true,
      hasCode: true,
      tags: ["React", "Hooks", "Clean Code"],
    },
    {
      id: 2,
      author: "Alex Dev",
      username: "@alexdev",
      title: "CSS Grid Magic",
      description: "One line of CSS for responsive layouts! 🔥 #css #webdev",
      likes: "38.9K",
      comments: "982",
      saves: "7,234",
      shares: "2,891",
      duration: "0:15",
      isFollowing: false,
      hasCode: true,
      tags: ["CSS", "Responsive", "Layout"],
    },
    {
      id: 3,
      author: "Tech Tips",
      username: "@techtips",
      title: "VS Code Shortcuts",
      description:
        "Speed up your coding with these shortcuts! ⚡️ #vscode #productivity",
      likes: "29.7K",
      comments: "756",
      saves: "5,892",
      shares: "2,145",
      duration: "0:22",
      isFollowing: true,
      hasCode: false,
      tags: ["VS Code", "Productivity"],
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section - Similar to TikTok's top bar */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium">
          30-Second Learning
        </span>
        <h2 className="text-4xl font-bold mt-4 mb-2">Learn Smarter</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Swipe for quick tech tips
        </p>
      </div>

      {/* Main Reels Interface */}
      <div className="relative h-[80vh] max-h-[800px] bg-gray-900 rounded-2xl overflow-hidden">
        {/* Video Container */}
        <div className="relative h-full">
          {/* Placeholder for video - in real app this would be a video element */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90">
            <img
              src="/api/placeholder/400/800"
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {reels[currentVideo].author[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {reels[currentVideo].author}
                </h3>
                <p className="text-sm text-gray-300">
                  {reels[currentVideo].username}
                </p>
              </div>
              <button className="px-4 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
                {reels[currentVideo].isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            {/* Title and Description */}
            <h4 className="text-white font-semibold mb-2">
              {reels[currentVideo].title}
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              {reels[currentVideo].description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {reels[currentVideo].tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Side Actions Bar - Similar to TikTok */}
          <div className="absolute right-4 bottom-20 flex flex-col gap-6">
            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-sm">
                {reels[currentVideo].likes}
              </span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-sm">
                {reels[currentVideo].comments}
              </span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center">
                <BookmarkPlus className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-sm">
                {reels[currentVideo].saves}
              </span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-sm">
                {reels[currentVideo].shares}
              </span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-1 bg-gray-700">
              <div
                className="h-full bg-orange-500 transition-all duration-200"
                style={{ width: "45%" }}
              />
            </div>
          </div>

          {/* Video Info Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-900/70 px-3 py-1 rounded-full">
              <Timer className="w-4 h-4 text-white" />
              <span className="text-white text-sm">
                {reels[currentVideo].duration}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 bg-gray-900/70 rounded-full flex items-center justify-center"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              {reels[currentVideo].hasCode && (
                <button className="flex items-center gap-2 bg-gray-900/70 px-3 py-1 rounded-full">
                  <Code className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">View Code</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentVideo(Math.max(0, currentVideo - 1))}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 bg-gray-900/70 rounded-full flex items-center justify-center text-white"
            disabled={currentVideo === 0}
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={() =>
              setCurrentVideo(Math.min(reels.length - 1, currentVideo + 1))
            }
            className="absolute bottom-20 left-4 transform w-10 h-10 bg-gray-900/70 rounded-full flex items-center justify-center text-white"
            disabled={currentVideo === reels.length - 1}
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Create Button */}
      <div className="text-center mt-8">
        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
          Share Your Tech Tip
          <Play className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};
