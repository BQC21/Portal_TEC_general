import { createClient } from "@/lib/supabase/client";
import { Project, ProjectFormData } from "@/lib/types/project-types";
import { mapSupabaseRowToProject, mapProjectToSupabaseRow } from "../../../lib/mapping/project_mapping";
import { PROJECTS_TABLE } from "@/lib/utils/namingTolerance"

// --------------------------
// ---- Operaciones CRUD ----
// --------------------------

// crear proyecto
export async function createProject(project: ProjectFormData): Promise<Project> {
    const supabase = createClient();
    const baseRow = mapProjectToSupabaseRow(project) as Record<string, unknown>;

    // Ensure we don't send an `id` to the insert payload which could collide with the
    // table primary key (supabase will generate it server-side).
    if (Object.prototype.hasOwnProperty.call(baseRow, "id")) {
        delete (baseRow).id;
    }

    // Debugging aid: log the payload being sent to Supabase so we can inspect
    // whether an unexpected `id` or other problematic fields are present.
    // NOTE: remove this log after debugging to avoid leaking sensitive data.
    console.debug("[debug] createProject payload:", baseRow);

    const insertProject = async (row: Record<string, unknown>) => {
        return supabase
            .from(PROJECTS_TABLE)
            .insert(row)
            .select("*,zonas(*)");
    };

    let { data, error } = await insertProject(baseRow);

    // Cuando la secuencia del PK quedó desalineada, Supabase devuelve 23505 sobre proyectos_pkey.
    // En ese caso calculamos el siguiente id disponible y reintentamos con un valor explícito.
    if (error && (error.code === "23505" || error.message.includes("proyectos_pkey"))) {
        const { data: lastRows, error: lastError } = await supabase
            .from(PROJECTS_TABLE)
            .select("id")
            .order("id", { ascending: false })
            .limit(1);

        if (lastError) {
            throw new Error(
                `Error al crear el proyecto: ${error.message} - ${JSON.stringify(error)}`
            );
        }

        const lastIdRaw = Array.isArray(lastRows) && lastRows.length > 0 ? lastRows[0]?.id : null;
        const lastId = Number(lastIdRaw);

        if (!Number.isFinite(lastId)) {
            throw new Error(
                `Error al crear el proyecto: ${error.message} - ${JSON.stringify(error)}`
            );
        }

        const retryRow = { ...baseRow, id: lastId + 1 };
        console.warn("[debug] Retrying createProject with explicit id:", retryRow.id);
        ({ data, error } = await insertProject(retryRow));
    }

    if (error) {
        // Include the full error payload for easier debugging in logs.
        throw new Error(`Error al crear el proyecto: ${error.message} - ${JSON.stringify(error)}`);
    }

    // Supabase may return an array of rows; pick the first one defensively.
    const created = Array.isArray(data) ? data[0] : data;

    if (!created) {
        throw new Error("La inserción no devolvió ningún registro.");
    }
    return mapSupabaseRowToProject(created);
}

// obtener proyectos
export async function getProjects(): Promise<Project[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select("*,zonas(*)");

    if (error) {
        throw new Error(`Error al obtener los proyectos: ${error.message}`);
    }

    return data.map(mapSupabaseRowToProject);
}

// obtener proyecto por id
export async function getProjectById(id: string): Promise<Project> {
    const supabase = createClient();

    const { data, error } = await supabase.from(PROJECTS_TABLE)
    .select("*,zonas(*)")
    .eq("id", id)
    .single();

    if (error) {
        throw new Error(`Error al obtener el proyecto: ${error.message}`);
    }

    return mapSupabaseRowToProject(data);
}

// actualizar proyecto
export async function updateProject(id: string, project: ProjectFormData): Promise<Project> {
    const supabase = createClient();
    const baseRow = mapProjectToSupabaseRow(project) as Record<string, unknown>;

    const { error } = await supabase.from(PROJECTS_TABLE)
    .update(baseRow)
    .eq("id", id)
    ;

    if (error) {
        throw new Error(`Error al actualizar el proyecto: ${error.message}`);
    }

    return await getProjectById(id);
}

// borrar proyecto
export async function deleteProject(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.from(PROJECTS_TABLE).delete().eq("id", id);

    if (error) {
        throw new Error(`Error al eliminar el proyecto: ${error.message}`);
    }
}