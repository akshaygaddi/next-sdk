import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "motion/react";
import {
  Clock,
  Globe,
  Lock,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const FORM_STEPS = [
  {
    id: "name",
    title: "Room Name",
    description: "Choose a memorable name for your chat room",
  },
  {
    id: "type",
    title: "Room Privacy",
    description: "Choose who can access your room",
  },
  {
    id: "duration",
    title: "Room Duration",
    description: "Set how long the room should remain active",
  },
];

export default function RoomCreationForm({ onRoomCreated, onClose }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "public",
    password: "",
    expiresIn: "",
  });
  const [errors, setErrors] = useState({});

  const supabase = createClient();

  const validateStep = (stepIndex) => {
    const newErrors = {};
    switch (stepIndex) {
      case 0:
        if (!formData.name.trim()) {
          newErrors.name = "Room name is required";
        } else if (formData.name.length < 3) {
          newErrors.name = "Room name must be at least 3 characters";
        }
        break;
      case 1:
        if (formData.type === "private" && !formData.password) {
          newErrors.password = "Password is required for private rooms";
        }
        break;
      case 2:
        if (formData.expiresIn && (isNaN(formData.expiresIn) || formData.expiresIn < 0)) {
          newErrors.expiresIn = "Please enter a valid duration";
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e?.preventDefault();
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If not on the last step, just go to next step
    if (step < FORM_STEPS.length - 1) {
      handleNext(e);
      return;
    }

    // On last step, validate before submitting
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const expiresAt = formData.expiresIn
        ? new Date(Date.now() + parseInt(formData.expiresIn) * 60 * 1000).toISOString()
        : null;

      const { data: room, error } = await supabase
        .from("rooms")
        .insert({
          name: formData.name,
          type: formData.type,
          password: formData.type === "private" ? formData.password : null,
          created_by: user.id,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join creator to the room
      await supabase
        .from("room_participants")
        .insert({ room_id: room.id, user_id: user.id });

      toast({
        title: "Success!",
        description: "Room created successfully.",
      });

      onRoomCreated?.(room);
      onClose?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create room",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((step + 1) / FORM_STEPS.length) * 100;

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNext(e);
                  }
                }}
                placeholder="Enter room name..."
                error={errors.name}
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <RadioGroup
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="public" id="public" />
                <div>
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
                <div>
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

            {formData.type === "private" && (
              <div className="space-y-2">
                <Label htmlFor="password">Room Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNext(e);
                    }
                  }}
                  placeholder="Enter password..."
                  error={errors.password}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="expiresIn">
                <Clock className="h-4 w-4 inline mr-2" />
                Duration (minutes)
              </Label>
              <Input
                id="expiresIn"
                type="number"
                value={formData.expiresIn}
                onChange={(e) =>
                  setFormData({ ...formData, expiresIn: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Leave empty for no expiration"
                error={errors.expiresIn}
              />
              {errors.expiresIn && (
                <p className="text-sm text-destructive">{errors.expiresIn}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Optional: Set a time limit for your room
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Progress value={progress} className="h-1" />

      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-semibold">
          {FORM_STEPS[step].title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {FORM_STEPS[step].description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0 || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < FORM_STEPS.length - 1 ? (
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="min-w-[100px]"
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
          )}
        </div>
      </form>
    </div>
  );
}