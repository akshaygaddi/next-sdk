"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Enhanced toast configuration
const TOAST_LIMIT = 3;  // Allow multiple toasts
const DEFAULT_TOAST_DURATION = 5000; // 5 seconds default
const TOAST_REMOVE_DELAY = 300; // Faster removal for better UX

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

interface ToasterToast extends ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  important?: boolean; // Important toasts bypass the TOAST_LIMIT
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
  CLEAR_ALL_TOASTS: "CLEAR_ALL_TOASTS",
} as const;

// Enhanced ID generation with timestamp
function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

type ActionType = typeof actionTypes;

type Action =
  | {
  type: ActionType["ADD_TOAST"];
  toast: ToasterToast;
}
  | {
  type: ActionType["UPDATE_TOAST"];
  toast: Partial<ToasterToast>;
}
  | {
  type: ActionType["DISMISS_TOAST"];
  toastId?: ToasterToast["id"];
}
  | {
  type: ActionType["REMOVE_TOAST"];
  toastId?: ToasterToast["id"];
}
  | {
  type: ActionType["CLEAR_ALL_TOASTS"];
};

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, duration: number = DEFAULT_TOAST_DURATION) => {
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId)!);
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, duration + TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: action.toast.important
          ? [action.toast, ...state.toasts]
          : [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
              ...t,
              open: false,
            }
            : t
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    case "CLEAR_ALL_TOASTS":
      state.toasts.forEach((toast) => {
        addToRemoveQueue(toast.id);
      });
      return {
        ...state,
        toasts: [],
      };
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

interface ToastOptions extends Partial<ToasterToast> {
  duration?: number;
  position?: ToastPosition;
  important?: boolean;
}

interface ToastFunction {
  (props: ToastOptions): { id: string; dismiss: () => void; update: (props: Partial<ToasterToast>) => void };
  success: (props: ToastOptions) => void;
  error: (props: ToastOptions) => void;
  warning: (props: ToastOptions) => void;
  info: (props: ToastOptions) => void;
}

const createToast = ({ ...props }: ToastOptions) => {
  const id = genId();
  const duration = props.duration ?? DEFAULT_TOAST_DURATION;

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  if (duration !== Infinity) {
    addToRemoveQueue(id, duration);
  }

  return {
    id,
    dismiss,
    update,
  };
};

const toast = Object.assign(createToast, {
  success: (props: ToastOptions) => createToast({ ...props, variant: 'success' }),
  error: (props: ToastOptions) => createToast({ ...props, variant: 'error' }),
  warning: (props: ToastOptions) => createToast({ ...props, variant: 'warning' }),
  info: (props: ToastOptions) => createToast({ ...props, variant: 'info' }),
  dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  clearAll: () => dispatch({ type: "CLEAR_ALL_TOASTS" }),
}) as ToastFunction;

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
  };
}

export { useToast, toast };