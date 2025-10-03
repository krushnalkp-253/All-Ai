"use client"
import React, { use, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
// import { Sidebar } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';
import { db } from '@/config/Firebase.Config';
import { useUser } from '@clerk/nextjs';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { DefaultModel } from '@/shared/AiModels';
import { UserSearch } from 'lucide-react';
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({ children, ...props }) {

  const {user}=useUser();
  const [aiSelectedModel, setAiSelectedModel] = useState(DefaultModel);
  const [userDetail, setUserDetail] = useState();
  const [messages, setMessages] = useState([]);
 // ...existing code...
useEffect(() => {
  if (user && user.primaryEmailAddress?.emailAddress) {
    CreateNewuser();
  }
}, [user]);

useEffect(()=>{

  if(aiSelectedModel){
updateAIModelSelectionPref();
  }
},[aiSelectedModel]);

const updateAIModelSelectionPref=async()=>{
    if (!user || !user.primaryEmailAddress?.emailAddress) return;
    //update to firebase
          const docRef=doc(db, "users", user.primaryEmailAddress.emailAddress)
          await updateDoc(docRef,{
              selectedModelPref: aiSelectedModel
          })
}


const CreateNewuser = async () => {
  if (!user || !user.primaryEmailAddress?.emailAddress) return;
  const useRef = doc(db, "users", user.primaryEmailAddress.emailAddress);
  const userSnap = await getDoc(useRef);

  if (userSnap.exists()) {
    console.log("user exists");
    const userInfo = userSnap.data();
    setAiSelectedModel({ ...DefaultModel, ...(userInfo.selectedModelPref ?? {}) });
    setUserDetail(userInfo);
    return;
  } else {
    const userData = {
      name: user.fullName,
      email: user.primaryEmailAddress.emailAddress,
      createdAt: new Date(),
      reminaingMsg: 25,
      plan: 'Free',
      credits: 1000
    };
    await setDoc(useRef, userData);
    console.log("new user created");
    setUserDetail(userData); 
  }

// ...existing code...

    // if not then insert

  }
  return (
    <NextThemesProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange {...props}>

              <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
              <AiSelectedModelContext.Provider value={{aiSelectedModel, setAiSelectedModel,messages, setMessages}}>

        <SidebarProvider>
          <AppSidebar />
          {/* <SidebarTrigger /> */}


     <div className='w-full'>
          <AppHeader />
       {children}
      </div>
      </SidebarProvider>
              </AiSelectedModelContext.Provider>
              </UserDetailContext.Provider>
    </NextThemesProvider>
  );
}

export default Provider

