"use client";
import React, { useState } from "react";
import Image from "next/image";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { PiBell } from "react-icons/pi";
import { Notification } from "@prisma/client";
import { markAllNotificationsAsRead } from "@/lib/server-actions";

interface NotificationIconProps {
  notifications: Notification[] | null;
}

const NotificationIcon = ({ notifications }: NotificationIconProps) => {
  const allNotifications = notifications || [];

  const [unreadNotifications, setUnreadNotifications] = useState(
    notifications?.filter((notification) => notification.status === "UNREAD")
      .length || 0
  );

  const timeAgo = (date: string) => {
    const now = new Date();
    const time = new Date(date);
    const diff = now.getTime() - time.getTime();
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (seconds < 60) {
      return "Just now";
    } else if (minutes < 60) {
      return `${Math.floor(minutes)}m ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else {
      return `${Math.floor(days)}d ago`;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      //mark all notifications as read with server action
      await markAllNotificationsAsRead();
      await markAllNotificationsAsRead();
      setUnreadNotifications(0);
    } catch (error) {
      console.log("Error marking all notifications as read", error);
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center">
            <PiBell className="text-gray-600 text-xl" />
            {unreadNotifications > 0 && (
              <div className="absolute ml-3 mb-3 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                {unreadNotifications}
              </div>
            )}
          </div>
        </SheetTrigger>
        <SheetContent className="p-4">
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
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-red-500 hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}

          <div className="flex flex-col gap-y-4">
            {allNotifications?.map((notification) => (
              <div key={notification.id} className="flex items-center gap-x-4">
                <Image
                  priority
                  src={notification.profilePicture}
                  alt="profile picture"
                  width={50}
                  height={50}
                  className="rounded-full h-8 w-8"
                />
                {notification.status === "UNREAD" ? (
                  <div>
                    <p className="text-xs">
                      {notification.createdAt &&
                        timeAgo(notification.createdAt.toISOString())}
                    </p>
                    <h1 className="text-sm font-medium">{notification.body}</h1>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <p className="text-xs text-gray-500">
                      {notification.createdAt &&
                        timeAgo(notification.createdAt.toISOString())}
                    </p>
                    <h1 className="text-sm text-gray-500">
                      {notification.body}
                    </h1>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NotificationIcon;
