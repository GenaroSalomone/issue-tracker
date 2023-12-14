import dynamic from 'next/dynamic';
import IssueFormSkeleton from './loading';
import delay from 'delay';

const IssueForm = dynamic(
  //Loader function
  () => import('@/app/issues/_components/IssueForm'),
  { ssr: false,
    loading: () => <IssueFormSkeleton />
  }
)
const NewIssuePage = () => {
  delay(5000);
  return (
    <IssueForm />
  )
}

export default NewIssuePage