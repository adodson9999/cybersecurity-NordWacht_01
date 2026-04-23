"use client";

import { useEffect, useState, use } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { supabase } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { Calendar as CalendarIcon, Clock, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Slot = { start: string; end: string; };

export default function RescheduleBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  
  const [status, setStatus] = useState<"loading_info" | "selecting_time" | "submitting" | "success" | "error">("loading_info");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [callType, setCallType] = useState<{slug: string, name: string, duration_min: number} | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slotsError, setSlotsError] = useState("");

  // 1. Fetch Booking Info
  useEffect(() => {
    async function fetchInfo() {
      try {
        const { data, error } = await supabase.functions.invoke('get-booking-info', {
          body: { token }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        setCallType(data.call_type);
        setStatus("selecting_time");
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || "Failed to load booking. The link may have expired.");
        setStatus("error");
      }
    }
    if (token) fetchInfo();
  }, [token]);

  // 2. Fetch Slots when Date changes (if in selecting_time phase)
  useEffect(() => {
    if (status === "selecting_time" && callType) {
      fetchSlots(selectedDate);
    }
  }, [status, selectedDate, callType]);

  async function fetchSlots(date: Date) {
    setIsLoadingSlots(true);
    setSlotsError("");
    setSelectedSlot(null);
    try {
      const startDate = date.toISOString();
      const endDate = addDays(date, 7).toISOString();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const { data, error: fnError } = await supabase.functions.invoke('get-available-slots', {
        body: { call_type: callType?.slug, start_date: startDate, end_date: endDate, timezone }
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      const slotsForSelectedDay = (data.slots as Slot[]).filter(s => isSameDay(new Date(s.start), date));
      setAvailableSlots(slotsForSelectedDay);
    } catch (err: any) {
      console.error(err);
      setSlotsError("Could not load available times. Please try again.");
    } finally {
      setIsLoadingSlots(false);
    }
  }

  async function handleResubmit() {
    if (!selectedSlot) return;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { data, error } = await supabase.functions.invoke('reschedule-booking', {
        body: { 
          token,
          new_slot_start: selectedSlot.start,
          new_slot_end: selectedSlot.end,
          timezone
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to reschedule. The slot may have been taken.");
      setStatus("error"); // Could change to selecting_time to let them try again
    }
  }

  const upcomingDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i));

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
        <Container>
          <div className="mx-auto max-w-2xl glass rounded-2xl p-6 md:p-10 shadow-2xl">
            {status === "loading_info" && (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-2xl font-bold">Loading...</h2>
              </div>
            )}

            {(status === "selecting_time" || status === "submitting") && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Reschedule {callType?.name}</h2>
                  <p className="text-muted-foreground mt-2">Pick a new time for your consultation.</p>
                </div>

                <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex gap-3 min-w-max">
                    {upcomingDays.map((date, i) => {
                      const isSelected = isSameDay(date, selectedDate);
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            "flex flex-col items-center justify-center rounded-xl border p-3 min-w-[70px] transition-all",
                            isSelected 
                              ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]" 
                              : "border-border bg-background hover:border-primary/50"
                          )}
                        >
                          <span className="text-xs font-medium uppercase opacity-80">{format(date, 'EEE')}</span>
                          <span className="text-xl font-bold mt-1">{format(date, 'd')}</span>
                          <span className="text-xs opacity-80 mt-0.5">{format(date, 'MMM')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-semibold flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    Available Times for {format(selectedDate, 'EEEE, MMMM d')}
                  </h3>

                  {isLoadingSlots ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : slotsError ? (
                    <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive text-center">
                      {slotsError}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                      No availability on this day. Please select another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {availableSlots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "rounded-lg border p-3 text-sm font-semibold transition-all hover:border-primary",
                            selectedSlot?.start === slot.start ? "bg-primary text-primary-foreground" : "bg-background/50 border-border hover:bg-primary/10 hover:text-primary"
                          )}
                        >
                          {format(new Date(slot.start), 'h:mm a')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                  <div className="text-sm">
                    {selectedSlot ? (
                      <span className="font-semibold text-primary">{format(new Date(selectedSlot.start), 'h:mm a')}</span>
                    ) : (
                      <span className="text-muted-foreground">Select a time</span>
                    )}
                  </div>
                  <Button 
                    onClick={handleResubmit} 
                    disabled={!selectedSlot || status === "submitting"}
                    className="min-w-[150px]"
                  >
                    {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm New Time"}
                  </Button>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Successfully Rescheduled!</h2>
                <p className="text-muted-foreground mt-2 mb-8">
                  Your new time is {selectedSlot && format(new Date(selectedSlot.start), 'EEEE, MMMM d @ h:mm a')}. You will receive an updated calendar invite shortly.
                </p>
                <Button asChild className="w-full">
                  <a href="/">Return to Home</a>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold">Action Failed</h2>
                <p className="text-muted-foreground mt-2 mb-8">
                  {errorMessage}
                </p>
                <div className="flex gap-3 w-full">
                  <Button onClick={() => setStatus("loading_info")} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                  <Button asChild className="flex-1">
                    <a href="/contact">Contact Us</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
