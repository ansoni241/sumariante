
// import { Head, Link } from '@inertiajs/react';
// import {
//     Archive,
//     ArrowRight,
//     CheckCircle2,
//     Clock3,
//     FileText,
//     FolderOpen,
//     Plus,
//     Scale,
//     ShieldCheck,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import AppLayout from '@/layouts/app-layout';

// type Estadisticas = {
//     total: number;
//     abiertos: number;
//     en_proceso: number;
//     concluidos: number;
//     archivados: number;
// };

// type Expediente = {
//     id: number;
//     numero_expediente: string;
//     titulo: string;
//     tipo_proceso: string | null;
//     gestion: number | string | null;
//     estado: 'abierto' | 'en_proceso' | 'concluido' | 'archivado';
//     created_at: string;
//     creator?: {
//         id: number;
//         name: string;
//     } | null;
// };

// type DashboardProps = {
//     estadisticas: Estadisticas;
//     expedientesRecientes: Expediente[];
// };

// const estadoConfig = {
//     abierto: {
//         label: 'Abierto',
//         className:
//             'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
//         icon: Clock3,
//     },
//     en_proceso: {
//         label: 'En proceso',
//         className:
//             'border-blue-500/20 bg-blue-500/10 text-blue-300',
//         icon: FileText,
//     },
//     concluido: {
//         label: 'Concluido',
//         className:
//             'border-green-500/20 bg-green-500/10 text-green-300',
//         icon: CheckCircle2,
//     },
//     archivado: {
//         label: 'Archivado',
//         className:
//             'border-slate-500/20 bg-slate-500/10 text-slate-300',
//         icon: Archive,
//     },
// };

// function formatDate(date: string): string {
//     const value = new Date(date);

//     if (Number.isNaN(value.getTime())) {
//         return date;
//     }

//     return value.toLocaleDateString('es-BO', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//     });
// }

// function StatCard({
//     title,
//     value,
//     description,
//     icon: Icon,
//     iconClassName,
// }: {
//     title: string;
//     value: number;
//     description: string;
//     icon: typeof FolderOpen;
//     iconClassName: string;
// }) {
//     return (
//         <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/5 backdrop-blur-sm transition-all duration-200 hover:border-white/15 hover:bg-slate-900">
//             <div className="flex items-start justify-between gap-4">
//                 <div>
//                     <p className="text-sm font-medium text-slate-400">
//                         {title}
//                     </p>

//                     <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
//                         {value.toLocaleString('es-BO')}
//                     </p>

//                     <p className="mt-1 text-xs text-slate-500">
//                         {description}
//                     </p>
//                 </div>

//                 <div
//                     className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconClassName}`}
//                 >
//                     <Icon className="h-5 w-5" />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function Dashboard({
//     estadisticas,
//     expedientesRecientes,
// }: DashboardProps) {
//     return (
//         <>
//             <Head title="Dashboard" />

//             <div className="min-h-full bg-slate-950">
//                 <div className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8">
//                     <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7 shadow-2xl shadow-black/10">
//                         <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/5 blur-3xl" />

//                         <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//                             <div className="flex items-start gap-4">
//                                 <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
//                                     <ShieldCheck className="h-7 w-7" />
//                                 </div>

//                                 <div>
//                                     <p className="text-sm font-medium text-emerald-400">
//                                         SISAS
//                                     </p>

//                                     <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
//                                         Panel de control
//                                     </h1>

//                                     <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
//                                         Gestión digital de los procesos
//                                         sumarios de la Unidad Autoridad
//                                         Sumariante.
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="flex flex-wrap gap-3">
//                                 <Button
//                                     asChild
//                                     className="rounded-xl bg-emerald-600 px-5 text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-500"
//                                 >
//                                     <Link href="/expedientes/create">
//                                         <Plus className="mr-2 h-4 w-4" />
//                                         Nuevo expediente
//                                     </Link>
//                                 </Button>

//                                 <Button
//                                     asChild
//                                     variant="outline"
//                                     className="rounded-xl border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.07] hover:text-white"
//                                 >
//                                     <Link href="/expedientes">
//                                         <FolderOpen className="mr-2 h-4 w-4" />
//                                         Ver expedientes
//                                     </Link>
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
//                         <StatCard
//                             title="Expedientes"
//                             value={estadisticas.total}
//                             description="Total registrados"
//                             icon={FolderOpen}
//                             iconClassName="border-white/10 bg-white/[0.04] text-slate-300"
//                         />

//                         <StatCard
//                             title="Abiertos"
//                             value={estadisticas.abiertos}
//                             description="Procesos abiertos"
//                             icon={Clock3}
//                             iconClassName="border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
//                         />

