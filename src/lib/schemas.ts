import { z } from "zod";
import { validateIsraeliId } from "./israeli-id";
import { teams } from "./teams";

const teamCodes = teams.map((t) => t.code);

export const predictionSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "שם מלא חייב להכיל לפחות 2 תווים")
      .max(100, "שם ארוך מדי"),
    idNumber: z
      .string()
      .min(5, "תעודת זהות לא תקינה")
      .max(9, "תעודת זהות לא תקינה")
      .refine(validateIsraeliId, "מספר תעודת זהות לא תקין"),
    email: z.string().email("כתובת אימייל לא תקינה"),
    phone: z
      .string()
      .regex(/^05\d{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)"),
    teamA: z
      .string()
      .refine((v) => teamCodes.includes(v), "יש לבחור נבחרת"),
    teamB: z
      .string()
      .refine((v) => teamCodes.includes(v), "יש לבחור נבחרת"),
    scoreA: z
      .number()
      .int()
      .min(0, "תוצאה לא תקינה")
      .max(20, "תוצאה לא תקינה"),
    scoreB: z
      .number()
      .int()
      .min(0, "תוצאה לא תקינה")
      .max(20, "תוצאה לא תקינה"),
    termsAccepted: z.literal(true, {
      message: "יש לאשר את התקנון",
    }),
    honeypot: z.string().max(0).optional(),
  })
  .refine((data) => data.teamA !== data.teamB, {
    message: "יש לבחור שתי נבחרות שונות",
    path: ["teamB"],
  });

export type PredictionInput = z.infer<typeof predictionSchema>;
