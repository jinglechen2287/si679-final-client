import type { ProjectData } from "./ProjectData";

export type Project = ProjectData & {
    _id: string;
    name: string;
    created_at: Date;
}

export type Projects = Project[];