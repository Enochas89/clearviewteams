import React, { useEffect, useState } from 'react';
import { 
  Send,
  Camera,
  Paperclip,
} from 'lucide-react';
import { PostCard } from './PostCard';
import { Profile, Post } from '../types';
import { supabase, isSupabaseReady } from '../lib/supabaseClient';

interface SocialFeedProps {
  user: Profile;
  projectId: string;
}

export function SocialFeed({ user, projectId }: SocialFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      if (!isSupabaseReady || !supabase) {
        setError('Supabase is not configured.');
        setLoading(false);
        return;
      }
      const { data, error: postsError } = await supabase
        .from('posts')
        .select('id, content, created_at, entity_type, profiles:profiles(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (postsError) {
        setError(postsError.message);
      } else {
        const normalized = (data || []).map((item: any) => ({
          id: item.id,
          content: item.content,
          created_at: item.created_at,
          entity_type: item.entity_type,
          profiles: { full_name: Array.isArray(item.profiles) ? item.profiles[0]?.full_name || '' : item.profiles?.full_name || '' },
        })) as Post[];
        setPosts(normalized);
      }
      setLoading(false);
    };

    loadPosts();
  }, [projectId]);

  const handleSubmit = () => {
    if (!newPost.trim()) return;
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }
    const optimistic: Post = {
      id: Date.now().toString(),
      content: newPost,
      created_at: new Date().toISOString(),
      profiles: { full_name: user.full_name },
      entity_type: undefined,
    };
    setPosts([optimistic, ...posts]);
    setNewPost('');
    supabase
      .from('posts')
      .insert({ project_id: projectId, user_id: user.id, content: newPost })
      .then(({ error: insertError }) => {
        if (insertError) {
          setError(insertError.message);
        }
      });
  };

  const handleUpload = async (file: File) => {
    if (!supabase) {
      setUploadMessage('Supabase is not configured.');
      return;
    }
    setUploading(true);
    setUploadMessage(null);
    const ext = file.name.split('.').pop();
    const path = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('attachments').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (uploadError) {
      setUploadMessage('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('attachments').getPublicUrl(path);
    setUploadMessage(`Uploaded: ${publicUrlData?.publicUrl || file.name}`);
    setUploading(false);
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const docInputRef = React.useRef<HTMLInputElement | null>(null);

  const triggerPhotoPicker = () => {
    fileInputRef.current?.click();
  };
  const triggerDocPicker = () => {
    docInputRef.current?.click();
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Loading feed...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
        <div className="flex gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 font-bold text-sm">
            {user?.full_name?.[0]}
          </div>
          <div className="flex-1 space-y-3 md:space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={`Share a view, ${user.full_name.split(' ')[0]}?`}
              className="w-full border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 resize-none py-1 text-base md:text-lg min-h-[60px]"
            />
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex gap-1 md:gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                <input
                  ref={docInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                <button
                  onClick={triggerPhotoPicker}
                  disabled={uploading}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors disabled:opacity-50"
                >
                  <Camera size={18}/>
                </button>
                <button
                  onClick={triggerDocPicker}
                  disabled={uploading}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors disabled:opacity-50"
                >
                  <Paperclip size={18}/>
                </button>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={!newPost.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 md:px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-100 text-sm"
              >
                <Send size={14} className="md:w-4 md:h-4" /> <span>Update Team</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
      {uploadMessage && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{uploadMessage}</div>}

      <div className="space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts.length === 0 && <div className="text-sm text-slate-500">No updates yet.</div>}
      </div>
    </div>
  );
}
