export interface Database {
    public: {
        Tables: {
            rooms: {
                Row: {
                    id: string
                    name: string
                    created_by: string
                    created_at: string
                    expires_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    created_by: string
                    created_at?: string
                    expires_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    created_by?: string
                    created_at?: string
                    expires_at?: string | null
                }
            }
            messages: {
                Row: {
                    id: string
                    room_id: string
                    user_id: string
                    content: string
                    type: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    room_id: string
                    user_id: string
                    content: string
                    type: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    room_id?: string
                    user_id?: string
                    content?: string
                    type?: string
                    created_at?: string
                }
            }
            room_members: {
                Row: {
                    room_id: string
                    user_id: string
                }
                Insert: {
                    room_id: string
                    user_id: string
                }
                Update: {
                    room_id?: string
                    user_id?: string
                }
            }
        }
    }
}