export type UserRole = "student" | "counselor" | "admin" | "sponsor" | "jury" | "mentor";

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  establishment?: string;
  photo?: string | null;
  bio?: string;
  phone_number?: string;
  two_factor_enabled: boolean;
  date_joined: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  current_status: string;
  community_score: number;
  ai_score: number;
  final_score: number;
  likes_count: number;
  views_count: number;
  created_at: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

