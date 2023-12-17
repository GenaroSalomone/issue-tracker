import React from 'react'
import prisma from "@/prisma/client";
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import IssueFormSkeleton from './loading';
import { Issue, Status } from '@prisma/client';
import { Box, Flex, Grid, Select } from '@radix-ui/themes';

const IssueForm = dynamic(
  () => import('@/app/issues/_components/IssueForm'),
  { ssr: false ,
    loading: () => <IssueFormSkeleton />
  }
)

const IssueStatusSelect = dynamic(
  () => import('@/app/issues/_components/IssueStatusSelect'),
  { ssr: false }
);

interface Props {
  params: { id: string }
}

const EditIssuePage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) }
  })

  if ( !issue )
    notFound();

    return (
      <Grid columns={{ initial: "1", sm:"2" }} gap="5">
        <Box className="order-2 sm:order-1 sm:col-span-1">
          <IssueForm issue={issue}/>
        </Box>
        <Box className="order-1 sm:order-2 sm:col-span-1">
          <IssueStatusSelect issue={issue} />
        </Box>
      </Grid>
    )
}

export default EditIssuePage