import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!team) {
      return new Response(
        JSON.stringify({ success: false, message: 'Team not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: team }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
