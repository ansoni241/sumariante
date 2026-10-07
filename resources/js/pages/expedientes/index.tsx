// import { Head, Link, router } from '@inertiajs/react';
// import {
//     Eye,
//     FileText,
//     FolderOpen,
//     Pencil,
//     Plus,
//     Search,
//     Trash2,
// } from 'lucide-react';
// import { useEffect, useState } from 'react';

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { usePermissions } from '@/hooks/use-permissions';
// import type { PaginatedResponse } from '@/types';

// type ExpedienteEstado =
//     | 'abierto'
//     | 'en_proceso'
//     | 'concluido'
//     | 'archivado';

// type Usuario = {
//     id: number;
//     name: string;
//     apellido?: string | null;
// };

// type Expediente = {
//     id: number;
//     numero_expediente: string;
//     titulo: string;
//     tipo_proceso?: string | null;
//     gestion?: number | null;
//     fecha_inicio?: string | null;
//     fecha_cierre?: string | null;
//     estado: ExpedienteEstado;
//     descripcion?: string | null;
//     observaciones?: string | null;
//     creator?: Usuario | null;
//     updater?: Usuario | null;
//     created_at: string;
//     updated_at: string;
// };

// type Props = {
//     expedientes: PaginatedResponse<Expediente>;
//     filters: {
//         search?: string;
//         estado?: string;
//         gestion?: string;
//     };
// };

// const estados: {
//     value: ExpedienteEstado;
//     label: string;
// }[] = [
//     {
//         value: 'abierto',
//         label: 'Abierto',
//     },
//     {
//         value: 'en_proceso',
//         label: 'En proceso',
//     },
//     {
//         value: 'concluido',
//         label: 'Concluido',
//     },
//     {
//         value: 'archivado',
//         label: 'Archivado',
//     },
// ];

// function getEstadoLabel(estado: ExpedienteEstado) {
//     return (
//         estados.find((item) => item.value === estado)?.label ??
//         estado
//     );
// }

// function getEstadoClass(estado: ExpedienteEstado) {
//     switch (estado) {
//         case 'abierto':
//             return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';

//         case 'en_proceso':
//             return 'border-blue-500/20 bg-blue-500/10 text-blue-400';

//         case 'concluido':
//             return 'border-violet-500/20 bg-violet-500/10 text-violet-400';

//         case 'archivado':
//             return 'border-slate-500/20 bg-slate-500/10 text-slate-400';

//         default:
//             return 'border-slate-500/20 bg-slate-500/10 text-slate-400';
//     }
// }

// function formatDate(date?: string | null) {
//     if (!date) {
//         return '—';
//     }

//     return new Intl.DateTimeFormat('es-BO', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//     }).format(new Date(date));
// }

// function getUserName(user?: Usuario | null) {
//     if (!user) {
//         return '—';
//     }

//     return `${user.name} ${user.apellido ?? ''}`.trim();
// }

// export default function Index({
//     expedientes,
//     filters,
// }: Props) {
//     const { can } = usePermissions();

//     const [search, setSearch] = useState(
//         filters.search ?? '',
//     );

//     const [estado, setEstado] = useState(
//         filters.estado ?? '',
//     );

//     const [gestion, setGestion] = useState(
//         filters.gestion ?? '',
//     );

//     useEffect(() => {
//         const timeout = window.setTimeout(() => {
//             router.get(
//                 '/expedientes',
//                 {
//                     search: search || undefined,
//                     estado: estado || undefined,
//                     gestion: gestion || undefined,
//                 },
//                 {
//                     preserveState: true,
//                     preserveScroll: true,
//                     replace: true,
//                 },
//             );
//         }, 400);

//         return () => {
//             window.clearTimeout(timeout);
//         };
//     }, [search, estado, gestion]);

//     const handleDelete = (expediente: Expediente) => {
//         if (!can('expedientes.delete')) {
//             return;
//         }

//         const confirmed = window.confirm(
//             `¿Está seguro de eliminar el expediente ${expediente.numero_expediente}?`,
//         );

