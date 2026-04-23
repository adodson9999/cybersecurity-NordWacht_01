"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5;

type CallType = {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration_min: number;
  price_display: string;
};

type Slot = {
  start: string;
  end: string;
};

export function BookingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [callTypes, setCallTypes] = useState<CallType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  
  const [selectedType, setSelectedType] = useState<CallType | null>(null);
  
  // Date & Time selection
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // 1. Fetch Call Types on mount
  useEffect(() => {
    async function fetchCallTypes() {
      const { data, error } = await supabase
        .from('call_types')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });
        
      if (!error && data) {
        setCallTypes(data);
      }
      setIsLoadingTypes(false);
    }
    fetchCallTypes();
  }, []);

  // 2. Fetch Slots when step 2 is active or selectedDate changes
  useEffect(() => {
    if (step === 2 && selectedType) {
      fetchSlots(selectedDate);
    }
  }, [step, selectedDate, selectedType]);

  async function fetchSlots(date: Date) {
    setIsLoadingSlots(true);
    setError(null);
    setSelectedSlot(null);
    try {
      // Look 7 days ahead from selected date to ensure we have slots
      const startDate = date.toISOString();
      const endDate = addDays(date, 7).toISOString();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const { data, error: fnError } = await supabase.functions.invoke('get-available-slots', {
        body: {
          call_type: selectedType?.slug,
          start_date: startDate,
          end_date: endDate,
          timezone
        }
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      // Filter slots strictly for the selected date
      const slotsForSelectedDay = (data.slots as Slot[]).filter(s => 
        isSameDay(new Date(s.start), date)
      );
      
      setAvailableSlots(slotsForSelectedDay);
    } catch (err: any) {
      console.error("Error fetching slots:", err);
      setError("Could not load available times. Please try again.");
    } finally {
      setIsLoadingSlots(false);
    }
  }

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { data, error: fnError } = await supabase.functions.invoke('create-booking', {
        body: {
          ...formData,
          call_type_id: selectedType?.id,
          slot_start: selectedSlot?.start,
          slot_end: selectedSlot?.end,
          timezone
        }
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setBookingSuccessId(data.booking_id);
      setStep(5); // Success step
    } catch (err: any) {
      setError(err.message || "Failed to complete booking. The slot might have just been taken.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate 7 days for the date picker header
  const upcomingDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i));

  return (
    <div className="mx-auto max-w-3xl glass rounded-2xl p-6 md:p-10 shadow-2xl shadow-primary/5">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="mb-10 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-secondary/20 -z-10" />
          <div 
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-500 ease-out -z-10" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                step >= i ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]" : "bg-background border border-border text-muted-foreground"
              )}
            >
              {i}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: Select Service */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Select Service</h2>
              <p className="text-muted-foreground mt-2">What would you like to discuss?</p>
            </div>

            {isLoadingTypes ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : callTypes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No services available at the moment.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {callTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type);
                      setStep(2);
                    }}
                    className={cn(
                      "cursor-pointer rounded-xl border bg-background/50 p-6 transition-all duration-200",
                      "hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]",
                      selectedType?.id === type.id && "border-primary ring-1 ring-primary bg-primary/10"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{type.name}</h3>
                      <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {type.price_display}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{type.description}</p>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground font-medium">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      {type.duration_min} minutes
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: Select Date & Time */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Pick a Time</h2>
                <p className="text-sm text-primary mt-1">{selectedType?.name} ({selectedType?.duration_min} min)</p>
              </div>
              <div className="w-9" /> {/* Spacer */}
            </div>

            {/* Date Selection */}
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

            {/* Time Slots */}
            <div>
              <h3 className="mb-4 text-sm font-semibold flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                Available Times for {format(selectedDate, 'EEEE, MMMM d')}
              </h3>

              {isLoadingSlots ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive text-center">
                  {error}
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
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep(3);
                      }}
                      className="rounded-lg border border-border bg-background/50 p-3 text-sm font-semibold transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                    >
                      {format(new Date(slot.start), 'h:mm a')}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Times displayed in {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </motion.div>
        )}

        {/* STEP 3: Enter Details */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <button onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold">Your Details</h2>
              <div className="w-9" />
            </div>

            <div className="mb-6 rounded-xl bg-primary/5 border border-primary/20 p-4">
              <p className="text-sm">
                <span className="font-semibold text-primary">{selectedType?.name}</span> scheduled for<br/>
                <span className="font-bold">{selectedSlot && format(new Date(selectedSlot.start), 'EEEE, MMMM d, yyyy @ h:mm a')}</span>
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">Anything we should know? (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full mt-4" size="lg">
                Continue to Review <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}

        {/* STEP 4: Review & Confirm */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <button onClick={() => setStep(3)} className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold">Review Booking</h2>
              <div className="w-9" />
            </div>

            <div className="space-y-6 rounded-xl border border-border bg-background/50 p-6">
              <div className="flex items-start gap-4 pb-6 border-b border-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedType?.name}</h3>
                  <p className="text-primary font-medium mt-1">
                    {selectedSlot && format(new Date(selectedSlot.start), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selectedSlot && format(new Date(selectedSlot.start), 'h:mm a')} - {selectedSlot && format(new Date(selectedSlot.end), 'h:mm a')} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Name</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Email</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                {formData.company && (
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Company</span>
                    <span className="font-medium">{formData.company}</span>
                  </div>
                )}
                {formData.phone && (
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Phone</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              onClick={handleBookingSubmit} 
              disabled={isSubmitting}
              className="w-full mt-8 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-shadow" 
              size="lg"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Booking...</>
              ) : (
                <>Confirm & Book Now</>
              )}
            </Button>
          </motion.div>
        )}

        {/* STEP 5: Success */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-8">
              Thanks {formData.name.split(' ')[0]}. An email with a calendar invite has been sent to <strong>{formData.email}</strong>.
            </p>

            <div className="inline-block rounded-xl bg-background border border-border p-6 text-left max-w-sm w-full mx-auto">
              <h4 className="font-bold mb-2 text-sm uppercase text-muted-foreground">Booking Details</h4>
              <p className="font-medium">{selectedType?.name}</p>
              <p className="text-sm mt-1">{selectedSlot && format(new Date(selectedSlot.start), 'EEEE, MMMM d, yyyy')}</p>
              <p className="text-sm mt-1">{selectedSlot && format(new Date(selectedSlot.start), 'h:mm a')}</p>
            </div>

            <div className="mt-10">
              <Button asChild variant="outline">
                <a href="/">Return to Home</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
