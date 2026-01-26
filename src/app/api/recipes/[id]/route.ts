import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = {
  params: { id: string }
}

// GET /api/recipes/:id
export async function GET(req: Request, { params }: Params) {
  const id = Number(params.id)

  const recipe = await prisma.recipe.findUnique({
    where: { id },
  })

  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(recipe)
}

// PUT /api/recipes/:id
export async function PUT(req: Request, { params }: Params) {
  const id = Number(params.id)
  const body = await req.json()
  const { name, instructions } = body

  const recipe = await prisma.recipe.update({
    where: { id },
    data: { name, instructions },
  })

  return NextResponse.json(recipe)
}

// DELETE /api/recipes/:id
export async function DELETE(req: Request, { params }: Params) {
  const id = Number(params.id)

  await prisma.recipe.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
