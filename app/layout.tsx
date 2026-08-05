import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});

export async function generateMetadata():Promise<Metadata>{
  const incoming=await headers();
  const host=incoming.get("x-forwarded-host")||incoming.get("host")||"localhost:3000";
  const protocol=incoming.get("x-forwarded-proto")||(host.includes("localhost")?"http":"https");
  const base=`${protocol}://${host}`;
  const title="Ryan's Year 2 Maths Fieldbook";
  const description="22 New Zealand Year 2 maths knowledge points with video lessons and 4,400 interactive practice questions.";
  return {title,description,openGraph:{title,description,type:"website",images:[{url:`${base}/og.png`,width:1536,height:1024,alt:title}]},twitter:{card:"summary_large_image",title,description,images:[`${base}/og.png`]}};
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>
}
