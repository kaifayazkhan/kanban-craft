'use client';
import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useBoardStore } from '@/store/useBoardStore';

interface ListActionsProps {
  listId: string;
}

export default function ListActions({ listId }: ListActionsProps) {
  const { lists, updateList, removeList } = useBoardStore((state) => state);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updatedListName, setUpdateListName] = useState<string>(lists[listId].title);

  const toggleDeleteDialog = () => setDeleteDialogOpen((prev) => !prev);

  const handleUpdateList = () => {
    updateList(listId, { title: updatedListName });
  };

  const handleDeleteList = () => {
    removeList(listId);
    toggleDeleteDialog();
  };

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen}>
        <AlertDialogContent className='container max-w-[90%] rounded-md sm:max-w-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the list and all the cards
              associated to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={toggleDeleteDialog}>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={handleDeleteList}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='size-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <DialogTrigger className='w-full text-start'>Rename</DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={toggleDeleteDialog}
              className='text-destructive hover:bg-destructive hover:text-destructive'
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className='container max-w-[90%] rounded-md sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-start'>Edit List</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div>
            <Label htmlFor='editList' className='sr-only'>
              Link
            </Label>
            <Input
              id='editList'
              value={updatedListName}
              onChange={(e) => setUpdateListName(e.target.value)}
            />
          </div>
          <DialogFooter className='flex gap-2 sm:justify-start'>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type='button' variant='primary' onClick={handleUpdateList}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