//                         <StatCard
//                             title="En proceso"
//                             value={estadisticas.en_proceso}
//                             description="Actualmente en trámite"
//                             icon={FileText}
//                             iconClassName="border-blue-500/20 bg-blue-500/10 text-blue-400"
//                         />

//                         <StatCard
//                             title="Concluidos"
//                             value={estadisticas.concluidos}
//                             description="Procesos finalizados"
//                             icon={CheckCircle2}
//                             iconClassName="border-green-500/20 bg-green-500/10 text-green-400"
//                         />

//                         <StatCard
//                             title="Archivados"
//                             value={estadisticas.archivados}
//                             description="Procesos archivados"
//                             icon={Archive}
//                             iconClassName="border-slate-500/20 bg-slate-500/10 text-slate-400"
//                         />
//                     </div>

//                     <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
//                         <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/5">
//                             <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
//                                 <div>
//                                     <h2 className="font-semibold text-white">
//                                         Expedientes recientes
//                                     </h2>

//                                     <p className="mt-1 text-sm text-slate-500">
//                                         Últimos procesos registrados en SISAS.
//                                     </p>
//                                 </div>

//                                 <Button
//                                     asChild
//                                     variant="ghost"
//                                     className="text-slate-400 hover:bg-white/5 hover:text-white"
//                                 >
//                                     <Link href="/expedientes">
//                                         Ver todos
//                                         <ArrowRight className="ml-2 h-4 w-4" />
//                                     </Link>
//                                 </Button>
//                             </div>

//                             {expedientesRecientes.length > 0 ? (
//                                 <div className="divide-y divide-white/5">
//                                     {expedientesRecientes.map((expediente) => {
//                                         const config =
//                                             estadoConfig[expediente.estado];

//                                         const StatusIcon = config.icon;

//                                         return (
//                                             <Link
//                                                 key={expediente.id}
//                                                 href={`/expedientes/${expediente.id}`}
//                                                 className="group flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"
//                                             >
//                                                 <div className="flex min-w-0 items-center gap-4">
//                                                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
//                                                         <FileText className="h-5 w-5" />
//                                                     </div>

//                                                     <div className="min-w-0">
//                                                         <div className="flex flex-wrap items-center gap-2">
//                                                             <span className="font-medium text-white">
//                                                                 {
//                                                                     expediente.numero_expediente
//                                                                 }
//                                                             </span>

//                                                             {expediente.gestion && (
//                                                                 <span className="text-xs text-slate-500">
//                                                                     Gestión{' '}
//                                                                     {
//                                                                         expediente.gestion
//                                                                     }
//                                                                 </span>
//                                                             )}
//                                                         </div>

//                                                         <p className="mt-1 truncate text-sm text-slate-400">
//                                                             {
//                                                                 expediente.titulo
//                                                             }
//                                                         </p>

//                                                         <p className="mt-1 text-xs text-slate-600">
//                                                             Registrado el{' '}
//                                                             {formatDate(
//                                                                 expediente.created_at,
//                                                             )}
//                                                         </p>
//                                                     </div>
//                                                 </div>

//                                                 <div
//                                                     className={`flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${config.className}`}
//                                                 >
//                                                     <StatusIcon className="h-3.5 w-3.5" />
//                                                     {config.label}
//                                                 </div>
//                                             </Link>
//                                         );
//                                     })}
//                                 </div>
//                             ) : (
//                                 <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
//                                     <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500">
//                                         <FolderOpen className="h-7 w-7" />
//                                     </div>

//                                     <h3 className="mt-4 font-medium text-white">
//                                         No existen expedientes registrados
//                                     </h3>

//                                     <p className="mt-1 max-w-sm text-sm text-slate-500">
//                                         Cuando se registre un proceso sumario,
//                                         aparecerá aquí.
//                                     </p>

//                                     <Button
//                                         asChild
//                                         className="mt-5 rounded-xl bg-emerald-600 hover:bg-emerald-500"
//                                     >
//                                         <Link href="/expedientes/create">
//                                             <Plus className="mr-2 h-4 w-4" />
//                                             Crear expediente
//                                         </Link>
//                                     </Button>
//                                 </div>
//                             )}
//                         </section>

//                         <aside className="space-y-6">
//                             <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/5">
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
//                                         <Scale className="h-5 w-5" />
//                                     </div>

//                                     <div>
//                                         <h2 className="font-semibold text-white">
//                                             SISAS
//                                         </h2>

//                                         <p className="text-xs text-slate-500">
//                                             Sistema de Autoridad Sumariante
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="mt-6 space-y-4">
//                                     <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
//                                         <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                             Gestión documental
//                                         </p>

