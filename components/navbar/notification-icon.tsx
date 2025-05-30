"use client";
import React from "react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { PiBell } from "react-icons/pi";

const NotificationIcon = () => {
  const unreadNotifications = 0;
  return (
    <div>
      <Sheet>
        <SheetTrigger className="cursor-pointer">
          <div className="flex items-center">
            <PiBell className="text-gray-600 text-xl" />

            <div className="absolute ml-3 mb-3 bg-red-500 text-white rounded-full  h-4 w-4 flex  items-center justify-center text-xs">
              41
            </div>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              View all your notifications here
            </SheetDescription>
          </SheetHeader>
          {unreadNotifications === 0 ? (
            <>
              <div className="flex items-center py-6">
                <h1 className="text-sm text-gray-500">No new notifications</h1>
              </div>
            </>
          ) : (
            <div className="py-6">
              <button className="text-sm text-red-500 hover:underline">
                Mark all as read
              </button>
            </div>
          )}

          <div className="flex flex-col gap-y-4">notifications</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NotificationIcon;
