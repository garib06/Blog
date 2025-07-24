'use client';

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

// ThemeSwitcher component for dark/light mode
function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  // Toggle dark mode class on <html>
  React.useEffect(() => {
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

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("Blog")
      .insert([{ title, description, body }]);
    if (error) {
      setMessage("Error: " + error.message);
      console.error("Error inserting blog post:", error);
    } else {
      setMessage("Blog post added!");
      setTitle("");
      setDescription("");
      setBody("");
      setTimeout(() => redirect("/blog"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors relative">
      <ThemeSwitcher />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-6 text-center">Add Blog</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Title"
            className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <textarea
            placeholder="Body"
            className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[120px] resize-y"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md"
          >
            Submit
          </button>
        </form>
        {message && (
          <div className={`mt-6 text-center text-base font-medium ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}