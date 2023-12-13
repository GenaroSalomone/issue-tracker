'use client';
import { Button, Callout, Text, TextField } from '@radix-ui/themes'
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { issueSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { Issue } from '@prisma/client';

const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false } //not to render component in server side
);

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueFormData>({
    resolver: zodResolver( issueSchema )
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit( async (data) => {
    try {
      if ( issue )
        await axios.patch('/api/issues/' + issue.id, data)
      else
        setIsSubmitting(true);
        await axios.post('/api/issues', data);
        router.push('/issues');
    } catch (error) {
      setIsSubmitting(false);
      setError('An unexpected error ocurred.');
    }
  })

  return (
    <div className='max-w-xl'>
      { error &&
      <Callout.Root color='red' className='mb-5'>
        <Callout.Text>{ error }</Callout.Text>
      </Callout.Root>}

      <form 
        className='space-y-3'
        onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input defaultValue={ issue?.title } placeholder='Title' {...register('title')}/>
        </TextField.Root>
        <ErrorMessage>
          { errors.title?.message }
        </ErrorMessage> 
        <Controller 
          defaultValue={ issue?.description }
          name="description"
          control={ control }
          render={({ field }) => <SimpleMDE placeholder='Description' {...field}/> }
        />
        <ErrorMessage>
          { errors.description?.message }
        </ErrorMessage>
        <Button disabled={isSubmitting}>
          { issue ? 'Update Issue' : 'Submit New Issue'}
          {isSubmitting && <Spinner/>}
        </Button>
      </form>
    </div>
  )
}

export default IssueForm