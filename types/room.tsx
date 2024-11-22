export interface Room {
    id: string;
    created_by: string;
    name: string;
    description: string | null;
    is_public: boolean;
    password: string | null;
    created_at: string;
    expires_at: string;
    is_active: boolean;
}
