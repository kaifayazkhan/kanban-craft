import { EditorBubble, useEditor } from 'novel';
import { removeAIHighlight } from 'novel/extensions';

import { type ReactNode, useEffect } from 'react';

interface EditorMenuProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditorMenu({ children, open, onOpenChange }: EditorMenuProps) {
  const { editor } = useEditor();

  useEffect(() => {
    if (!editor || !open) return;

    // Remove AI highlight when menu closes
    return () => {
      if (editor.isDestroyed) return;
      removeAIHighlight(editor);
    };
  }, [open, editor]);

  const handleHidden = () => {
    onOpenChange(false);

    if (!editor || editor.isDestroyed) return;

    try {
      editor.chain().unsetHighlight().run();
    } catch (error) {
      console.error('Error unsetting highlight:', error);
    }
  };

  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? 'bottom-start' : 'top',
        onHidden: handleHidden,
      }}
      className='flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl'
    >
      {!open && children}
    </EditorBubble>
  );
}
