import { Suspense } from 'react'
import RoomCreationForm from "@/components/RoomCreatoinForm";
import RoomList from "@/components/RoomList";


export default function Home() {
  return (
      <div className="container mx-auto p-4">
        <h1 className="mb-8 text-4xl font-bold">Chat Rooms</h1>
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Create a New Room</h2>
          <RoomCreationForm />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Available Rooms</h2>
          <Suspense fallback={<div>Loading rooms...</div>}>
            <RoomList />
          </Suspense>
        </div>
      </div>
  )
}

