import type { Metadata } from "next";
import MathsApp from "./MathsApp";

export const metadata: Metadata = {
  title: "Ryan's Year 2 Maths Fieldbook",
  description: "New Zealand Year 2 Mathematics & Statistics video lessons and online practice.",
};

export default function Home() {
  return <MathsApp />;
}
