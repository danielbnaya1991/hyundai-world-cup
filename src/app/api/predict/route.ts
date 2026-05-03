import { NextResponse } from "next/server";
import { predictionSchema } from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { DEADLINE } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    // Deadline enforcement
    if (new Date() >= DEADLINE) {
      return NextResponse.json(
        { error: "ההרשמה למבצע נסגרה" },
        { status: 410 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const parsed = predictionSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Honeypot check — silently accept but don't save
    if (data.honeypot) {
      return NextResponse.json({
        serialNumber: "HYD-2026-00000",
        message: "הניחוש נשלח בהצלחה!",
      });
    }

    const supabase = getSupabaseAdmin();

    // Check for existing prediction by email
    const { data: existingByEmail } = await supabase
      .from("predictions")
      .select("serial_number")
      .eq("email", data.email)
      .maybeSingle();

    if (existingByEmail) {
      return NextResponse.json(
        {
          error: "כבר נרשמת עם כתובת אימייל זו",
          serialNumber: existingByEmail.serial_number,
        },
        { status: 409 }
      );
    }

    // Check for existing prediction by ID number
    const { data: existingById } = await supabase
      .from("predictions")
      .select("serial_number")
      .eq("id_number", data.idNumber)
      .maybeSingle();

    if (existingById) {
      return NextResponse.json(
        {
          error: "כבר נרשמת עם תעודת זהות זו",
          serialNumber: existingById.serial_number,
        },
        { status: 409 }
      );
    }

    // Generate serial number
    const { data: serialData, error: serialError } = await supabase.rpc(
      "generate_serial_number"
    );

    if (serialError || !serialData) {
      console.error("Serial generation error:", serialError);
      return NextResponse.json(
        { error: "שגיאה ביצירת מספר סידורי" },
        { status: 500 }
      );
    }

    const serialNumber = serialData as string;

    // Insert prediction
    const { error: insertError } = await supabase
      .from("predictions")
      .insert({
        serial_number: serialNumber,
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
      // Handle unique constraint violations (race condition)
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "כבר נרשמת למבצע" },
          { status: 409 }
        );
      }
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "שגיאה בשמירת הניחוש" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      serialNumber,
      message: "הניחוש נשלח בהצלחה!",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "שגיאה לא צפויה" },
      { status: 500 }
    );
  }
}
