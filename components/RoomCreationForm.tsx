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
import RoomPrivacySelection from "@/components/RoomPrivacySelection";


const FORM_STEPS = [
  {
    id: "name",
    title: "Room Name",
    description: "Choose a memorable name for your chat room (max 12 characters)",
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

const DURATION_PRESETS = [
  { label: "15 min", value: "15" },
  { label: "30 min", value: "30" },
  { label: "45 min", value: "45" },
  { label: "60 min", value: "60" },
  { label: "90 min", value: "90" },
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
        } else if (formData.name.length > 12) {
          newErrors.name = "Room name cannot exceed 12 characters";
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
        } else if (formData.expiresIn > 100) {
          newErrors.expiresIn = "Duration cannot exceed 100 minutes";
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

    if (step < FORM_STEPS.length - 1) {
      handleNext(e);
      return;
    }

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
                onChange={(e) => {
                  const value = e.target.value.slice(0, 12); // Limit to 12 characters
                  setFormData({ ...formData, name: value });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNext(e);
                  }
                }}
                placeholder="Enter room name..."
                error={errors.name}
                autoFocus
                maxLength={12}
              />
              <div className="flex justify-between">
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {formData.name.length}/12
                </p>
              </div>
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
            <RoomPrivacySelection
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
            />

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
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <Button
                    key={preset.value}
                    type="button"
                    variant={formData.expiresIn === preset.value ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, expiresIn: preset.value })}
                    className="flex-1"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresIn">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Custom Duration (1-100 minutes)
                </Label>
                <Input
                  id="expiresIn"
                  type="number"
                  value={formData.expiresIn}
                  onChange={(e) => {
                    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || ""));
                    setFormData({ ...formData, expiresIn: value.toString() });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Enter custom duration..."
                  error={errors.expiresIn}
                  min="1"
                  max="100"
                />
                {errors.expiresIn && (
                  <p className="text-sm text-destructive">{errors.expiresIn}</p>
                )}
              </div>
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