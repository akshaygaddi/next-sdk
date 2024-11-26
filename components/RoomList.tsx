import Link from 'next/link'

import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {createClient} from "@/utils/supabase/server";

export default async function RoomList() {
    const supabase =await createClient()

    const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching rooms:', error)
        return <div>Error loading rooms. Please try again later.</div>
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
                <Link href={`/rooms/${room.id}`} key={room.id}>
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>{room.name}</CardTitle>
                            <CardDescription>
                                Created {new Date(room.created_at).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Badge variant={room.type === 'public' ? 'default' : 'secondary'}>
                                {room.type}
                            </Badge>
                            {room.expires_at && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Expires: {new Date(room.expires_at).toLocaleString()}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

