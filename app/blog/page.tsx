'use client'
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThemeSwitcher } from "@/components/theme-switcher";

// Simple theme switcher using Tailwind's dark mode

interface Blog {
  id: number;
  title: string;
  description: string;
  body: string;
}

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const supabase = createClient();

  //function to go to dynamic page through a specific blog id
  const goToBlog = (id: number) => {
    window.location.href = `/blog/${id}`;
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors">
      <ThemeSwitcher />
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-200 mb-2">Blog Page</h1>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Welcome to the blog page!</p>
          <div className="flex gap-4">
            <a href="/blog/add">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">Add Blog</button>
            </a>
            <a href="/blog/myblog">
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition">My Blogs</button>
            </a>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-200">Here are the blog posts</h2>
          <ul>
            {blogs.map(blog => (
              <li
                key={blog.id}
                className="mb-6 p-4 border rounded-lg hover:shadow-lg transition cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-900"
                onClick={() => goToBlog(blog.id)}
              >
                <h3 className="font-bold text-xl text-blue-700 dark:text-blue-300 mb-1">{blog.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{blog.description}</p>
                <div className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{blog.body}</div>
              </li>
            ))}
          </ul>
          {blogs.length === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-8">No blogs found.</div>
          )}
        </div>
      </div>
    </div>
  );
}