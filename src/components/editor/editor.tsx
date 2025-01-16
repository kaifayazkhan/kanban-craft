'use client';
import { useState, useRef } from 'react';
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
} from 'novel';

import { handleCommandNavigation } from 'novel/extensions';
import { slashCommand, suggestionItems } from './slash-commmand';
import EditorMenu from '@/components/editor/editor-menu';
import { defaultExtensions } from '@/components/editor/extensions';

import { NodeSelector } from '@/components/editor/selectors/node-selector';
import { TextButtons } from '@/components/editor/selectors/text-buttons';

const extensions = [...defaultExtensions, slashCommand];

export const defaultEditorContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

interface EditorProps {
  initialValue: string;
  onChange: (content: string) => void;
}

export default function Editor({ initialValue, onChange }: EditorProps) {
  const [openNode, setOpenNode] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleUpdate = ({ editor }: { editor: EditorInstance }) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      const json = editor.getJSON();
      onChange(JSON.stringify(json)); // Call onChange after the user stops typing
    }, 1000);
  };

  return (
    <div className='relative w-full'>
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          initialContent={initialValue !== '' ? JSON.parse(initialValue) : null}
          extensions={extensions}
          className='min-h-32 rounded-xl border p-4'
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class:
                'prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full',
            },
          }}
          onUpdate={handleUpdate} // Use debounced update handler
        >
          <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
            <EditorCommandEmpty className='px-2 text-muted-foreground'>
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className='flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent'
                  key={item.title}
                >
                  <div className='flex size-10 items-center justify-center rounded-md border border-muted bg-background'>
                    {item.icon}
                  </div>
                  <div>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-xs text-muted-foreground'>{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <TextButtons />
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
