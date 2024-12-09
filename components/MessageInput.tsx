// import React, { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   MessageSquare,
//   Code,
//   Link,
//   BarChart2,
//   Image as ImageIcon,
//   FileVideo,
//   Mic,
//   File,
//   Send,
//   X,
//   Upload,
// } from "lucide-react";
//
// const CODE_LANGUAGES = [
//   { value: "javascript", label: "JavaScript" },
//   { value: "python", label: "Python" },
//   { value: "typescript", label: "TypeScript" },
//   { value: "html", label: "HTML" },
//   { value: "css", label: "CSS" },
//   { value: "sql", label: "SQL" },
//   { value: "json", label: "JSON" },
// ];
//
// const MessageInput = ({ onSendMessage, isDisabled, roomId }) => {
//   // Common state
//   const [activeTab, setActiveTab] = useState("text");
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);
//
//   // Text input state
//   const [textMessage, setTextMessage] = useState("");
//
//   // Code input state
//   const [code, setCode] = useState("");
//   const [codeLanguage, setCodeLanguage] = useState("javascript");
//
//   // Poll input state
//   const [pollQuestion, setPollQuestion] = useState("");
//   const [pollOptions, setPollOptions] = useState(["", ""]);
//
//   // Link input state
//   const [url, setUrl] = useState("");
//   const [linkDescription, setLinkDescription] = useState("");
//
//   // File upload state
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//
//   const resetState = () => {
//     setTextMessage("");
//     setCode("");
//     setCodeLanguage("javascript");
//     setPollQuestion("");
//     setPollOptions(["", ""]);
//     setUrl("");
//     setLinkDescription("");
//     setUploadedFile(null);
//     setUploadProgress(0);
//   };
//
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (isDisabled) return;
//
//     let messageContent;
//     let messageType;
//
//     switch (activeTab) {
//       case "text":
//         if (!textMessage.trim()) return;
//         messageContent = { text: textMessage.trim() };
//         messageType = "text";
//         break;
//
//       case "code":
//         if (!code.trim()) return;
//         messageContent = {
//           code: code.trim(),
//           language: codeLanguage,
//         };
//         messageType = "code";
//         break;
//
//       case "poll":
//         if (
//           !pollQuestion.trim() ||
//           pollOptions.filter((opt) => opt.trim()).length < 2
//         )
//           return;
//         messageContent = {
//           question: pollQuestion.trim(),
//           options: pollOptions.filter((opt) => opt.trim()),
//           votes: new Array(pollOptions.filter((opt) => opt.trim()).length).fill(
//             0,
//           ),
//         };
//         messageType = "poll";
//         break;
//
//       case "link":
//         if (!url.trim()) return;
//         messageContent = {
//           url: url.trim(),
//           title: url.trim(), // You might want to fetch the title from the URL
//           description: linkDescription.trim(),
//         };
//         messageType = "link";
//         break;
//
//       case "media":
//         if (!uploadedFile) return;
//         messageContent = {
//           url: uploadedFile.url,
//           name: uploadedFile.name,
//           type: uploadedFile.type,
//           size: uploadedFile.size,
//         };
//         messageType = getMediaType(uploadedFile.type);
//         break;
//
//       default:
//         return;
//     }
//
//     await onSendMessage(messageContent, messageType);
//     resetState();
//     setActiveTab("text");
//   };
//
//   const getMediaType = (mimeType) => {
//     if (mimeType.startsWith("image/")) return "image";
//     if (mimeType.startsWith("video/")) return "video";
//     if (mimeType.startsWith("audio/")) return "voice";
//     return "file";
//   };
//
//   const handleFileSelect = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//
//     // Here you would typically upload to your storage
//     // For now, we'll simulate it
//     setIsUploading(true);
//     setUploadProgress(0);
//
//     // Simulate upload progress
//     const interval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setIsUploading(false);
//           setUploadedFile({
//             url: URL.createObjectURL(file),
//             name: file.name,
//             type: file.type,
//             size: file.size,
//           });
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 200);
//   };
//
//   return (
//     <div className="border-t bg-background">
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
//         <TabsList className="mb-4">
//           <TabsTrigger value="text" className="gap-2">
//             <MessageSquare className="h-4 w-4" />
//             Text
//           </TabsTrigger>
//           <TabsTrigger value="code" className="gap-2">
//             <Code className="h-4 w-4" />
//             Code
//           </TabsTrigger>
//           <TabsTrigger value="poll" className="gap-2">
//             <BarChart2 className="h-4 w-4" />
//             Poll
//           </TabsTrigger>
//           <TabsTrigger value="link" className="gap-2">
//             <Link className="h-4 w-4" />
//             Link
//           </TabsTrigger>
//           <TabsTrigger value="media" className="gap-2">
//             <Upload className="h-4 w-4" />
//             Media
//           </TabsTrigger>
//         </TabsList>
//
//         <form onSubmit={handleSendMessage} className="space-y-4">
//           <TabsContent value="text">
//             <div className="flex items-center gap-2">
//               <Input
//                 value={textMessage}
//                 onChange={(e) => setTextMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1"
//                 disabled={isDisabled}
//               />
//               <Button
//                 type="submit"
//                 disabled={!textMessage.trim() || isDisabled}
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
//           </TabsContent>
//
//           <TabsContent value="code" className="space-y-4">
//             <Select value={codeLanguage} onValueChange={setCodeLanguage}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select language" />
//               </SelectTrigger>
//               <SelectContent>
//                 {CODE_LANGUAGES.map((lang) => (
//                   <SelectItem key={lang.value} value={lang.value}>
//                     {lang.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Textarea
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               placeholder="Paste your code here..."
//               className="font-mono min-h-[150px]"
//             />
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={!code.trim() || isDisabled}
//             >
//               Share Code
//             </Button>
//           </TabsContent>
//
//           <TabsContent value="poll" className="space-y-4">
//             <Input
//               placeholder="Poll question"
//               value={pollQuestion}
//               onChange={(e) => setPollQuestion(e.target.value)}
//             />
//             {pollOptions.map((option, index) => (
//               <div key={index} className="flex gap-2">
//                 <Input
//                   placeholder={`Option ${index + 1}`}
//                   value={option}
//                   onChange={(e) => {
//                     const newOptions = [...pollOptions];
//                     newOptions[index] = e.target.value;
//                     setPollOptions(newOptions);
//                   }}
//                 />
//                 {pollOptions.length > 2 && (
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => {
//                       setPollOptions(pollOptions.filter((_, i) => i !== index));
//                     }}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//             ))}
//             {pollOptions.length < 6 && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setPollOptions([...pollOptions, ""])}
//                 className="w-full"
//               >
//                 Add Option
//               </Button>
//             )}
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={
//                 !pollQuestion.trim() ||
//                 pollOptions.filter((opt) => opt.trim()).length < 2 ||
//                 isDisabled
//               }
//             >
//               Create Poll
//             </Button>
//           </TabsContent>
//
//           <TabsContent value="link" className="space-y-4">
//             <Input
//               placeholder="Paste URL"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//             />
//             <Textarea
//               placeholder="Add a description (optional)"
//               value={linkDescription}
//               onChange={(e) => setLinkDescription(e.target.value)}
//             />
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={!url.trim() || isDisabled}
//             >
//               Share Link
//             </Button>
//           </TabsContent>
//
//           <TabsContent value="media" className="space-y-4">
//             <input
//               ref={fileInputRef}
//               type="file"
//               className="hidden"
//               onChange={handleFileSelect}
//               accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
//             />
//
//             {!uploadedFile ? (
//               <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
//                 <div className="flex justify-center gap-4">
//                   <ImageIcon className="h-6 w-6 text-muted-foreground" />
//                   <FileVideo className="h-6 w-6 text-muted-foreground" />
//                   <Mic className="h-6 w-6 text-muted-foreground" />
//                   <File className="h-6 w-6 text-muted-foreground" />
//                 </div>
//                 <div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={isDisabled}
//                   >
//                     Choose File
//                   </Button>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Support for images, videos, voice messages, and documents
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="border rounded-lg p-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       {getMediaType(uploadedFile.type) === "image" && (
//                         <img
//                           src={uploadedFile.url}
//                           alt="Preview"
//                           className="h-10 w-10 rounded object-cover"
//                         />
//                       )}
//                       <div>
//                         <p className="text-sm font-medium">
//                           {uploadedFile.name}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => {
//                         setUploadedFile(null);
//                         setUploadProgress(0);
//                       }}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={!uploadedFile || isDisabled}
//                 >
//                   Send File
//                 </Button>
//               </div>
//             )}
//
//             {isUploading && (
//               <div className="space-y-2">
//                 <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-primary transition-all duration-300"
//                     style={{ width: `${uploadProgress}%` }}
//                   />
//                 </div>
//                 <p className="text-xs text-muted-foreground text-center">
//                   Uploading... {uploadProgress}%
//                 </p>
//               </div>
//             )}
//           </TabsContent>
//         </form>
//       </Tabs>
//     </div>
//   );
// };
//
// export default MessageInput;
