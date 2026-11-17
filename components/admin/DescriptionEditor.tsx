"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, CodeXml, Italic, List, ListOrdered, Underline } from "lucide-react";

type DescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeight?: string;
};

const buttonClass = "inline-flex h-8 min-w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-[#d81635] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d81635]";

export default function DescriptionEditor({ value, onChange, placeholder, minHeight = "min-h-28" }: DescriptionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlMode, setHtmlMode] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) editor.innerHTML = value;
  }, [value, htmlMode]);

  function format(command: "bold" | "italic" | "underline" | "insertUnorderedList" | "insertOrderedList") {
    editorRef.current?.focus();
    document.execCommand(command);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#dde2eb] bg-white transition focus-within:border-[#dc3a55] focus-within:ring-4 focus-within:ring-[#d81635]/10">
      <div role="toolbar" aria-label="Description formatting" className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/80 px-2 py-1.5">
        {!htmlMode && <>
          <button type="button" title="Bold" aria-label="Bold" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => format("bold")}><Bold className="h-4 w-4" /></button>
          <button type="button" title="Italic" aria-label="Italic" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => format("italic")}><Italic className="h-4 w-4" /></button>
          <button type="button" title="Underline" aria-label="Underline" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => format("underline")}><Underline className="h-4 w-4" /></button>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-slate-200" />
          <button type="button" title="Bulleted list" aria-label="Bulleted list" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => format("insertUnorderedList")}><List className="h-4 w-4" /></button>
          <button type="button" title="Numbered list" aria-label="Numbered list" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => format("insertOrderedList")}><ListOrdered className="h-4 w-4" /></button>
        </>}
        <button
          type="button"
          title={htmlMode ? "Use visual editor" : "Edit HTML"}
          aria-label={htmlMode ? "Use visual editor" : "Edit HTML"}
          aria-pressed={htmlMode}
          className={`${buttonClass} ${htmlMode ? "bg-white text-[#d81635]" : "ml-auto"}`}
          onClick={() => setHtmlMode((current) => !current)}
        >
          <CodeXml className="mr-1 h-4 w-4" /> HTML
        </button>
      </div>
      {htmlMode ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${placeholder} HTML`}
          placeholder="Enter HTML…"
          spellCheck={false}
          className={`${minHeight} block w-full resize-y bg-white px-3.5 py-3 font-mono text-xs leading-5 text-[#263247] outline-none`}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={placeholder}
          data-placeholder={placeholder}
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
          className={`${minHeight} whitespace-pre-wrap break-words px-3.5 py-3 text-sm font-medium leading-6 text-[#263247] outline-none [&:empty]:before:pointer-events-none [&:empty]:before:text-slate-400 [&:empty]:before:content-[attr(data-placeholder)]`}
        />
      )}
    </div>
  );
}