//                                         <p className="mt-2 text-sm leading-6 text-slate-400">
//                                             Plataforma destinada al registro,
//                                             almacenamiento y consulta digital
//                                             de procesos sumarios.
//                                         </p>
//                                     </div>

//                                     <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
//                                         <span className="text-sm text-slate-400">
//                                             Expedientes almacenados
//                                         </span>

//                                         <span className="font-semibold text-white">
//                                             {estadisticas.total.toLocaleString(
//                                                 'es-BO',
//                                             )}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/5">
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300">
//                                         <Archive className="h-5 w-5" />
//                                     </div>

//                                     <div>
//                                         <h2 className="font-semibold text-white">
//                                             Acciones rápidas
//                                         </h2>

//                                         <p className="text-xs text-slate-500">
//                                             Accesos frecuentes
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="mt-5 space-y-2">
//                                     <Button
//                                         asChild
//                                         variant="ghost"
//                                         className="h-11 w-full justify-between rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
//                                     >
//                                         <Link href="/expedientes/create">
//                                             <span className="flex items-center">
//                                                 <Plus className="mr-3 h-4 w-4" />
//                                                 Nuevo expediente
//                                             </span>

//                                             <ArrowRight className="h-4 w-4 text-slate-600" />
//                                         </Link>
//                                     </Button>

//                                     <Button
//                                         asChild
//                                         variant="ghost"
//                                         className="h-11 w-full justify-between rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
//                                     >
//                                         <Link href="/expedientes">
//                                             <span className="flex items-center">
//                                                 <FolderOpen className="mr-3 h-4 w-4" />
//                                                 Todos los expedientes
//                                             </span>

