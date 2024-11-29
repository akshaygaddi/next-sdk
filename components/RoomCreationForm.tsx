"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Loader2,
  Lock,
  Globe,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  type: z.enum(["public", "private"]),
  password: z.string().optional(),
  expiresIn: z.string().optional(),
});

export default function RoomCreationForm({ onRoomCreated, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "public",
      password: "",
      expiresIn: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const expiresAt = data.expiresIn
        ? new Date(
          Date.now() + parseInt(data.expiresIn) * 60 * 1000,
        ).toISOString()
        : null;

      const { data: room, error } = await supabase
        .from("rooms")
        .insert({
          name: data.name,
          type: data.type,
          password: data.type === "private" ? data.password : null,
          created_by: user.id,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your room has been created.",
      });

      onRoomCreated?.(room);
      onClose?.();
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !form.getValues("name")) {
      form.setError("name", { message: "Room name is required" });
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const progress = (step / 3) * 100;

  return (
    <div className="space-y-6">
      <Progress value={progress} className="h-2" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 bg-card p-6 rounded-lg border shadow-sm"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Name your room</h3>
              <p className="text-sm text-muted-foreground">
                Choose a memorable name for your chat room
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  placeholder="Enter room name..."
                  {...form.register("name")}
                  className="transition-all"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 bg-card p-6 rounded-lg border shadow-sm"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Room Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Choose who can access your room
              </p>
            </div>
            <RadioGroup
              defaultValue={form.getValues("type")}
              onValueChange={(value) => form.setValue("type", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="public" id="public" />
                <div className="flex-1">
                  <Label htmlFor="public" className="text-base font-medium">
                    <Globe className="h-4 w-4 inline mr-2" />
                    Public Room
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Anyone can join this room
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="private" id="private" />
                <div className="flex-1">
                  <Label htmlFor="private" className="text-base font-medium">
                    <Lock className="h-4 w-4 inline mr-2" />
                    Private Room
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only users with password can join
                  </p>
                </div>
              </div>
            </RadioGroup>

            {form.watch("type") === "private" && (
              <div className="space-y-2">
                <Label htmlFor="password">Room Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password..."
                  {...form.register("password")}
                />
              </div>
            )}
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 bg-card p-6 rounded-lg border shadow-sm"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Room Duration</h3>
              <p className="text-sm text-muted-foreground">
                Set how long the room should remain active
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expiresIn">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Expires in (minutes)
                </Label>
                <Input
                  id="expiresIn"
                  type="number"
                  placeholder="Leave empty for no expiration"
                  {...form.register("expiresIn")}
                />
                <p className="text-sm text-muted-foreground">
                  Optional: Set a time limit for your room
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