//         if (!confirmed) {
//             return;
//         }

//         router.delete(
//             `/expedientes/${expediente.id}`,
//             {
//                 preserveScroll: true,
//             },
//         );
//     };

//     const total = expedientes.total;

//     return (
//         <>
//             <Head title="Expedientes" />

//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 {/* Header */}
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
//                             <FolderOpen className="h-5 w-5" />
//                         </div>

//                         <div>
//                             <h1 className="text-xl font-semibold tracking-tight text-white">
//                                 Expedientes
//                             </h1>

//                             <p className="text-sm text-slate-400">
//                                 Gestión y seguimiento de los procesos sumarios
//                             </p>
//                         </div>
//                     </div>

//                     {can('expedientes.create') && (
//                         <Button
//                             asChild
//                             className="bg-blue-600 text-white hover:bg-blue-500"
//                         >
//                             <Link href="/expedientes/create">
//                                 <Plus className="mr-2 h-4 w-4" />
//                                 Nuevo expediente
//                             </Link>
//                         </Button>
//                     )}
//                 </div>

//                 {/* Summary */}
//                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                     <Card className="border-white/10 bg-slate-950/40">
//                         <CardContent className="flex items-center gap-3 p-4">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
//                                 <FileText className="h-5 w-5" />
//                             </div>

//                             <div>
//                                 <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                     Expedientes
//                                 </p>

//                                 <p className="text-xl font-semibold text-white">
//                                     {total}
//                                 </p>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-white/10 bg-slate-950/40">
//                         <CardContent className="flex items-center gap-3 p-4">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
//                                 <FolderOpen className="h-5 w-5" />
//                             </div>

//                             <div>
//                                 <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                     Abiertos
//                                 </p>

//                                 <p className="text-xl font-semibold text-white">
//                                     {expedientes.data.filter(
//                                         (item) =>
//                                             item.estado === 'abierto',
//                                     ).length}
//                                 </p>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-white/10 bg-slate-950/40">
//                         <CardContent className="flex items-center gap-3 p-4">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
//                                 <FileText className="h-5 w-5" />
//                             </div>

//                             <div>
//                                 <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                     En proceso
//                                 </p>

//                                 <p className="text-xl font-semibold text-white">
//                                     {expedientes.data.filter(
//                                         (item) =>
//                                             item.estado === 'en_proceso',
//                                     ).length}
//                                 </p>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-white/10 bg-slate-950/40">
//                         <CardContent className="flex items-center gap-3 p-4">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
//                                 <FileText className="h-5 w-5" />
//                             </div>

//                             <div>
//                                 <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                     Concluidos
//                                 </p>

//                                 <p className="text-xl font-semibold text-white">
//                                     {expedientes.data.filter(
//                                         (item) =>
//                                             item.estado === 'concluido',
//                                     ).length}
//                                 </p>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Filters */}
//                 <Card className="border-white/10 bg-slate-950/40">
//                     <CardContent className="p-4">
//                         <div className="grid gap-3 lg:grid-cols-[1fr_200px_160px]">
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

//                                 <Input
//                                     value={search}
//                                     onChange={(event) =>
//                                         setSearch(
//                                             event.target.value,
//                                         )
//                                     }
//                                     placeholder="Buscar por número, título o tipo de proceso..."
//                                     className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
//                                 />
//                             </div>

//                             <select
//                                 value={estado}
//                                 onChange={(event) =>
//                                     setEstado(event.target.value)
//                                 }
//                                 className="h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-slate-300 outline-none focus:border-blue-500"
//                             >
//                                 <option value="">
//                                     Todos los estados
//                                 </option>

//                                 {estados.map((item) => (
//                                     <option
//                                         key={item.value}
//                                         value={item.value}
//                                     >
//                                         {item.label}
//                                     </option>
//                                 ))}
//                             </select>

