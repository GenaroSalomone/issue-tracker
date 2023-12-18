import { patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/authOptions";
import { Status } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params : { id: string }}) {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({}, { status: 401 });
    
    const body = await request.json();
    const validation = patchIssueSchema.safeParse( body );
    if (!validation.success)
      return NextResponse.json(validation.error.format())

    const { assignedToUserId, title, description } = body;
    if ( assignedToUserId ) {
      const user = await prisma.user.findUnique({
        where: { id: assignedToUserId }
      })
      if ( !user )
        return NextResponse.json({ error: 'Invalid user' }, { status: 400 })
    }

    const issue = await prisma.issue.findUnique({
      where: { id: parseInt( params.id )}
    })

    if ( !issue )
      return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })

    const updatedIssue = await prisma.issue.update({
      where: { id: issue.id},
      data: {
        title,
        description,
        assignedToUserId
      }
    })

    return NextResponse.json( updatedIssue );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params : { id: string }}) {

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({}, { status: 401 });
  
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt( params.id )}
  })

  if ( !issue )
    return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })

  await prisma.issue.delete({
    where: { id: issue.id }
  })

  return NextResponse.json({});
}

export async function PUT(
  request: NextRequest,
  { params }: { params : { id: string }}) {

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({}, { status: 401 });
  
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt( params.id )}
  })

  if ( !issue )
    return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })

  const { status } = await request.json();
  const validStatuses = Object.values(Status);

  if (!validStatuses.includes(status)) 
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id},
    data: { status }
  })

  return NextResponse.json( updatedIssue );
}