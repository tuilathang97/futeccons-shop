import { useState } from 'react';
import { createCategory, updateCategory } from '@/lib/queries/categoryQueries';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '../ui/button';

async function createCategoryAction(prevState: any, formData: FormData) {
  const data = {
    name: formData.get('name'),
    note: formData.get('note'),
    parent_id: formData.get('parent_id')
  }
  try {
    await createCategory(data.name, data.parent_id, data.note);
    return { message: 'Successfully create new category'};
  } catch(e: any) {
    return { message: 'Failed to create category'};
  }
}

function SubmitButton({ children, className }: {children: React.ReactNode, className?: string}) {
  const { pending } =useFormStatus();
  return(
    <Button className={className} disabled={pending} type='submit' aria-disabled={pending}>
      {children}
    </Button>
  )
}

const initialState = {
  message: '',
}

export default function CategoryForm() {
  const [state, formAction] = useFormState(createCategoryAction, initialState);
  return (
    <form action={formAction} className="mb-4">
      <input
        type="text"
        id="name"
        name='name'
        placeholder="Category Name"
        className="border p-2 mr-2"
      />
      <input
        type="number"
        id="parent_id"
        name="parent_id"
        value='parentId'
        placeholder="Parent ID"
        className="border p-2 mr-2"
      />
      <input
        type="text"
        id='note'
        name="note"
        value='note'
        placeholder="Note"
        className="border p-2 mr-2"
      />
      <SubmitButton className="bg-blue-500 text-white p-2">
        Create
      </SubmitButton>
      <p aria-live='polite' className='sr-only' role='status'>
        {state?.message}
      </p>
    </form>
  );
}