//                             <Input
//                                 value={gestion}
//                                 onChange={(event) =>
//                                     setGestion(
//                                         event.target.value.replace(
//                                             /\D/g,
//                                             '',
//                                         ),
//                                     )
//                                 }
//                                 placeholder="Gestión"
//                                 inputMode="numeric"
//                                 maxLength={4}
//                                 className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
//                             />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Table */}
//                 <Card className="overflow-hidden border-white/10 bg-slate-950/40">
//                     <div className="overflow-x-auto">
//                         <table className="w-full min-w-[1000px]">
//                             <thead>
//                                 <tr className="border-b border-white/10 bg-white/[0.02]">
//                                     <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
//                                         Expediente
//                                     </th>

//                                     <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
//                                         Proceso
//                                     </th>

//                                     <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
//                                         Gestión
//                                     </th>

//                                     <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
//                                         Inicio
//                                     </th>

//                                     <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
//                                         Estado
//                                     </th>

//                                     <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
//                                         Creado por
//                                     </th>

//                                     <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
//                                         Acciones
//                                     </th>
//                                 </tr>
//                             </thead>

//                             <tbody className="divide-y divide-white/5">
//                                 {expedientes.data.length === 0 ? (
//                                     <tr>
//                                         <td
//                                             colSpan={7}
//                                             className="px-5 py-16 text-center"
//                                         >
//                                             <div className="mx-auto flex max-w-sm flex-col items-center">
//                                                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-500">
//                                                     <FolderOpen className="h-6 w-6" />
//                                                 </div>

//                                                 <h3 className="text-sm font-semibold text-slate-300">
//                                                     No se encontraron expedientes
//                                                 </h3>

//                                                 <p className="mt-1 text-sm text-slate-500">
//                                                     No existen expedientes que coincidan con los criterios de búsqueda.
//                                                 </p>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     expedientes.data.map(
//                                         (expediente) => (
//                                             <tr
//                                                 key={expediente.id}
//                                                 className="group transition-colors hover:bg-white/[0.025]"
//                                             >
//                                                 <td className="px-5 py-4">
//                                                     <div>
//                                                         <Link
//                                                             href={`/expedientes/${expediente.id}`}
//                                                             className="font-medium text-white transition-colors hover:text-blue-400"
//                                                         >
//                                                             {
//                                                                 expediente.numero_expediente
//                                                             }
//                                                         </Link>

//                                                         <p className="mt-1 max-w-[280px] truncate text-sm text-slate-500">
//                                                             {
//                                                                 expediente.titulo
//                                                             }
//                                                         </p>
//                                                     </div>
//                                                 </td>

//                                                 <td className="px-5 py-4">
//                                                     <span className="text-sm text-slate-300">
//                                                         {
//                                                             expediente.tipo_proceso ??
//                                                             '—'
//                                                         }
//                                                     </span>
//                                                 </td>

//                                                 <td className="px-5 py-4">
//                                                     <span className="text-sm text-slate-300">
//                                                         {
//                                                             expediente.gestion ??
//                                                             '—'
//                                                         }
//                                                     </span>
//                                                 </td>

//                                                 <td className="px-5 py-4">
//                                                     <span className="text-sm text-slate-400">
//                                                         {formatDate(
//                                                             expediente.fecha_inicio,
//                                                         )}
//                                                     </span>
//                                                 </td>

//                                                 <td className="px-5 py-4">
//                                                     <Badge
//                                                         variant="outline"
//                                                         className={getEstadoClass(
//                                                             expediente.estado,
//                                                         )}
//                                                     >
//                                                         {getEstadoLabel(
//                                                             expediente.estado,
//                                                         )}
//                                                     </Badge>
//                                                 </td>

//                                                 <td className="px-5 py-4">
//                                                     <span className="text-sm text-slate-400">
//                                                         {getUserName(
//                                                             expediente.creator,
//                                                         )}
//                                                     </span>
//                                                 </td>

//                                                 <td className="px-5 py-4">
//                                                     <div className="flex justify-end gap-1">
//                                                         <Button
//                                                             asChild
//                                                             variant="ghost"
//                                                             size="icon"
//                                                             className="text-slate-400 hover:bg-blue-500/10 hover:text-blue-400"
//                                                         >
//                                                             <Link
//                                                                 href={`/expedientes/${expediente.id}`}
//                                                             >
//                                                                 <Eye className="h-4 w-4" />
//                                                             </Link>
//                                                         </Button>

