import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous elements to prevent duplicates (important for React StrictMode)
    containerRef.current.innerHTML = '';

    // Create a wrapper element inside container
    const editorDiv = document.createElement('div');
    containerRef.current.appendChild(editorDiv);

    const quill = new Quill(editorDiv, {
      theme: 'snow',
      placeholder: placeholder || '내용을 입력해주세요...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          ['clean'],
        ],
      },
    });

    quillRef.current = quill;

    // Set initial value
    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    // Handle text change
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      // If editor is empty, return empty string
      if (html === '<p><br></p>') {
        onChange('');
      } else {
        onChange(html);
      }
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      quillRef.current = null;
    };
  }, []);

  // Update editor value if changed externally (only if different from current innerHTML)
  useEffect(() => {
    if (quillRef.current) {
      const currentHtml = quillRef.current.root.innerHTML;
      if (value !== currentHtml && value !== '<p><br></p>') {
        // If value was reset or changed externally
        if (!value) {
          quillRef.current.setText('');
        } else {
          quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }
      }
    }
  }, [value]);

  return (
    <div className="w-full border border-slate-200 overflow-hidden bg-white text-sm font-semibold select-text">
      <style>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background-color: #f8fafc;
          padding: 8px 12px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          min-height: 250px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 250px;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #334155;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #94a3b8;
          font-weight: 500;
          left: 15px;
        }
        .ql-editor p {
          margin-bottom: 0.5rem;
        }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
};
