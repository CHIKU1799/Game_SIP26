import type { Metadata } from "next";
import "./globals.css";
import { Particles } from "@/components/Particles";
import { SoundToggle } from "@/components/SoundToggle";

export const metadata: Metadata = {
  title: "Gamified Cognitive Research Platform — IIT Madras (DoMS)",
  description:
    "A scientific behavioural experiment studying human cognition, AI-assisted reasoning, and metacognitive awareness. Department of Management Studies, IIT Madras.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-arena bg-grid min-h-screen antialiased">
        <Particles />
        <div className="relative z-10">{children}</div>
        <SoundToggle />
      </body>
    </html>
  );
}
