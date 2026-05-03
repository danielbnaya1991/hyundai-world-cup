"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TeamSelector } from "./TeamSelector";
import { ScorePicker } from "./ScorePicker";
import { TermsCheckbox } from "./TermsCheckbox";
import { LiveScoreboard } from "./LiveScoreboard";
import { CarCarousel } from "./CarCarousel";
import { FlagImage } from "./FlagImage";
import { predictionSchema, type PredictionInput } from "@/lib/schemas";
import { teams } from "@/lib/teams";
import { DEADLINE } from "@/lib/constants";
import { Loader2, ArrowRight, ArrowLeft, Trophy, Zap, Battery, Timer, Gauge } from "lucide-react";

interface PredictionFormProps {
  onSuccess: (serialNumber: string) => void;
}

const STEPS = [
  { id: "teams", label: "נבחרות" },
  { id: "score", label: "תוצאה" },
  { id: "details", label: "פרטים ושליחה" },
] as const;

export function PredictionForm({ onSuccess }: PredictionFormProps) {
  const [step, setStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Track which step the user last tried to advance from (-1 = none)
  const [triedStep, setTriedStep] = React.useState(-1);
  const isExpired = new Date() >= DEADLINE;

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PredictionInput>({
    resolver: zodResolver(predictionSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      fullName: "",
      idNumber: "",
      email: "",
      phone: "",
      teamA: "",
      teamB: "",
      scoreA: 0,
      scoreB: 0,
      termsAccepted: false as unknown as true,
      honeypot: "",
    },
  });

  // Only show errors if user tried to advance FROM this exact step
  const showErrors = triedStep === step;

  const teamA = watch("teamA");
  const teamB = watch("teamB");
  const scoreA = watch("scoreA");
  const scoreB = watch("scoreB");
  const selectedTeamA = teams.find((t) => t.code === teamA);
  const selectedTeamB = teams.find((t) => t.code === teamB);

  if (isExpired) {
    return (
      <section className="py-24 px-6 text-center">
        <Trophy className="w-14 h-14 mx-auto mb-4 text-[#4285F4]" />
        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">ההרשמה למבצע נסגרה</h2>
        <p className="text-[#71717a]">תודה לכל המשתתפים! נתראה בגמר.</p>
      </section>
    );
  }

  const nextStep = async () => {
    setTriedStep(step);
    let fieldsToValidate: (keyof PredictionInput)[] = [];
    if (step === 0) fieldsToValidate = ["teamA", "teamB"];
    if (step === 1) fieldsToValidate = ["scoreA", "scoreB"];
    const valid = await trigger(fieldsToValidate);
    if (valid) {
      setTriedStep(-1);
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setTriedStep(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (data: PredictionInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 409 && result.serialNumber) {
          toast.info("כבר נרשמת למבצע!", { description: `מספר סידורי: ${result.serialNumber}` });
          onSuccess(result.serialNumber);
          return;
        }
        throw new Error(result.error || "שגיאה בשליחת הטופס");
      }
      onSuccess(result.serialNumber);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "שגיאה בשליחת הטופס");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* ─── IONIQ 5 Section ─── */}
      <section className="relative pt-12 pb-10 bg-gradient-to-b from-[#1a3a6e] via-[#1e4a8a] to-[#0f2a52] overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large gradient orb */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4285F4]/15 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#4285F4]/20 rounded-full blur-[100px]" />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          {/* Diagonal light streak */}
          <div className="absolute top-0 right-0 w-full h-full opacity-[0.04]" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)" }} />
        </div>

        {/* Header — padded */}
        <div className="relative text-center mb-6 px-4 sm:px-6">
          <p className="text-[#7eb3ff] text-sm tracking-[0.35em] font-semibold mb-2">
            המכונית של המחר
          </p>
          <h2 className="text-[36px] sm:text-[56px] font-bold text-white leading-[1.05] tracking-tight">
            IONIQ 5
          </h2>
        </div>

        {/* Car Carousel — edge-to-edge on mobile */}
        <div className="relative w-full mb-6">
          <CarCarousel />
        </div>

        {/* Specs strip — padded */}
        <div className="relative px-4 sm:px-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 py-4 max-w-md mx-auto">
            {[
              { icon: Zap, value: "חשמלי", sub: "100%" },
              { icon: Battery, value: "570 ק\"מ", sub: "טווח" },
              { icon: Timer, value: "18 דק׳", sub: "טעינה מהירה" },
              { icon: Gauge, value: "325 כ\"ס", sub: "הספק" },
            ].map((spec) => (
              <div key={spec.sub} className="flex flex-col items-center gap-1 text-center">
                <spec.icon className="h-5 w-5 text-[#7eb3ff]" />
                <p className="text-white font-bold text-sm sm:text-base leading-none">{spec.value}</p>
                <p className="text-white/50 text-xs">{spec.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-white/30 text-sm">
            החל מ-₪214,990 · רכב SUV חשמלי עטור פרסים
          </p>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="max-w-xs mx-auto px-6 pt-10 pb-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e8ecf2]" />
          </div>
          <div className="relative bg-white px-4">
            <span className="text-[#4285F4] text-sm font-semibold tracking-[0.15em]">
              הניחוש שלכם
            </span>
          </div>
        </div>
      </div>

      {/* ─── Wizard ─── */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-md mx-auto">
          {/* Step dots */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
            {STEPS.map((s, i) => (
              <button
                type="button"
                key={s.id}
                onClick={() => { if (i < step) { setTriedStep(-1); setStep(i); } }}
                className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-300 cursor-pointer ${i <= step ? "" : "opacity-40"}`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                    i === step
                      ? "bg-[#4285F4] text-white scale-110"
                      : i < step
                        ? "bg-[#4285F4]/10 text-[#4285F4]"
                        : "bg-[#f4f7fc] text-[#c4c4c8]"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs sm:text-sm font-medium ${i === step ? "text-[#1a1a1a]" : "text-[#a1a1aa]"}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          <div>
            {/* Honeypot */}
            <div className="sr-only" aria-hidden="true">
              <input type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
            </div>

            <div className="min-h-[340px] sm:min-h-[380px]">
            {/* ── Step 0: Teams ── */}
            <div className={step === 0 ? "animate-[fadeInUp_0.3s_ease-out]" : "hidden"}>
              <h3 className="text-2xl font-bold text-[#1a1a1a] text-center mb-1">
                מי ישחק בגמר?
              </h3>
              <p className="text-[#a1a1aa] text-base text-center mb-6">
                בחרו את שתי הנבחרות שיתמודדו בגמר המונדיאל
              </p>

              <div>
                <div className="bg-[#f9fafb] rounded-2xl p-5 border border-[#f0f1f3]">
                  <Label className="text-[#71717a] text-xs tracking-wider mb-2.5 block font-semibold">
                    נבחרת ראשונה
                  </Label>
                  <Controller
                    name="teamA"
                    control={control}
                    render={({ field }) => (
                      <TeamSelector
                        value={field.value}
                        onChange={field.onChange}
                        excludeTeam={teamB}
                        placeholder="בחרו נבחרת..."
                        error={showErrors ? errors.teamA?.message : undefined}
                      />
                    )}
                  />
                </div>

                <div className="flex justify-center -my-[14px] relative z-10">
                  <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-[#e8ecf2] flex items-center justify-center">
                    <span className="text-[#4285F4] font-bold text-[10px] tracking-wider">VS</span>
                  </div>
                </div>

                <div className="bg-[#f9fafb] rounded-2xl p-5 border border-[#f0f1f3]">
                  <Label className="text-[#71717a] text-xs tracking-wider mb-2.5 block font-semibold">
                    נבחרת שנייה
                  </Label>
                  <Controller
                    name="teamB"
                    control={control}
                    render={({ field }) => (
                      <TeamSelector
                        value={field.value}
                        onChange={field.onChange}
                        excludeTeam={teamA}
                        placeholder="בחרו נבחרת..."
                        error={showErrors ? errors.teamB?.message : undefined}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* ── Step 1: Score ── */}
            <div className={step === 1 ? "animate-[fadeInUp_0.3s_ease-out]" : "hidden"}>
              <h3 className="text-xl font-bold text-[#1a1a1a] text-center mb-1">
                מה תהיה התוצאה?
              </h3>
              <p className="text-[#a1a1aa] text-sm text-center mb-8">
                90 דקות, ללא הארכות
              </p>

              <div className="bg-[#f9fafb] rounded-2xl p-5 sm:p-8 border border-[#f0f1f3]">
                <div className="flex items-center justify-center gap-4 sm:gap-12">
                  <div className="flex-1 text-center">
                    {selectedTeamA && (
                      <div className="flex justify-center mb-1.5">
                        <FlagImage iso={selectedTeamA.iso} size={36} className="shadow-sm" />
                      </div>
                    )}
                    <p className="text-[#1a1a1a] font-semibold text-sm mb-5 truncate">
                      {selectedTeamA?.name}
                    </p>
                    <Controller
                      name="scoreA"
                      control={control}
                      render={({ field }) => (
                        <ScorePicker value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-1 mt-8">
                    <span className="text-3xl font-light text-[#d4d4d8]">:</span>
                  </div>

                  <div className="flex-1 text-center">
                    {selectedTeamB && (
                      <div className="flex justify-center mb-1.5">
                        <FlagImage iso={selectedTeamB.iso} size={36} className="shadow-sm" />
                      </div>
                    )}
                    <p className="text-[#1a1a1a] font-semibold text-sm mb-5 truncate">
                      {selectedTeamB?.name}
                    </p>
                    <Controller
                      name="scoreB"
                      control={control}
                      render={({ field }) => (
                        <ScorePicker value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Step 2: Details ── */}
            <div className={step === 2 ? "animate-[fadeInUp_0.3s_ease-out]" : "hidden"}>
              <h3 className="text-xl font-bold text-[#1a1a1a] text-center mb-1">
                כמעט שם!
              </h3>
              <p className="text-[#a1a1aa] text-sm text-center mb-6">
                מלאו את הפרטים ושלחו את הניחוש
              </p>

              <div className="bg-[#f9fafb] rounded-2xl p-5 sm:p-6 border border-[#f0f1f3] space-y-4 mb-5">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-[#71717a] text-sm">שם מלא</Label>
                  <Input
                    id="fullName"
                    placeholder="ישראל ישראלי"
                    {...register("fullName")}
                    aria-invalid={showErrors && !!errors.fullName}
                    className="h-12 rounded-xl bg-white border-[#e8ecf2] text-[#1a1a1a] placeholder:text-[#c4c4c8] focus:border-[#4285F4] focus:ring-[#4285F4]/10"
                  />
                  {showErrors && errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="idNumber" className="text-[#71717a] text-sm">תעודת זהות</Label>
                  <Input
                    id="idNumber"
                    placeholder="מספר תעודת זהות"
                    inputMode="numeric"
                    maxLength={9}
                    {...register("idNumber")}
                    aria-invalid={showErrors && !!errors.idNumber}
                    className="h-12 rounded-xl bg-white border-[#e8ecf2] text-[#1a1a1a] placeholder:text-[#c4c4c8] focus:border-[#4285F4] focus:ring-[#4285F4]/10"
                  />
                  {showErrors && errors.idNumber && <p className="text-red-500 text-xs">{errors.idNumber.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[#71717a] text-sm">אימייל</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      dir="ltr"
                      {...register("email")}
                      aria-invalid={showErrors && !!errors.email}
                      className="h-12 rounded-xl bg-white border-[#e8ecf2] text-[#1a1a1a] placeholder:text-[#c4c4c8] text-left focus:border-[#4285F4] focus:ring-[#4285F4]/10"
                    />
                    {showErrors && errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-[#71717a] text-sm">טלפון נייד</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0501234567"
                      dir="ltr"
                      inputMode="tel"
                      maxLength={10}
                      {...register("phone")}
                      aria-invalid={showErrors && !!errors.phone}
                      className="h-12 rounded-xl bg-white border-[#e8ecf2] text-[#1a1a1a] placeholder:text-[#c4c4c8] text-left focus:border-[#4285F4] focus:ring-[#4285F4]/10"
                    />
                    {showErrors && errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <Controller
                  name="termsAccepted"
                  control={control}
                  render={({ field }) => (
                    <TermsCheckbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                      error={showErrors ? errors.termsAccepted?.message : undefined}
                    />
                  )}
                />
              </div>
            </div>

            </div>

            {/* Live scoreboard */}
            <div className="mt-6">
              <LiveScoreboard teamA={teamA} teamB={teamB} scoreA={scoreA} scoreB={scoreB} />
            </div>

            {/* ── Navigation ── */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 h-12 text-sm border-[#e8ecf2] text-[#71717a] hover:text-[#1a1a1a] hover:bg-[#f9fafb] bg-white cursor-pointer rounded-xl"
                >
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                  הקודם
                </Button>
              )}

              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 h-12 text-sm bg-[#4285F4] hover:bg-[#3270e0] text-white cursor-pointer rounded-xl transition-all hover:shadow-[0_4px_24px_rgba(66,133,244,0.3)]"
                >
                  הבא
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => { setTriedStep(step); handleSubmit(onSubmit)(); }}
                  className="flex-1 h-12 text-sm bg-[#4285F4] hover:bg-[#3270e0] text-white cursor-pointer rounded-xl transition-all hover:shadow-[0_4px_24px_rgba(66,133,244,0.3)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin ml-2" />
                      שולח...
                    </>
                  ) : (
                    "שליחת הניחוש"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
