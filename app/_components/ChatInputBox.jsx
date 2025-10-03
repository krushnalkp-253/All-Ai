import { Button } from '@/components/ui/button'
import { Mic, Paperclip, SendIcon } from 'lucide-react'
import React, { useContext, useEffect, useState, useRef } from 'react'
import AiMultiModel from './AiMultiModel'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/Firebase.Config';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function ChatInputBox() {
  const [userInput, setUserInput] = useState("");
  const { aiSelectedModel, setAiSelectedModel, messages, setMessages } = useContext(AiSelectedModelContext);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const {user}=useUser();
  const [chatId, setChatId]=useState();
  const params = useSearchParams();
    //  const chatId=params.get('chatId');
    // const paidUser=has({plan: 'gold'})
useEffect(()=>{
  const chatId_ = params.get('chatId')
  if(chatId_){
    setChatId(chatId_);
    GetMessages(chatId_);

  }else{
    setMessages([]);
    setChatId(uuidv4());

  }
},[params])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onstart = () => {
          console.log('Started listening');
          setIsListening(true);
        };
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Result:', transcript);
          setUserInput(transcript);
        };
        recognitionRef.current.onend = () => {
          console.log('Ended listening');
          setIsListening(false);
        };
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            toast.error('Microphone access denied. Please allow microphone permission in your browser and try again.');
          } else {
            toast.error('Speech recognition error: ' + event.error);
          }
        };
      } else {
        console.warn('Speech recognition not supported in this browser.');
      }
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    //call if only if user was free .
    // if(!paidUser){

      ///deduct and check token limit 
      const result = await axios.post('/api/user-remaing-msg',{
        token:1
        
      });
      // console.log(result);
      const remainingToken = result?.data?.remainingToken;
      if(remainingToken<=0){
        console.log("limit exceed");
        toast.error("Event has been created.")
        return;
      }
    // }

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiSelectedModel).forEach((modelKey) => {

        if(aiSelectedModel[modelKey].enable){
        updated[modelKey] = [
          ...(updated[modelKey] ?? []),
          { role: "user", content: userInput },
        ];
      }
      });
    
      return updated;
    });

    const currentInput = userInput; // capture before reset
    setUserInput("");

    // 2️⃣ Fetch response from each enabled model
    Object.entries(aiSelectedModel).forEach(async ([parentModel, modelInfo]) => {
      if (!modelInfo.modelId && !modelInfo.enable || aiSelectedModel[parentModel].enable === false) return;

      // Add loading placeholder before API call
      setMessages((prev) => ({
        ...prev,
        [parentModel]: [
          ...(prev[parentModel] ?? []),
          {
            role: "assistant",
            content: "Vichar Karta Aahe...🤔",
            model: parentModel,
            loading: true,
          },
        ],
      }));

      try {
        const result = await axios.post("/api/ai-multi-mode", {
          model: modelInfo.modelId,
          msg: [{ role: "user", content: currentInput }],
          parentModel,
        });

        const { aiResponse, model } = result.data;

        // 3️⃣ Add AI response to that model’s messages
        setMessages((prev) => {
          const updated = [...(prev[parentModel] ?? [])];
          const loadingIndex = updated.findIndex((m) => m.loading);

          if (loadingIndex !== -1) {
            updated[loadingIndex] = {
              role: "assistant",
              content: aiResponse,
              model,
              loading: false,
            };
          } else {
            // fallback if no loading msg found
            updated.push({
              role: "assistant",
              content: aiResponse,
              model,
              loading: false,
            });
          }

          return { ...prev, [parentModel]: updated };
        });
      } catch (err) {
        console.error(err);
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            { role: "assistant", content: "⚠️ Error fetching response." },
          ],
        }));
      }
    });
  };

  useEffect(() => {
    if(messages){
      SaveMessages();
    }
  }, [messages])

  const SaveMessages=async()=>{
    if (!chatId || !messages || !user?.primaryEmailAddress?.emailAddress) return;

    const docRef=doc(db, "chatHistory", chatId);
    await setDoc (docRef,{
      chatId:chatId,
      userEmail:user?.primaryEmailAddress?.emailAddress,
      messages:messages,
      lastUpdated:Date.now()
    })
  }

  const GetMessages=async(chatId)=>{
    const docRef=doc(db,'chatHistory',chatId);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    const docData=docSnap.data();
    setMessages(docData.messages)
    

  }

  return (
    <div className='relative min-h-screen'>
      {/* {page contnt} */}
      <div>
        <AiMultiModel />
      </div>
      {/* {fixed chat input} */}
      <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pd-4'>
        <div className='w-full border-rounded-xl shadow-md max-w-2xl p-4 '>
          <input type='text' placeholder='Ask me Anythig....'
            className='border-0 outline-none w-full '
            value={userInput}
            onChange={(event) => { setUserInput(event.target.value) }}
          />

          <div className='mt-3 flex justify-between items-center'>
            <Button className={''} variant={'ghost'} size={'icon'}>
              <Paperclip className='h-5 w-5' />
            </Button>
            <div className='flex gap-5'>
              <Button variant={'ghost'} size={'icon'} onClick={handleMicClick} className={isListening ? 'bg-red-500 text-white' : ''}><Mic /></Button>
              <Button size={'icon'} className={'bg-orange-400'} onClick={handleSend}><SendIcon /></Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChatInputBox