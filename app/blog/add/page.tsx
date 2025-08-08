'use client';

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import editorjsHTML from "editorjs-html";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@/components/editor/editor";

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
      onClick={() => setDark((d) => !d)}
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
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("Blog")
      .insert([{ title, description, body, category }]);
    if (error) {
      setMessage("Error: " + error.message);
      console.error("Error inserting blog post:", error);
    } else {
      setMessage("Blog post added!");
      setTitle("");
      setDescription("");
      setBody("");
      setCategory("");
      setTimeout(() => redirect("/blog"), 1000);
    }
  };

  return (
    <div className="min-h-screen pt-40 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors relative">
      <ThemeSwitcher />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-6 text-center">
          Add Blog
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="title">&diams; Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="description">&diams; Description</Label>
          <Input
            type="text"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2 ">
            <Label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              &diams; Select the Blog Category
            </Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger className="w-full" id="category">
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
              htmlFor="body"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              &diams; Enter the Blog Body
            </Label>
            <Editor
              data={body}
              onChange={setBody}
              holder={`editorjs-add`}
            />
          </div>
          <Button
            type="submit"
            variant={"default"}
          >
            Submit
          </Button>
        </form>
        {message && (
          <div
            className={`mt-6 text-center text-base font-medium ${
              message.startsWith("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}