'use client';
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ThemeSwitcher component for dark/light mode
function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      className="absolute top-4 right-4 px-4 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle theme"
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

type Blog = {
  id: number;
  title: string;
  description: string;
  body: string;
};

export default function MyBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBody, setEditBody] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('Blog')
        .select('*');
      if (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } else {
        setBlogs(data || []);
      }
    };
    fetchBlogs();
  }, [supabase]);

  const startEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
    setEditBody(blog.body);
  };

  const handleUpdate = async (id: number) => {
    const { error } = await supabase
      .from('Blog')
      .update({ title: editTitle, description: editDescription, body: editBody })
      .eq('id', id);
    if (error) {
      alert('Error updating blog: ' + error.message);
    } else {
      setEditingId(null);
      const { data } = await supabase
        .from('Blog')
        .select('*');
      setBlogs(data || []);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('Blog')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Error deleting blog: ' + error.message);
    } else {
      setBlogs(blogs.filter((b: any) => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors relative">
      <ThemeSwitcher />
      <div className="max-w-3xl mx-auto">
        <h1 className="flex font-bold text-2xl mb-8 justify-center text-blue-700 dark:text-blue-200">My Blogs</h1>
        <ul className="px-2">
          {blogs.map((blog: any) => (
            <li key={blog.id} className="box-border flex flex-col mb-6 border rounded-lg p-6 bg-white dark:bg-gray-800 shadow">
              {editingId === blog.id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="flex mb-2 border w-full rounded-sm p-2"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="mb-2 border w-full rounded-sm p-2"
                    placeholder="Description"
                  />
                  <textarea
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                    className="flex mb-2 border w-full rounded-sm p-2 resize-none min-h-[80px] max-h-[400px] overflow-visible"
                    placeholder="Body"
                    style={{ height: 'auto' }}
                  />
                  <button onClick={() => handleUpdate(blog.id)} className="mr-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">Cancel</button>
                </div>
              ) : (
                <div>
                  <h2 className="font-bold text-xl text-blue-700 dark:text-blue-300 mb-1">{blog.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{blog.description}</p>
                  <div className="text-gray-800 dark:text-gray-100 whitespace-pre-line mb-4">{blog.body}</div>
                  <button onClick={() => startEdit(blog)} className="mr-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Edit</button>
                  <button onClick={() => handleDelete(blog.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Delete</button>
                </div>
              )}
            </li>
          ))}
          {blogs.length === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-8">No blogs found.</div>
          )}
        </ul>
      </div>
    </div>
  );
}