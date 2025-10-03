import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function AppHeader() {
  return (
    <div className='p-3 w-full shadow flex justify-between items-center'>
    <SidebarTrigger />
    <Button variant="outline" size="sm" className={"p-auto shadow flex justify-between items-center"}>Help</Button>
    </div>
  )
}

export default AppHeader