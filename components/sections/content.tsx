"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditorContent from "../EditorContent";

export default function ReadMoreSection({ content }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-white">
      <div className="container-sm mx-auto p-8 lg:p-16 w-full md:w-[85%]">
        <h2
          style={{ textAlign: "center" }}
          className="sub-heading lg:!text-2xl mb-4 text-2xl font-bold"
        >
          {content?.title ||
            "Comprehensive Support for Your UK Education Journey"}
        </h2>

        <AnimatePresence initial={false}>
          <motion.div
            key="preview"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-800 overflow-hidden text-md"
          >
            <EditorContent content_data={content?.content || ""} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
