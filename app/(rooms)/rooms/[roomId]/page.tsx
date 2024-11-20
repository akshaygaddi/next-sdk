import { Suspense } from 'react'
import { RoomChat } from './room-chat'
import { notFound } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/utils/supabase/server'

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    // Await params to resolve it
    const resolvedParams = await params;
    const roomId = resolvedParams.roomId;

    const supabase = await createClient();

    const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

    if (error || !room) {
        notFound();
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase
            .from('room_users')
            .upsert({ room_id: roomId, user_id: user.id });
    }

    return (
        <div className="h-screen flex flex-col bg-background dark:bg-gray-900">
            <h1 className="text-2xl font-bold p-4 text-foreground dark:text-gray-100">{room.name}</h1>
            <div className="flex-grow">
                <Suspense fallback={<RoomSkeleton />}>
                    <RoomChat roomId={roomId} />
                </Suspense>
            </div>
        </div>
    );
}

function RoomSkeleton() {
    return (
        <div className="flex h-full">
            <div className="flex-grow p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-64 border-l border-gray-200 dark:border-gray-800 p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full mt-2" />
                ))}
            </div>
        </div>
    );
}
