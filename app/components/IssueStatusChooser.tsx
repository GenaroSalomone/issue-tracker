'use client';
import { useState } from 'react';
import { Status } from '@prisma/client';
import { AlertDialog, Button, Select } from '@radix-ui/themes';
import { IssueStatusBadge } from '.';
import axios from 'axios';

interface Props {
  issueId: number;
  initialStatus: Status;
}

const IssueStatusChooser = ({ issueId, initialStatus }: Props) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [error, setError] = useState(false);

  const changeStatus = async (newStatus: Status) => {
    try {
      await axios.put(`/api/issues/${issueId}`, { status: newStatus });
      setCurrentStatus(newStatus);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <>
      <Select.Root value={currentStatus} onValueChange={changeStatus}>
        <Select.Trigger>
          <IssueStatusBadge status={currentStatus} />
        </Select.Trigger>
        <Select.Content color="gray" highContrast={false} variant="soft">
          {Object.values(Status).map((status) => (
            <Select.Item key={status} value={status} >
              <IssueStatusBadge status={status} />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>The status could not be modified.</AlertDialog.Description>
          <Button color="gray" variant='soft' mt="2" onClick={() => setError(false)}>Cancel</Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default IssueStatusChooser;
