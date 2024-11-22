import { CreateRoomForm } from '@/components/CreateRoomForm'
import { RoomList } from '@/components/RoomList'
import { JoinPrivateRoom } from '@/components/JoinPrivateRoom'


export default function Home() {
    return (

        <div className="min-h-screen bg-white text-black">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Community Chat</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Create a Room</h2>
                        <CreateRoomForm />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Join Private Room</h2>
                        <JoinPrivateRoom />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
                        <RoomList />
                    </div>
                </div>
            </main>
        </div>

    )
}

