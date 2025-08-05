"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import editorjsHTML from "editorjs-html";
const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
});
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
      onClick={() => setDark((d) => !d)}
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
  category: string;
  body: string;
};

export default function MyBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const supabase = createClient();

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

  const startEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
    setEditCategory(blog.category);

    // Parse body if it's a string
    let bodyData = blog.body;
    if (typeof bodyData === "string") {
      try {
        bodyData = JSON.parse(bodyData);
      } catch {
        bodyData = "";
      }
    }
    setEditBody(bodyData);
  };

  const handleUpdate = async (id: number) => {
    const { error } = await supabase
      .from("Blog")
      .update({
        title: editTitle,
        description: editDescription,
        body: editBody,
        category: editCategory,
      })
      .eq("id", id);
    if (error) {
      alert("Error updating blog: " + error.message);
    } else {
      setEditingId(null);
      const { data } = await supabase.from("Blog").select("*");
      setBlogs(data || []);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("Blog").delete().eq("id", id);
    if (error) {
      alert("Error deleting blog: " + error.message);
    } else {
      setBlogs(blogs.filter((b: any) => b.id !== id));
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors relative">
      <ThemeSwitcher />
      <div className="max-w-3xl mx-auto">
        <h1 className="flex font-bold text-2xl mb-8 justify-center text-blue-700 dark:text-blue-200">
          My Blogs
        </h1>
        <ul className="px-2">
          {blogs.map((blog: any) => {
            // Ensure blog.body is EditorJS JSON
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
                className="box-border flex flex-col mb-6 border rounded-lg p-6 bg-white dark:bg-gray-800 shadow"
              >
                {editingId === blog.id ? (
                  <div>
                    <div className="mb-2">
                      <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="text"
                          id="edit-title"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                      </div>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="email">Description</Label>
                      <Input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="mb-2 border w-full rounded-sm p-2"
                        placeholder="Description"
                      />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-2 ">
                      <Label
                        htmlFor="edit-category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Select the Blog Category
                      </Label>
                      <Select
                        value={editCategory}
                        onValueChange={setEditCategory}
                      >
                        <SelectTrigger className="w-full" id="edit-category">
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                        <SelectContent side="bottom" align="start">
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Travel">Travel</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Fashion">Fashion</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="edit-body"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter the Blog Body
                      </Label>
                      <Editor
                        data={editBody}
                        onChange={setEditBody}
                        holder={`editorjs-${blog.id}`}
                      />
                    </div>
                    <Button
                      variant={"default"}
                      className="mr-2"
                      onClick={() => handleUpdate(blog.id)}
                    >
                      Save
                    </Button>

                    <Button
                      variant={"outline"}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h2 className="font-bold text-xl text-blue-700 dark:text-blue-300 mb-1">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {blog.description}
                    </p>
                    <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                      {blog.category}
                    </div>
                    <div className="text-gray-800 dark:text-gray-100 whitespace-pre-line mb-4">
                      <div
                        className="prose dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: renderEditorJsHtml(bodyData),
                        }}
                      />
                    </div>
                    <Button
                      onClick={() => startEdit(blog)}
                      variant={"outline"}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(blog.id)}
                      variant={"destructive"}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
          {blogs.length === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-8">
              No blogs found.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
