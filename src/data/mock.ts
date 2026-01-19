import { ChangeOrder, Organization, Post, Profile, Project, Task } from '../types';

export const MOCK_PROFILE: Profile = { id: '1', full_name: 'Alex Rivera', avatar_url: null };
export const MOCK_ORG: Organization = { name: 'Clear View Construction' };
export const MOCK_PROJECT: Project = { id: 'p1', name: 'Horizon Residential Phase I' };

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    content: 'Clear View update: Site survey for the north wing is complete. Leveling looks perfect. Proceeding with framing tomorrow.',
    created_at: new Date().toISOString(),
    profiles: { full_name: 'Alex Rivera' },
    entity_type: 'task'
  },
  {
    id: '2',
    content: "Attached the new window specifications for the penthouse. Ensuring we maintain that 'Clear View' standard.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    profiles: { full_name: 'Sarah Chen' },
    entity_type: 'change_order'
  }
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Install glass pane system', status: 'done', priority: 'high' },
  { id: '2', title: 'Verify window seal integrity', status: 'in-progress', priority: 'medium' },
  { id: '3', title: 'Survey exterior lighting', status: 'todo', priority: 'high' }
];

export const MOCK_CHANGE_ORDERS: ChangeOrder[] = [
  { id: 'co1', title: 'Premium Glass Sourcing', amount: 14500, status: 'approved' },
  { id: 'co2', title: 'Balcony Guardrail Update', amount: 8200, status: 'submitted' }
];

export const MOCK_TEAM: string[] = ['Sarah Chen', 'John Ross', 'Elena Gilbert'];
