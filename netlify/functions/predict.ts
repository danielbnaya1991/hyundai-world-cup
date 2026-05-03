import type { Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Israeli ID validation (Luhn-like check digit)
function validateIsraeliId(id: string): boolean {
  const cleaned = id.replace(/[\s-]/g, "");
  if (!/^\d{5,9}$/.test(cleaned)) return false;
  const padded = cleaned.padStart(9, "0");
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(padded[i]) * ((i % 2) + 1);
    if (digit > 9) digit -= 9;
    sum += digit;
  }
  return sum % 10 === 0;
}

const DEADLINE = new Date("2026-06-11T00:00:00+03:00");

const predictionSchema = z
  .object({
    fullName: z.string().min(2, "שם מלא חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי"),
    idNumber: z.string().min(5, "תעודת זהות לא תקינה").max(9, "תעודת זהות לא תקינה").refine(validateIsraeliId, "מספר תעודת זהות לא תקין"),
    email: z.string().email("כתובת אימייל לא תקינה"),
    phone: z.string().regex(/^05\d{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)"),
    teamA: z.string().min(1, "יש לבחור נבחרת"),
    teamB: z.string().min(1, "יש לבחור נבחרת"),
    scoreA: z.number().int().min(0, "תוצאה לא תקינה").max(20, "תוצאה לא תקינה"),
    scoreB: z.number().int().min(0, "תוצאה לא תקינה").max(20, "תוצאה לא תקינה"),
    termsAccepted: z.literal(true, { message: "יש לאשר את התקנון" }),
    honeypot: z.string().max(0).optional(),
  })
  .refine((data) => data.teamA !== data.teamB, {
    message: "יש לבחור שתי נבחרות שונות",
    path: ["teamB"],
  });

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    // Deadline enforcement
    if (new Date() >= DEADLINE) {
      return json({ error: "ההרשמה למבצע נסגרה" }, 410);
    }

    const body = await req.json();

    // Validate
    const parsed = predictionSchema.safeParse(body);
    if (!parsed.success) {
      return json({ error: parsed.error.issues[0].message }, 400);
    }

    const data = parsed.data;

    // Honeypot
    if (data.honeypot) {
      return json({ serialNumber: "HYD-2026-00000", message: "הניחוש נשלח בהצלחה!" });
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return json({ error: "Server configuration error" }, 500);
    }

    const supabase = createClient(url, key);

    // Check duplicates
    const { data: existingByEmail } = await supabase
      .from("predictions")
      .select("serial_number")
      .eq("email", data.email)
      .maybeSingle();

    if (existingByEmail) {
      return json({ error: "כבר נרשמת עם כתובת אימייל זו", serialNumber: existingByEmail.serial_number }, 409);
    }

    const { data: existingById } = await supabase
      .from("predictions")
      .select("serial_number")
      .eq("id_number", data.idNumber)
      .maybeSingle();

    if (existingById) {
      return json({ error: "כבר נרשמת עם תעודת זהות זו", serialNumber: existingById.serial_number }, 409);
    }

    // Generate serial
    const { data: serialData, error: serialError } = await supabase.rpc("generate_serial_number");
    if (serialError || !serialData) {
      console.error("Serial generation error:", serialError);
      return json({ error: "שגיאה ביצירת מספר סידורי" }, 500);
    }

    // Insert
    const { error: insertError } = await supabase.from("predictions").insert({
      serial_number: serialData as string,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      id_number: data.idNumber,
      team_a: data.teamA,
      team_b: data.teamB,
      score_a: data.scoreA,
      score_b: data.scoreB,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return json({ error: "כבר נרשמת למבצע" }, 409);
      }
      console.error("Insert error:", insertError);
      return json({ error: "שגיאה בשמירת הניחוש" }, 500);
    }

    return json({ serialNumber: serialData as string, message: "הניחוש נשלח בהצלחה!" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return json({ error: "שגיאה לא צפויה" }, 500);
  }
};