//                                             <ArrowRight className="h-4 w-4 text-slate-600" />
//                                         </Link>
//                                     </Button>
//                                 </div>
//                             </div>
//                         </aside>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
import { Head, Link } from '@inertiajs/react';
import {
    Archive,
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileText,
    FolderOpen,
    Plus,
    Scale,
    ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';

type Estadisticas = {
    total: number;
    abiertos: number;
    en_proceso: number;
    concluidos: number;
    archivados: number;
};

type Expediente = {
    id: number;
    numero_expediente: string;
    titulo: string;
    tipo_proceso: string | null;
    gestion: number | string | null;
    estado: 'abierto' | 'en_proceso' | 'concluido' | 'archivado';
    created_at: string;
    creator?: {
        id: number;
        name: string;
    } | null;
};

type DashboardProps = {
    estadisticas: Estadisticas;
    expedientesRecientes: Expediente[];
};

const estadoConfig = {
    abierto: {
        label: 'Abierto',
        className:
            'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
        icon: Clock3,
    },
    en_proceso: {
        label: 'En proceso',
        className:
            'border-blue-500/20 bg-blue-500/10 text-blue-300',
        icon: FileText,
    },
    concluido: {
        label: 'Concluido',
        className:
            'border-green-500/20 bg-green-500/10 text-green-300',
        icon: CheckCircle2,
    },
    archivado: {
        label: 'Archivado',
        className:
            'border-slate-500/20 bg-slate-500/10 text-slate-300',
        icon: Archive,
    },
};

function formatDate(date: string): string {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return date;
    }

    return value.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
}: {
    title: string;
    value: number;
    description: string;
    icon: typeof FolderOpen;
    iconClassName: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/5 backdrop-blur-sm transition-all duration-200 hover:border-white/15 hover:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-400">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                        {value.toLocaleString('es-BO')}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconClassName}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({
    estadisticas,
    expedientesRecientes,
}: DashboardProps) {
    const { can } = usePermissions();

    const canViewExpedientes = can('expedientes.view');
    const canCreateExpedientes = can('expedientes.create');

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-full bg-slate-950">
                <div className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7 shadow-2xl shadow-black/10">
                        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/5 blur-3xl" />

                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-emerald-400">
                                        SISAS
                                    </p>

                                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                                        Panel de control
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                        Gestión digital de los procesos
                                        sumarios de la Unidad Autoridad
                                        Sumariante.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {canCreateExpedientes && (
                                    <Button
                                        asChild
                                        className="rounded-xl bg-emerald-600 px-5 text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-500"
                                    >
                                        <Link href="/expedientes/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Nuevo expediente
                                        </Link>
                                    </Button>
                                )}

                                {canViewExpedientes && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-xl border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.07] hover:text-white"
                                    >
                                        <Link href="/expedientes">
                                            <FolderOpen className="mr-2 h-4 w-4" />
                                            Ver expedientes
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <StatCard
                            title="Expedientes"
                            value={estadisticas.total}
                            description="Total registrados"
                            icon={FolderOpen}
                            iconClassName="border-white/10 bg-white/[0.04] text-slate-300"
                        />

                        <StatCard
                            title="Abiertos"
                            value={estadisticas.abiertos}
                            description="Procesos abiertos"
                            icon={Clock3}
                            iconClassName="border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        />

                        <StatCard
                            title="En proceso"
                            value={estadisticas.en_proceso}
                            description="Actualmente en trámite"
                            icon={FileText}
                            iconClassName="border-blue-500/20 bg-blue-500/10 text-blue-400"
                        />

                        <StatCard
                            title="Concluidos"
                            value={estadisticas.concluidos}
                            description="Procesos finalizados"
                            icon={CheckCircle2}
                            iconClassName="border-green-500/20 bg-green-500/10 text-green-400"
                        />

                        <StatCard
                            title="Archivados"
                            value={estadisticas.archivados}
                            description="Procesos archivados"
                            icon={Archive}
                            iconClassName="border-slate-500/20 bg-slate-500/10 text-slate-400"
                        />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/5">
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <div>
                                    <h2 className="font-semibold text-white">
                                        Expedientes recientes
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Últimos procesos registrados en SISAS.
                                    </p>
                                </div>

                                {canViewExpedientes && (
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="text-slate-400 hover:bg-white/5 hover:text-white"
                                    >
                                        <Link href="/expedientes">
                                            Ver todos
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {canViewExpedientes &&
                            expedientesRecientes.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {expedientesRecientes.map(
                                        (expediente) => {
                                            const config =
                                                estadoConfig[
                                                    expediente.estado
                                                ];

                                            const StatusIcon =
                                                config.icon;

                                            return (
                                                <Link
                                                    key={expediente.id}
                                                    href={`/expedientes/${expediente.id}`}
                                                    className="group flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                                                            <FileText className="h-5 w-5" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="font-medium text-white">
                                                                    {
                                                                        expediente.numero_expediente
                                                                    }
                                                                </span>

                                                                {expediente.gestion && (
                                                                    <span className="text-xs text-slate-500">
                                                                        Gestión{' '}
                                                                        {
                                                                            expediente.gestion
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-1 truncate text-sm text-slate-400">
                                                                {
                                                                    expediente.titulo
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-600">
                                                                Registrado el{' '}
                                                                {formatDate(
                                                                    expediente.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${config.className}`}
                                                    >
                                                        <StatusIcon className="h-3.5 w-3.5" />
                                                        {config.label}
                                                    </div>
                                                </Link>
                                            );
                                        },
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500">
                                        <FolderOpen className="h-7 w-7" />
                                    </div>

                                    <h3 className="mt-4 font-medium text-white">
                                        {canViewExpedientes
                                            ? 'No existen expedientes registrados'
                                            : 'Sin acceso a expedientes'}
                                    </h3>

                                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                                        {canViewExpedientes
                                            ? 'Cuando se registre un proceso sumario, aparecerá aquí.'
                                            : 'No tiene permisos para consultar los expedientes registrados.'}
                                    </p>

                                    {canCreateExpedientes && (
                                        <Button
                                            asChild
                                            className="mt-5 rounded-xl bg-emerald-600 hover:bg-emerald-500"
                                        >
                                            <Link href="/expedientes/create">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Crear expediente
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </section>

                        <aside className="space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                        <Scale className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-white">
                                            SISAS
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            Sistema de Autoridad Sumariante
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Gestión documental
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            Plataforma destinada al registro,
                                            almacenamiento y consulta digital
                                            de procesos sumarios.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                                        <span className="text-sm text-slate-400">
                                            Expedientes almacenados
                                        </span>

                                        <span className="font-semibold text-white">
                                            {estadisticas.total.toLocaleString(
                                                'es-BO',
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300">
                                        <Archive className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-white">
                                            Acciones rápidas
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            Accesos frecuentes
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2">
                                    {canCreateExpedientes && (
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="h-11 w-full justify-between rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                                        >
                                            <Link href="/expedientes/create">
                                                <span className="flex items-center">
                                                    <Plus className="mr-3 h-4 w-4" />
                                                    Nuevo expediente
                                                </span>

                                                <ArrowRight className="h-4 w-4 text-slate-600" />
                                            </Link>
                                        </Button>
                                    )}

                                    {canViewExpedientes && (
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="h-11 w-full justify-between rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                                        >
                                            <Link href="/expedientes">
                                                <span className="flex items-center">
                                                    <FolderOpen className="mr-3 h-4 w-4" />
                                                    Todos los expedientes
                                                </span>

                                                <ArrowRight className="h-4 w-4 text-slate-600" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
