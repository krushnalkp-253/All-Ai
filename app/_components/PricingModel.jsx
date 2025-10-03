import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"

function PricingModel({children}) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className='w-full'>{children}</div>
      </DialogTrigger>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center">
            Upgrade your plan to unlock more features and higher limits.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Free Plan */}
          <div className="border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal">/month</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />100 messages/month</li>
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />Basic AI models</li>
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />Chat history</li>
            </ul>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-blue-500 rounded-lg p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Popular</div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal">/month</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />1000 messages/month</li>
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />All AI models</li>
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />Priority support</li>
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />Advanced features</li>
            </ul>
            <Button className="w-full">Upgrade to Pro</Button>
          </div>

          {/* Premium Plan */}
          <div className="border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Premium</h3>
            <p className="text-3xl font-bold mb-4">$19.99<span className="text-sm font-normal">/month</span></p>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />Unlimited messages</li>
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />All AI models</li>
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />24/7 support</li>
              <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500" />Custom integrations</li>
            </ul>
            <Button variant="outline" className="w-full">Upgrade to Premium</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PricingModel
