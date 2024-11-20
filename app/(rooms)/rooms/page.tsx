
// import { cookies } from 'next/headers'
import { RoomList } from './room-list'
import { CreateRoom } from './create-room'
import {createClient} from "@/utils/supabase/server";

export default async function RoomsPage() {
    // const cookieStore = cookies()
    const supabase = await createClient();


    const { data: { user } } = await supabase.auth.getUser()


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Rooms</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <RoomList />
                </div>
                <div>
                    {user && <CreateRoom />}
                </div>
            </div>
        </div>
    )
}