//                                                         {can(
//                                                             'expedientes.edit',
//                                                         ) && (
//                                                             <Button
//                                                                 asChild
//                                                                 variant="ghost"
//                                                                 size="icon"
//                                                                 className="text-slate-400 hover:bg-amber-500/10 hover:text-amber-400"
//                                                             >
//                                                                 <Link
//                                                                     href={`/expedientes/${expediente.id}/edit`}
//                                                                 >
//                                                                     <Pencil className="h-4 w-4" />
//                                                                 </Link>
//                                                             </Button>
//                                                         )}

//                                                         {can(
//                                                             'expedientes.delete',
//                                                         ) && (
//                                                             <Button
//                                                                 type="button"
//                                                                 variant="ghost"
//                                                                 size="icon"
//                                                                 onClick={() =>
//                                                                     handleDelete(
//                                                                         expediente,
//                                                                     )
//                                                                 }
//                                                                 className="text-slate-400 hover:bg-red-500/10 hover:text-red-400"
//                                                             >
//                                                                 <Trash2 className="h-4 w-4" />
//                                                             </Button>
//                                                         )}
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ),
//                                     )
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     {expedientes.links &&
//                         expedientes.links.length > 3 && (
//                             <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
//                                 <p className="text-sm text-slate-500">
//                                     Mostrando{' '}
//                                     <span className="text-slate-300">
//                                         {expedientes.from ?? 0}
//                                     </span>{' '}
//                                     a{' '}
//                                     <span className="text-slate-300">
//                                         {expedientes.to ?? 0}
//                                     </span>{' '}
//                                     de{' '}
//                                     <span className="text-slate-300">
//                                         {expedientes.total}
//                                     </span>{' '}
//                                     expedientes
//                                 </p>

//                                 <div className="flex gap-1">
//                                     {expedientes.links.map(
//                                         (link, index) => (
//                                             <Button
//                                                 key={`${link.label}-${index}`}
//                                                 variant={
//                                                     link.active
//                                                         ? 'default'
//                                                         : 'ghost'
//                                                 }
//                                                 size="sm"
//                                                 disabled={
//                                                     !link.url
//                                                 }
//                                                 onClick={() => {
//                                                     if (
//                                                         link.url
//                                                     ) {
//                                                         router.visit(
//                                                             link.url,
//                                                             {
//                                                                 preserveState: true,
//                                                                 preserveScroll: true,
//                                                             },
//                                                         );
//                                                     }
//                                                 }}
//                                                 className={
//                                                     link.active
//                                                         ? 'bg-blue-600 text-white hover:bg-blue-500'
//                                                         : 'text-slate-400 hover:bg-white/5 hover:text-white'
//                                                 }
//                                             >
//                                                 <span
//                                                     dangerouslySetInnerHTML={{
//                                                         __html: link.label,
//                                                     }}
//                                                 />
//                                             </Button>
//                                         ),
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                 </Card>
//             </div>
//         </>
//     );
// }
import { Head, Link, router } from '@inertiajs/react';
import {
    Eye,
    FileText,
    FolderOpen,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePermissions } from '@/hooks/use-permissions';
import type { PaginatedResponse } from '@/types';

type ExpedienteEstado =
    | 'abierto'
    | 'en_proceso'
    | 'concluido'
    | 'archivado';

type Usuario = {
    id: number;
    name: string;
    apellido?: string | null;
};

type Expediente = {
    id: number;
    numero_expediente: string;
    titulo: string;
    tipo_proceso?: string | null;
    gestion?: number | null;
    fecha_inicio?: string | null;
    fecha_cierre?: string | null;
    estado: ExpedienteEstado;
    descripcion?: string | null;
    observaciones?: string | null;
    creator?: Usuario | null;
    updater?: Usuario | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    expedientes: PaginatedResponse<Expediente>;
    filters: {
        search?: string;
        estado?: string;
        gestion?: string;
    };
};

const estados: {
    value: ExpedienteEstado;
    label: string;
}[] = [
    {
        value: 'abierto',
        label: 'Abierto',
    },
    {
        value: 'en_proceso',
        label: 'En proceso',
    },
    {
        value: 'concluido',
        label: 'Concluido',
    },
    {
        value: 'archivado',
        label: 'Archivado',
    },
];

function getEstadoLabel(estado: ExpedienteEstado) {
    return (
        estados.find((item) => item.value === estado)?.label ??
        estado
    );
}

function getEstadoClass(estado: ExpedienteEstado) {
    switch (estado) {
        case 'abierto':
            return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';

        case 'en_proceso':
            return 'border-blue-500/20 bg-blue-500/10 text-blue-400';

        case 'concluido':
            return 'border-violet-500/20 bg-violet-500/10 text-violet-400';

        case 'archivado':
            return 'border-slate-500/20 bg-slate-500/10 text-slate-400';

        default:
            return 'border-slate-500/20 bg-slate-500/10 text-slate-400';
    }
}

function formatDate(date?: string | null) {
    if (!date) {
        return '—';
    }

    return new Intl.DateTimeFormat('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date));
}

function getUserName(user?: Usuario | null) {
    if (!user) {
        return '—';
    }

    return `${user.name} ${user.apellido ?? ''}`.trim();
}

export default function Index({
    expedientes,
    filters,
}: Props) {
    const { can } = usePermissions();

    const [search, setSearch] = useState(
        filters.search ?? '',
    );

    const [estado, setEstado] = useState(
        filters.estado ?? '',
    );

    const [gestion, setGestion] = useState(
        filters.gestion ?? '',
    );

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            router.get(
                '/expedientes',
                {
                    search: search || undefined,
                    estado: estado || undefined,
                    gestion: gestion || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [search, estado, gestion]);

    const handleDelete = (expediente: Expediente) => {
        if (!can('expedientes.delete')) {
            return;
        }

        const confirmed = window.confirm(
            `¿Está seguro de eliminar el expediente ${expediente.numero_expediente}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/expedientes/${expediente.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    const canView = can('expedientes.view');
    const canCreate = can('expedientes.create');
    const canEdit = can('expedientes.edit');
    const canDelete = can('expedientes.delete');

    const showActions =
        canView ||
        canEdit ||
        canDelete;

    const total = expedientes.total;

    return (
        <>
            <Head title="Expedientes" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                            <FolderOpen className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-white">
                                Expedientes
                            </h1>

                            <p className="text-sm text-slate-400">
                                Gestión y seguimiento de los procesos sumarios
                            </p>
                        </div>
                    </div>

                    {canCreate && (
                        <Button
                            asChild
                            className="bg-blue-600 text-white hover:bg-blue-500"
                        >
                            <Link href="/expedientes/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo expediente
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-white/10 bg-slate-950/40">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                <FileText className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Expedientes
                                </p>

                                <p className="text-xl font-semibold text-white">
                                    {total}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-950/40">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                <FolderOpen className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Abiertos
                                </p>

                                <p className="text-xl font-semibold text-white">
                                    {expedientes.data.filter(
                                        (item) =>
                                            item.estado === 'abierto',
                                    ).length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-950/40">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                <FileText className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    En proceso
                                </p>

                                <p className="text-xl font-semibold text-white">
                                    {expedientes.data.filter(
                                        (item) =>
                                            item.estado === 'en_proceso',
                                    ).length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-950/40">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                <FileText className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Concluidos
                                </p>

                                <p className="text-xl font-semibold text-white">
                                    {expedientes.data.filter(
                                        (item) =>
                                            item.estado === 'concluido',
                                    ).length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-white/10 bg-slate-950/40">
                    <CardContent className="p-4">
                        <div className="grid gap-3 lg:grid-cols-[1fr_200px_160px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Buscar por número, título o tipo de proceso..."
                                    className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
                                />
                            </div>

                            <select
                                value={estado}
                                onChange={(event) =>
                                    setEstado(event.target.value)
                                }
                                className="h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-slate-300 outline-none focus:border-blue-500"
                            >
                                <option value="">
                                    Todos los estados
                                </option>

                                {estados.map((item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                            </select>

                            <Input
                                value={gestion}
                                onChange={(event) =>
                                    setGestion(
                                        event.target.value.replace(
                                            /\D/g,
                                            '',
                                        ),
                                    )
                                }
                                placeholder="Gestión"
                                inputMode="numeric"
                                maxLength={4}
                                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="overflow-hidden border-white/10 bg-slate-950/40">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Expediente
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Proceso
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Gestión
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Inicio
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Estado
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Creado por
                                    </th>

                                    {showActions && (
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Acciones
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">
                                {expedientes.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={showActions ? 7 : 6}
                                            className="px-5 py-16 text-center"
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-500">
                                                    <FolderOpen className="h-6 w-6" />
                                                </div>

                                                <h3 className="text-sm font-semibold text-slate-300">
                                                    No se encontraron expedientes
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    No existen expedientes que coincidan con los criterios de búsqueda.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    expedientes.data.map(
                                        (expediente) => (
                                            <tr
                                                key={expediente.id}
                                                className="group transition-colors hover:bg-white/[0.025]"
                                            >
                                                <td className="px-5 py-4">
                                                    <div>
                                                        <Link
                                                            href={`/expedientes/${expediente.id}`}
                                                            className="font-medium text-white transition-colors hover:text-blue-400"
                                                        >
                                                            {
                                                                expediente.numero_expediente
                                                            }
                                                        </Link>

                                                        <p className="mt-1 max-w-[280px] truncate text-sm text-slate-500">
                                                            {
                                                                expediente.titulo
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-slate-300">
                                                        {
                                                            expediente.tipo_proceso ??
                                                            '—'
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-slate-300">
                                                        {
                                                            expediente.gestion ??
                                                            '—'
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-slate-400">
                                                        {formatDate(
                                                            expediente.fecha_inicio,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={getEstadoClass(
                                                            expediente.estado,
                                                        )}
                                                    >
                                                        {getEstadoLabel(
                                                            expediente.estado,
                                                        )}
                                                    </Badge>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-slate-400">
                                                        {getUserName(
                                                            expediente.creator,
                                                        )}
                                                    </span>
                                                </td>

                                                {showActions && (
                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-1">
                                                            {canView && (
                                                                <Button
                                                                    asChild
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-slate-400 hover:bg-blue-500/10 hover:text-blue-400"
                                                                >
                                                                    <Link
                                                                        href={`/expedientes/${expediente.id}`}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            )}

                                                            {canEdit && (
                                                                <Button
                                                                    asChild
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-slate-400 hover:bg-amber-500/10 hover:text-amber-400"
                                                                >
                                                                    <Link
                                                                        href={`/expedientes/${expediente.id}/edit`}
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            )}

                                                            {canDelete && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            expediente,
                                                                        )
                                                                    }
                                                                    className="text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ),
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {expedientes.links &&
                        expedientes.links.length > 3 && (
                            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
                                <p className="text-sm text-slate-500">
                                    Mostrando{' '}
                                    <span className="text-slate-300">
                                        {expedientes.from ?? 0}
                                    </span>{' '}
                                    a{' '}
                                    <span className="text-slate-300">
                                        {expedientes.to ?? 0}
                                    </span>{' '}
                                    de{' '}
                                    <span className="text-slate-300">
                                        {expedientes.total}
                                    </span>{' '}
                                    expedientes
                                </p>

                                <div className="flex gap-1">
                                    {expedientes.links.map(
                                        (link, index) => (
                                            <Button
                                                key={`${link.label}-${index}`}
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'ghost'
                                                }
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(
                                                            link.url,
                                                            {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            },
                                                        );
                                                    }
                                                }}
                                                className={
                                                    link.active
                                                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                }
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            </Button>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                </Card>
            </div>
        </>
    );
}
