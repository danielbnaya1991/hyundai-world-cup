"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
}

export function TermsCheckbox({ checked, onCheckedChange, error }: TermsCheckboxProps) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          className="mt-0.5"
        />
        <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer text-[#71717a]">
          קראתי ואני מסכים/ה{" "}
          <Dialog>
            <DialogTrigger
              className="text-[#4285F4] underline underline-offset-2 hover:no-underline bg-transparent border-none p-0 h-auto text-sm font-normal inline cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              לתקנון המבצע
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>תקנון מבצע &quot;נחשו את התוצאה&quot;</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-[#71717a] leading-relaxed">
                <p><strong className="text-[#1a1a1a]">1. עורכת המבצע:</strong> יונדאי ישראל.</p>
                <p><strong className="text-[#1a1a1a]">2. תקופת המבצע:</strong> מיום פרסום המבצע ועד ליום 10.6.2026 בשעה 23:59 (שעון ישראל).</p>
                <p><strong className="text-[#1a1a1a]">3. הפרס:</strong> רכב יונדאי IONIQ 5 חדש (דגם בסיס). הפרס אינו ניתן להמרה, החלפה או העברה.</p>
                <p><strong className="text-[#1a1a1a]">4. תנאי השתתפות:</strong> תושב/ת ישראל בגיל 18 ומעלה, בעל/ת תעודת זהות ישראלית בתוקף. ניחוש אחד בלבד לכל משתתף/ת.</p>
                <p><strong className="text-[#1a1a1a]">5. אופן ההשתתפות:</strong> מילוי טופס הניחוש באתר המבצע, כולל בחירת שתי נבחרות הגמר וניחוש התוצאה המדויקת.</p>
                <p><strong className="text-[#1a1a1a]">6. זכייה:</strong> משתתף/ת שינחש/תנחש נכון את שתי הנבחרות המשתתפות בגמר ואת התוצאה הסופית (בתום 90 דקות, ללא הארכות) יזכה בפרס. במידה ויותר ממשתתף/ת אחד/ת ינחשו נכון, ייערך הגרלה בין הזוכים.</p>
                <p><strong className="text-[#1a1a1a]">7. פרטיות:</strong> הפרטים האישיים ישמשו לצורכי המבצע בלבד.</p>
                <p><strong className="text-[#1a1a1a]">8. שונות:</strong> עורכת המבצע רשאית לשנות, להאריך או לקצר את תקופת המבצע ו/או את תנאיו בכל עת.</p>
                <p className="text-xs mt-4 text-[#a1a1aa]">* תקנון טיוטה לצורכי הדגמה. יעודכן לפני השקת המבצע.</p>
              </div>
            </DialogContent>
          </Dialog>
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
