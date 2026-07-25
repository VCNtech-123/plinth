
import { useState, useEffect } from "react";

interface Project  {
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'paused';
    deadline?: Date;
    budget?: number;
    client: string;
    owner: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const Projects = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [clientFilter, setClientFilter] = useState<string | undefined>();
    const [statusFilter, setStatusFilter] = useState<string | undefined>();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500);

        return () => clearTimeout(timer);
    }, [ search ]);
}

export default Projects;