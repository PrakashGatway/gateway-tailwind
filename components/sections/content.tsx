"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReadMoreSection({ content }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="bg-white">

      <div className="container-sm mx-auto p-8 lg:p-16 w-[85%]">
        <h2 style={{ textAlign: "center" }} className="sub-heading lg:!text-2xl mb-4 text-2xl font-bold">
          {content?.title || "Comprehensive Support for Your UK Education Journey"}
        </h2>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              key="full"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-800 overflow-hidden text-md"
            >
              
              <div
                className="content-html" // optional Tailwind typography
                dangerouslySetInnerHTML={{ __html: content?.content || "" }}
              />
              
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-800 overflow-hidden text-md"
            >
              <div
  className="content-html"
  style={{
    lineHeight: "1.8",
    fontSize: "16px",
    color: "#374151",
  }}
  dangerouslySetInnerHTML={{ __html: content?.content || "" }}
/>

<style>{`
.content-html p {
  margin: 12px 0;
}

.content-html h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 28px 0 14px;
}

.content-html h2 {
  font-size: 26px;
  font-weight: 700;
  margin: 24px 0 12px;
}

.content-html h3 {
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0 10px;
}

.content-html h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 18px 0 8px;
}

.content-html ul {
  list-style: disc;
  margin-left: 22px;
}

.content-html ol {
  list-style: decimal;
  margin-left: 22px;
}

.content-html li {
  margin: 6px 0;
}

.content-html a {
  color: #2563eb;
  text-decoration: underline;
}

.content-html table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.content-html th,
.content-html td {
  border: 1px solid #e5e7eb;
  padding: 12px;
}

.content-html th {
  background: #f3f4f6;
}
`}</style>
            </motion.div>
          )}
        </AnimatePresence>

        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-secondary mt-4 font-semibold !py-[6px] flex items-center space-x-2"
        >
          <span>{isOpen ? "Read Less" : "Read More"}</span>
        </button> */}
      </div>
    </section>

  );
}
