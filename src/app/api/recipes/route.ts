import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/recipes
export async function GET() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(recipes)
}

// POST /api/recipes
export async function POST(req: Request) {
  const body = await req.json()
  const { name, description } = body

  if (!name || !description) {
    return NextResponse.json(
      { error: "name and instructions are required" },
      { status: 400 }
    )
  }

  const recipe = await prisma.recipe.create({
    data: { name, description },
  })

  return NextResponse.json(recipe, { status: 201 })
}
