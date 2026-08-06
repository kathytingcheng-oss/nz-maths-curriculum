import type { Metadata } from "next";
import MathsApp from "./MathsApp";

export const metadata: Metadata = {
  title: "NZ Maths Curriculum | Years 2 & 3",
  description: "New Zealand Year 2 and Year 3 Mathematics and Statistics video lessons and online practice.",
};

export default function Home() {
  return <MathsApp />;
}
