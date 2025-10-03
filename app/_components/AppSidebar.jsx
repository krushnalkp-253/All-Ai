
"use client"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import { AwardIcon, BoldIcon, Ghost, Moon, Sun, User, User2, Zap, ZapIcon } from "lucide-react"
import { useTheme } from "next-themes";
import Image from "next/image"
import UsageCreditProgress from "./UsageCreditProgress";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/Firebase.Config";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import axios from "axios";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import PricingModel from "./PricingModel";
import UserSettingsDialog from "./UserSettingsDialog";

export function AppSidebar() {
    const { theme, setTheme } = useTheme();
    const {user} = useUser();

   const [chatHistory, setChatHistory]=useState([]);
   const [freeMsgCount,setFreeMsgCount]=useState(0);
     const { aiSelectedModel, setAiSelectedModel, messages, setMessages } = useContext(AiSelectedModelContext);
   
   
   useEffect(()=>{
    user&& GetChatHistory();
    user&& GetReminingTokenMsgs();
   },[user])
   useEffect(()=>{
    GetReminingTokenMsgs();
   },[messages])
    const GetChatHistory=async()=>{
        const q=query(collection(db, "chatHistory"),where("userEmail",'==',user?.primaryEmailAddress?.emailAddress));
        const querySnapshot=await getDocs(q);
        querySnapshot.forEach((doc)=>{
            console.log(doc.id,doc.data());
            setChatHistory((prev)=>[...prev, doc.data()])
        }) 
    }

    const GetLastUserMessageFromChat=(chat)=>{
        const allMessages=Object.values(chat.messages).flat();
        const userMessages=allMessages.filter(msg=>msg.role=='user');
        const lastUserMessage=userMessages.length > 0 ? userMessages[userMessages.length-1].content : null;
        const lastUpdated=chat.lastUpdated||Date.now();
        const formattedDate=moment(lastUpdated).fromNow();
        return{
            chatId:chat.chatId,
            message:lastUserMessage,
            lastMsgDate:formattedDate
        };
    }

    const GetReminingTokenMsgs=async()=>{
        const result = await axios.get('/api/user-remaining-msg');
        
        
        console.log(result);
        setFreeMsgCount(result?.data?.remainingToken)


    }
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-3">

                <div className="flex items-center justify-between items-center">

                <div className="flex items-center gap-3">
                    <Image src={"/logo.svg"} width={260} height={260} alt="logo" className="w-[60px] h-[60px]" />

                    <h2 className="font-bold text-xl">All-in-one-Ai</h2>
                    <div>
                    </div>
                        {theme == 'light' ? <Button variant={Ghost} onClick={() => setTheme('dark')}><Sun /></Button> : <Button variant={Ghost} onClick={() => setTheme('light')}><Moon /></Button>}
                </div>
                </div>
                {/* this is for user was not sign in and it was to create new chat */}
                {user ? (<Link href={'/'} >
                    <Button className="mt-7 w-full" size="lg">+ New chat</Button>
                </Link>) : (
                    <SignInButton>
                        <Button className="mt-7 w-full" size="lg">+ New chat</Button>
                    </SignInButton>
                )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup >
                    <div className={'p-3'}>

                    <h2 className="font-bold text-lg">Chat</h2>
                    {!user&&<p className="text-sm text-gray-600">Sign in to start chating with multiple AI model</p>}
                   
                   {chatHistory.map((chat,index)=>(
                    
                    <Link href={'?chatId='+chat.chatId} key={index} className="mt-2 ">
                        <div className="hover:bg-gray-300 p-3 cursor-pointer rounded-lg">

                        <h2 className="text-sm text-gray-500">{GetLastUserMessageFromChat(chat).lastMsgDate}</h2>
                        <h2 className="text-lg line-clamp-1">{GetLastUserMessageFromChat(chat).message}</h2>
                        </div>
                        <hr className="my-1"/>
                    </Link>
                    // <Link href={'?chatId'+chat.chatId} key={index} className=" mt-2 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg mt-3 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
                    //     <h2 className="text-sm text-gray-400">{GetLastUserMessageFromChat(chat).lastMsgDate}</h2>
                    //     <h2 className="text-lg">{GetLastUserMessageFromChat(chat).message}</h2>
                    //     <hr className="my-3"/>
                    // </Link>
                   ))}
                    </div>
                </SidebarGroup >
            </SidebarContent>
            <SidebarFooter >

                <div className="p-3 mb-10">
                   {!user? <SignInButton mode="modal">

                    <Button className={'w-full'} size={'lg'}>Sign in/Sign up</Button>
                    </SignInButton>
                    :
                    <div>
                        <UsageCreditProgress remainingToken={freeMsgCount}/>
                        <PricingModel>
                        <Button className={'w-full mb-3'}><ZapIcon/>Upgrade Plan</Button>
                        
                        </PricingModel>
                        
                        
                        {/* <Button className={'w-full mb-3'}><ZapIcon/>Upgrade Plan</Button> */}
                    <UserSettingsDialog user={user} remainingToken={freeMsgCount}>
                        <Button className="flex w-full " variant={'ghost'} >
                            <User2/> <h2>Setting</h2>
                        </Button>
                    </UserSettingsDialog>
                     </div>
                   }
                </div>
                </SidebarFooter>

        </Sidebar>
    )
}