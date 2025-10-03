import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User2, Mail, ZapIcon, LogOut } from "lucide-react";
import PricingModel from "./PricingModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton } from "@clerk/nextjs";

function UserSettingsDialog({ children, user, remainingToken }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Account Settings</DialogTitle>
          <DialogDescription className="text-center">
            View your account details and plan information.
          </DialogDescription>
          <div className="flex justify-center items-center mt-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </DialogHeader>
        <div className="space-y-6 mt-6">
          {/* User Account Info */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User2 className="w-5 h-5 mr-2" />
              Account Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User2 className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Name:</span>
                <span className="ml-2">{user?.fullName || `${user?.firstName} ${user?.lastName}` || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span className="ml-2">{user?.primaryEmailAddress?.emailAddress || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Plan Details</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Current Plan: Free</h4>
                <p className="text-sm text-gray-600">Upgrade to unlock more features</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{5 - remainingToken}/5 messages used</p>
                <Progress value={(remainingToken / 5) * 100} />
              </div>
              <PricingModel>
                <Button className="w-full">
                  <ZapIcon className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </PricingModel>
            </div>
          </div>

          {/* Logout Button */}
          <DialogFooter>
            <SignOutButton>
              <Button variant="destructive" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </SignOutButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserSettingsDialog;
