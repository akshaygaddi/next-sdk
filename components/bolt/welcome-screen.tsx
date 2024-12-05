import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Lock, Hash } from "lucide-react";

export default function WelcomeScreen() {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Real-time Chat",
      description: "Engage in live conversations with instant message delivery",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Group Discussions",
      description: "Create or join rooms for focused group discussions",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Private Rooms",
      description: "Set up password-protected rooms for private conversations",
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center space-y-6"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Hash className="h-10 w-10 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Chat Rooms
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Connect with others in real-time through themed chat rooms and engaging discussions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Select a room from the sidebar or create your own to begin chatting
          </p>
          <Button size="lg" className="rounded-full px-8">
            Browse Rooms
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}