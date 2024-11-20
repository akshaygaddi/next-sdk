import { NextResponse } from 'next/server'

// import { cookies } from 'next/headers'
import {createClient} from "@/utils/supabase/server";


export async function POST(request: Request) {
    const { name, description, expiresAt } = await request.json()
    // const cookieStore = cookies()
    const supabase =await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
        .from('rooms')
        .insert({
            name,
            description,
            created_by: user.id,
            expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        })
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
}