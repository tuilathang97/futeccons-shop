'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useCallback, useRef } from 'react';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, Link2, Image as ImageIcon, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  onBlur?: () => void;
  minHeight?: string;
}

// Add custom CSS for the editor
const editorStyles = `
  .ProseMirror {
    min-height: 200px;
    padding: 1rem;
  }
  
  .ProseMirror:focus {
    outline: none;
  }
  
  .ProseMirror a {
    color: #0284c7; /* Tailwind blue-600 */
    text-decoration: underline;
  }
  
  .ProseMirror h1 {
    font-size: 2.25rem; /* text-4xl */
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .ProseMirror h2 {
    font-size: 1.875rem; /* text-3xl */
    font-weight: 700;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  
  .ProseMirror h3 {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .ProseMirror p {
    margin-bottom: 0.75rem;
  }
  
  .ProseMirror ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.75rem 0;
  }
  
  .ProseMirror ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 0.75rem 0;
  }
  
  .ProseMirror li {
    margin-bottom: 0.25rem;
  }
  
  .ProseMirror li p {
    margin: 0;
  }
`;

const TiptapEditor = ({ content, onChange, onBlur, minHeight = '300px' }: TiptapEditorProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-6',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      if (onBlur) onBlur();
    },
    editorProps: {
      attributes: {
        class: cn('prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg focus:outline-none rounded-md', minHeight && `min-h-[${minHeight}]`),
        style: `min-height: ${minHeight};`,
      },
    },
  });

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleHeading = useCallback((level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return; // Cancelled
    if (url === '') { // Unset link
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      // For now, just create a ObjectURL for preview - in a real scenario, you'd upload to Cloudinary
      const url = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: url }).run();
    }
    // Reset file input
    if (imageInputRef.current) imageInputRef.current.value = "";
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Add style tag with custom CSS */}
      <style>{editorStyles}</style>
      <div className="toolbar flex flex-wrap gap-2 border-b p-2 bg-muted/20">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleBold}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
            title="Đậm"
          >
            <Bold size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleItalic}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
            title="Nghiêng"
          >
            <Italic size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleStrike}
            className={editor.isActive('strike') ? 'bg-muted' : ''}
            title="Gạch ngang"
          >
            <Strikethrough size={18} />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => toggleHeading(1)}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
            title="Tiêu đề 1"
          >
            <Heading1 size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => toggleHeading(2)}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
            title="Tiêu đề 2"
          >
            <Heading2 size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => toggleHeading(3)}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
            title="Tiêu đề 3"
          >
            <Heading3 size={18} />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleBulletList}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            title="Danh sách"
          >
            <List size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleOrderedList}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
            title="Danh sách số"
          >
            <ListOrdered size={18} />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-muted' : ''}
          title="Liên kết"
        >
          <Link2 size={18} />
        </Button>

        <input 
          type="file" 
          accept="image/*" 
          ref={imageInputRef} 
          onChange={handleImageUpload} 
          style={{ display: 'none' }} 
        />
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => imageInputRef.current?.click()}
          title="Hình ảnh"
        >
          <ImageIcon size={18} />
        </Button>
      </div>

      <EditorContent editor={editor} className="w-full" />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-background rounded shadow border p-2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleBold}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
            title="Đậm"
          >
            <Bold size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleItalic}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
            title="Nghiêng"
          >
            <Italic size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleBulletList}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            title="Danh sách"
          >
            <List size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleOrderedList}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
            title="Danh sách số"
          >
            <ListOrdered size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={addLink}
            className={editor.isActive('link') ? 'bg-muted' : ''}
            title="Liên kết"
          >
            <Link2 size={16} />
          </Button>
        </BubbleMenu>
      )}
    </div>
  );
};

export default TiptapEditor; 