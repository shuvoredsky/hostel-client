import { GenderPreference } from "@/types/listing.types";

interface ListingOfferBadgesProps {
  studentDiscountPercent: number;
  genderPreference: GenderPreference;
  allowHalfMonthlyPay?: boolean;
  variant?: "compact" | "detail";
}

const badgeBase =
  "inline-flex items-center rounded-full border px-3 py-1.5 font-medium transition-all";

const getGenderBadgeStyles = (genderPreference: GenderPreference) => {
  if (genderPreference === "BOYS") {
    return "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700";
  }

  if (genderPreference === "GIRLS") {
    return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700";
  }

  if (genderPreference === "FAMILY") {
    return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700";
  }

  return "";
};

export default function ListingOfferBadges({
  studentDiscountPercent,
  genderPreference,
  allowHalfMonthlyPay,
  variant = "compact",
}: ListingOfferBadgesProps) {
  const badges: Array<{ label: string; className: string }> = [];

  if (studentDiscountPercent > 0) {
    badges.push({
      label:
        variant === "detail"
          ? `${studentDiscountPercent}% off for verified students`
          : `Student -${studentDiscountPercent}%`,
      className:
        "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
    });
  }

  if (genderPreference !== "ANYONE") {
    let label = "";
    if (genderPreference === "BOYS") {
      label = "Boys Only";
    } else if (genderPreference === "GIRLS") {
      label = "Girls Only";
    } else if (genderPreference === "FAMILY") {
      label = "Family";
    }

    badges.push({
      label,
      className: `${getGenderBadgeStyles(genderPreference)}`,
    });
  }

  if (variant === "detail" && allowHalfMonthlyPay) {
    badges.push({
      label: "Half-Monthly payment available",
      className:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
    });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${variant === "detail" ? "items-start" : "items-center"}`}>
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`${badgeBase} ${variant === "compact" ? "text-[11px] px-2.5 py-1" : "text-xs"} ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
