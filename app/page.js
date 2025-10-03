
"use client"
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import ChatInputBox from "./_components/ChatInputBox";
import { UserProfile } from "@clerk/nextjs";

export default function Home() {
  const {setTheme} = useTheme();
  return (
    <div>
      <ChatInputBox />
      {/* <UserProfile/> */}
    </div>
    // <div>
    //   <h2>Jay shree Ram</h2>
    //   <Button>add</Button>
    //   <Button onClick={()=>setTheme('dark')}>Dark Mode</Button>
    //   <Button onClick={()=>setTheme('light')}>Light Mode</Button>
    // </div>
  )
}
