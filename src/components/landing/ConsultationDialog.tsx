"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { requestConsultation, type ConsultationState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

type ConsultationDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const initialState: ConsultationState = { success: false, message: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Submitting..." : "Submit Request"}
    </Button>
  );
}

export function ConsultationDialog({ open, setOpen }: ConsultationDialogProps) {
  const [state, formAction] = useFormState(requestConsultation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      const timer = setTimeout(() => {
        setOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success, setOpen]);
  
  // Reset form state when dialog is closed/reopened
  useEffect(() => {
    if (!open) {
      formRef.current?.reset();
      // A bit of a hack to reset the useFormState
      requestConsultation(initialState, new FormData());
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px]">
        {state.success ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h3 className="mt-4 text-xl font-semibold">Request Received!</h3>
            <p className="mt-2 text-muted-foreground">{state.message}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request a Consultation</DialogTitle>
              <DialogDescription>
                Fill out the form below and one of our experts will contact you shortly.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} ref={formRef} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" name="company" placeholder="Innovate Inc." required />
                {state.errors?.company && <p className="text-sm text-destructive">{state.errors.company[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea id="message" name="message" placeholder="Tell us about your project or needs..." />
                 {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
              </div>
              <DialogFooter className="pt-4">
                <SubmitButton />
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
