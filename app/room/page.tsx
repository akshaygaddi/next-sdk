import { CreateRoomForm } from '@/components/CreateRoomForm'
import { RoomList } from '@/components/RoomList'

export default function RoomPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Community Chat Rooms</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Create a Room</h2>
                    <CreateRoomForm />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
                    <RoomList />
                </div>
            </div>
        </div>
    )
}

