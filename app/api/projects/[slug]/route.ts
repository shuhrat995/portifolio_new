import { NextResponse } from "next/server";
import { getProjects, normalizeProject, saveProjects } from "@/lib/data";
import { errorResponse, refreshPublicPages, requireAdmin } from "@/lib/api";
import type { Project } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    await requireAdmin();

    const { slug } = await params;
    const body = (await request.json()) as Partial<Project>;
    const projects = await getProjects(true);

    const index = projects.findIndex((p) => p.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const updated = normalizeProject(
      { ...body, updatedAt: new Date().toISOString() },
      projects[index]
    );
    updated.id = projects[index].id ?? updated.slug;

    const next = [...projects];
    next[index] = updated;

    const mode = await saveProjects(next);
    refreshPublicPages();

    return NextResponse.json({ project: updated, mode });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    await requireAdmin();

    const { slug } = await params;
    const projects = await getProjects(true);
    const next = projects.filter((p) => p.slug !== slug);

    if (next.length === projects.length) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const mode = await saveProjects(next);
    refreshPublicPages();

    return NextResponse.json({ ok: true, mode });
  } catch (error) {
    return errorResponse(error);
  }
}
