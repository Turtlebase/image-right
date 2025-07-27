
"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

interface UserProfileProps {
    user: TelegramUser;
}

export default function UserProfile({ user }: UserProfileProps) {
    const getInitials = (firstName: string, lastName?: string) => {
        const firstInitial = firstName ? firstName.charAt(0) : '';
        const lastInitial = lastName ? lastName.charAt(0) : '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');

    return (
        <Popover>
            <PopoverTrigger>
                <Avatar>
                    <AvatarImage src={user.photo_url} alt={`${fullName}'s profile picture`} />
                    <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={user.photo_url} alt={`${fullName}'s profile picture`} />
                        <AvatarFallback className="text-2xl">{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-lg">{fullName}</p>
                    {user.username && <p className="text-sm text-muted-foreground">@{user.username}</p>}
                </div>
            </PopoverContent>
        </Popover>
    );
}
