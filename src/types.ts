export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export interface Organization {
  name: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  entity_type?: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
}

export interface ChangeOrder {
  id: string;
  title: string;
  amount: number;
  status: 'submitted' | 'approved' | 'rejected';
}

export type View = 'feed' | 'tasks' | 'co' | 'rfis' | 'notifications' | 'files';

export type ProjectRole = 'viewer' | 'collaborator' | 'admin';

export interface InvitePayload {
  email: string;
  project_id: string;
  role: ProjectRole;
}
