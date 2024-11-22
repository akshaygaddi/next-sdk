import { getRooms, joinRoom } from '@/app/room/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export async function RoomList() {
    const rooms = await getRooms()

    return (
        <div className="space-y-4">
            {rooms.map((room) => (
                <div key={room.id} className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                        Type: {room.room_type}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                        Expires: {new Date(room.time_limit).toLocaleString()}
                    </p>
                    <Link href={`/room/${room.id}`} passHref>
                        <Button className="bg-orange-500 text-white hover:bg-orange-600">
                            {room.room_type === 'private' ? 'Join Private Room' : 'Join Room'}
                        </Button>
                    </Link>
                </div>
            ))}
        </div>
    )
}
