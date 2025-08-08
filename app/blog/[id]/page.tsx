'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import editorjsHTML from "editorjs-html";

const edjsParser = editorjsHTML();

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

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<{ title: string; description: string; body: string, category:string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from('Blog')
        .select('title, description, body, category')
        .eq('id', id)
        .single();
      if (error) {
        console.error("Error fetching blog:", error);
        setBlog(null);
      } else {
        setBlog(data);
      }
    };
    if (id) fetchBlog();
  }, [id, supabase]);

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

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
        <ThemeSwitcher />
        <div className="text-gray-600 dark:text-gray-300 text-lg">Loading or blog not found...</div>
      </div>
    );
  }

  let bodyData = blog.body;
  if (typeof bodyData === "string") {
    try {
      bodyData = JSON.parse(bodyData);
    } catch {
      bodyData = "";
    }
  }

  return (
    <div className="min-h-screen pt-40 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors relative">
      <ThemeSwitcher />
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="font-bold text-3xl mb-4 text-blue-700 dark:text-blue-200">{blog.title}</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{blog.description}</p>
        <div
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: renderEditorJsHtml(bodyData),
            }}
          />
        <p className="mb-6 text-gray-600 dark:text-gray-300">{blog.category}</p>

      </div>
    </div>
  );
}