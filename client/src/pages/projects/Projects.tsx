
import { useState, useEffect } from "react";
import { getProjects } from "../../api/project.api";

interface Project  {
    name: string;
    description?: string;
    status: string | undefined;
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
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true)
            
            const response = await getProjects({
                page, 
                limit,
                search: debouncedSearch,
                client: clientFilter, 
                status: statusFilter
            });

            setProjects(response.data);
            setTotalPages(response.pages);
            setLoading(false);
        }

        fetchProjects();
    }, [page, limit, debouncedSearch, clientFilter, statusFilter]);
}

export default Projects;