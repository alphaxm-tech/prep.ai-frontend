"use client";

const TIP_COLORS = [
  "bg-blue-50 text-blue-900",
  "bg-green-50 text-green-900",
  "bg-pink-50 text-pink-900",
  "bg-yellow-50 text-yellow-900",
  "bg-purple-50 text-purple-900",
  "bg-orange-50 text-orange-900",
];

type TipsMarqueeProps = {
  tips: string[];
  /** Seconds per tip — higher is slower. ~3.5s/tip reads as a comfortable medium pace. */
  secondsPerTip?: number;
  heightClassName?: string;
};

export default function TipsMarquee({
  tips,
  secondsPerTip = 3.5,
  heightClassName = "h-56",
}: TipsMarqueeProps) {
  if (tips.length === 0) return null;

  // Duplicate the list once so translateY(-50%) loops seamlessly.
  const loopedTips = [...tips, ...tips];
  const durationSec = tips.length * secondsPerTip;

  return (
    <div
      className={`marquee-pausable relative overflow-hidden ${heightClassName}`}
    >
      <div
        className="animate-marquee-vertical space-y-3 text-sm"
        style={{ animationDuration: `${durationSec}s` }}
      >
        {loopedTips.map((tip, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${TIP_COLORS[i % TIP_COLORS.length]}`}
          >
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}
