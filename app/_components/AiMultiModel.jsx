import React, { useContext, useState } from 'react'
import AiModelList from './../../shared/AiModelList'
import Image from 'next/image'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader, LoaderIcon, LockIcon, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SelectGroup, SelectLabel } from '@radix-ui/react-select'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { doc, updateDoc } from 'firebase/firestore'
import { useUser } from '@clerk/nextjs'
import { db } from '@/config/Firebase.Config'
import { DefaultModel } from '@/shared/AiModels'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSearchParams } from 'next/navigation'

function AiMultiModel() {
    const { user } = useUser(); 
    const [aiModelList, setAiModelList] = useState(AiModelList);
    
    // const{aiSelectedModel, setAiSelectedModel}=useContext(AiSelectedModelContext);
    const {aiSelectedModel, setAiSelectedModel,messages, setMessages}=useContext(AiSelectedModelContext);

   
   
   
    const togglechange = (model, value) => {
        setAiModelList((prev) =>
            prev.map((m) =>
                m.model === model ? { ...m, enable: value } : m
            )
        )
        setAiSelectedModel((prev) => ({
            ...prev,
            [model]: {
                //  ...prev[model], enable: value
                ...(prev?.[model]??{}),
                enable: value    
            }
        }))
    }

    console.log("aiSelectedModel", aiSelectedModel);

    const onSelecteValue=async(parentModel, value)=>{
        setAiSelectedModel((prev)=>({
            ...prev,    
            [parentModel]:{
                modelId:value
            }
        }))
        //update to firebase
      
    }

    return (
        <div className="flex flex-1 h-[75vh] border-b">
            {aiModelList.map((model, index) => (
                <div
                    key={index}
                    className={`flex flex-col border-r h-full overflow-auto transition-all ${
                        model.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none"
                    }`}
                >
                    {/* Header */}
                    <div className="flex w-full h-[80px] items-center justify-between border-b p-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src={model.icon}
                                alt={model.model}
                                width={24}
                                height={50}
                            />
                            {model.enable && (
                                <Select defaultValue={aiSelectedModel[model.model].modelId} onValueChange={(value) => onSelecteValue(model.model, value)} disabled={model.premium}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={aiSelectedModel[model.model].modelId} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup className='p-3'>
                                            <SelectLabel className='text-sm text-gray-400'>Free</SelectLabel>

                                        {model.subModel.map((subModel, i) =>subModel.premium == false&& (
                                            <SelectItem key={i} value={subModel.id}>
                                                {subModel.name}
                                            </SelectItem>
                                        ))}
                                        </SelectGroup>
                                        <SelectGroup className='p-3'>
                                            <SelectLabel className='text-sm text-gray-400'>Premium</SelectLabel>

                                        {model.subModel.map((subModel, i) =>subModel.premium == true&& (
                                            <SelectItem key={i} value={subModel.name} disabled={subModel.premium}>
                                                {subModel.name} {subModel.premium && <LockIcon className="inline-block ml-2" size={12} />}
                                            </SelectItem>
                                        ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <div>
                            {model.enable ? (
                                <Switch
                                    checked={model.enable}
                                    onCheckedChange={(v) =>
                                        togglechange(model.model, v)
                                    }
                                />
                            ) : (
                                <button
                                    onClick={() => togglechange(model.model, true)}
                                    className="cursor-pointer"
                                >
                                    <MessageSquare />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Premium locked section */}
                    {model.premium && model.enable && (
                        <div className="flex items-center justify-center h-full">
                            <Button>
                                <LockIcon className="mr-2" /> Upgrade to unlock
                            </Button>
                        </div>
                        
                    )}
                    {model.enable &&<div className='flex-1 p-4'>
                        <div className='flex-1 p-4 space-y-2'>
                            {messages[model.model]?.map((m,i)=>(
                                <div key={i} className={`p-2 rounded-md ${m.role=='user'?
                                'bg-blue-100 text-blue-900': 'bg-gray-100 text-gray-900'}
                                `}
                                >
                                    {m.role=='assistant' &&(
                                        <span className='text-sm text-gray-500'>
                                            {m.model??model.model}
                                        </span>
                                    )}  
                                   
                                        <div className='flex gap-3 items-center'>
                                        {m.content=='Vichar Karta Aahe...🤔'&&<><LoaderIcon className='animate-spin'/><span>Vichar Karat Aahe 🤔</span></>}</div>
                                        {/* <h2>{m.content}</h2> */}
                                        {m?.content!=='Vichar Karta Aahe...🤔'&&
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} >

                                            {m?.content}
                                        </ReactMarkdown>
                                         
                                        } 

                                </div>
                            ))}
                        </div>

                    </div>}
                </div>
            ))}
        </div>
    )
}

export default AiMultiModel
