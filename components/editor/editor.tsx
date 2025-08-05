"use client";
import React, { useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
// @ts-ignore
import Checklist from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
// @ts-ignore
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
// @ts-ignore
import SimpleImage from "@editorjs/simple-image";
import Table from "@editorjs/table";
import editorjsHTML from "editorjs-html";

type EditorProps = {
  data?: any;
  onChange?: (data: any) => void;
  holder?: string;
};

export default function Editor({ data, onChange, holder = "editorjs" }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder,
        data,
        autofocus: true,
        tools: {
          header: Header,
          list: List,
          checklist: Checklist,
          delimiter: Delimiter,
          embed: Embed,
          image: ImageTool,
          quote: Quote,
          simpleImage: SimpleImage,
          table: Table,
        },
        onChange: async () => {
          if (onChange && editorRef.current) {
            const savedData = await editorRef.current.save();
            onChange(savedData);
          }
        },
      });
    }
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // Only run once on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border rounded-lg bg-gray-50 dark:bg-gray-700 p-2">
      <div id={holder} />
    </div>
  );
}