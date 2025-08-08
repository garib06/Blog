"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import editorjsHTML from "editorjs-html";
const edjsParser = editorjsHTML();

// Simple theme switcher using Tailwind's dark mode

interface Blog {
  id: number;
  title: string;
  description: string;
  category: string;
  body: string;
}

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const supabase = createClient();

  //function to go to dynamic page through a specific blog id
  const goToBlog = (id: number) => {
    window.location.href = `/blog/${id}`;
  };
  function renderEditorJsHtml(data: any) {
    // Must be an object with a blocks array
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray(data.blocks) ||
      data.blocks.length === 0
    ) {
      return "";
    }
    const htmlResult = edjsParser.parse(data);
    if (Array.isArray(htmlResult)) {
      return htmlResult.join("");
    }
    return htmlResult;
  }

  useEffect(() => {

    const fetchBlogs = async () => {
      const { data, error } = await supabase.from("Blog").select("*");
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
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-200 mb-2">
            Blog Page
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            Welcome to the blog page!
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-200">
            Here are the blog posts
          </h2>
          <ul>
            {blogs.map((blog: any) => {
              let bodyData = blog.body;
              if (typeof bodyData === "string") {
                try {
                  bodyData = JSON.parse(bodyData);
                } catch {
                  bodyData = {};
                }
              }
              return (
                <li
                  key={blog.id}
                  className="mb-6 p-4 border rounded-lg hover:shadow-lg transition cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-900"
                  onClick={() => goToBlog(blog.id)}
                >
                  <h3 className="font-bold text-xl text-blue-700 dark:text-blue-300 mb-1">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {blog.description}
                  </p>
                  <div
                    className="text-gray-800 dark:text-gray-100 whitespace-pre-line mb-4"
                    dangerouslySetInnerHTML={{
                      __html: renderEditorJsHtml(bodyData),
                    }}
                  />
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {blog.category}
                  </p>
                </li>
              );
            })}
          </ul>
          {blogs.length === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-8">
              No blogs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}