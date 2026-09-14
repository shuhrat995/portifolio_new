import { NextResponse } from "next/server";
import { getProjects, normalizeProject, saveProjects } from "@/lib/data";
import { errorResponse, refreshPublicPages, requireAdmin } from "@/lib/api";
import type { Project } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Every project, including hidden ones. */
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ projects: await getProjects(true) });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Creates a new project. */
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = (await request.json()) as Partial<Project>;
    const projects = await getProjects(true);

    const project = normalizeProject(body);
    project.updatedAt = new Date().toISOString();
    if (!project.createdAt) project.createdAt = project.updatedAt;

    // Guarantee slug (and therefore id) uniqueness.
    let slug = project.slug;
    let suffix = 2;
    while (projects.some((p) => p.slug === slug)) {
      slug = `${project.slug}-${suffix++}`;
    }
    project.slug = slug;
    project.id = slug;

    const mode = await saveProjects([project, ...projects]);
    refreshPublicPages();

    return NextResponse.json({ project, mode }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Reorders the whole list. Body: { order: string[] } of slugs. */
export async function PUT(request: Request) {
  try {
    await requireAdmin();

    const body = (await request.json()) as { order?: string[] };
    const order = Array.isArray(body?.order) ? body.order : [];
    const projects = await getProjects(true);

    const position = new Map(order.map((slug, index) => [slug, index]));
    const reordered = [...projects].sort((a, b) => {
      const ai = position.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const bi = position.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      return ai - bi;
    });

    const mode = await saveProjects(reordered);
    refreshPublicPages();
    return NextResponse.json({ projects: reordered, mode });
  } catch (error) {
    return errorResponse(error);
  }
}
