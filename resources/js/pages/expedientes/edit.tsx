// import { Head, Link } from '@inertiajs/react';
// import {
//     ArrowLeft,
//     FolderPen,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { ExpedienteForm } from './form/ExpedienteForm';

// type Expediente = {
//     id: number;
//     numero_expediente?: string | null;
//     titulo?: string | null;
//     tipo_proceso?: string | null;
//     gestion?: number | null;
//     fecha_inicio?: string | null;
//     fecha_cierre?: string | null;
//     estado?: string | null;
//     descripcion?: string | null;
//     observaciones?: string | null;
// };

// type Props = {
//     expediente: Expediente;
// };

// export default function Edit({
//     expediente,
// }: Props) {
//     return (
//         <>
//             <Head
//                 title={`Editar ${expediente.numero_expediente}`}
//             />

//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 {/* Header */}
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
//                             <FolderPen className="h-5 w-5" />
//                         </div>

//                         <div>
//                             <div className="flex flex-wrap items-center gap-2">
//                                 <h1 className="text-xl font-semibold tracking-tight text-white">
//                                     Editar expediente
//                                 </h1>

//                                 <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-400">
//                                     {
//                                         expediente.numero_expediente
//                                     }
//                                 </span>
//                             </div>

//                             <p className="text-sm text-slate-400">
//                                 Modifique la información registrada del expediente.
//                             </p>
//                         </div>
//                     </div>

//                     <Button
//                         asChild
//                         variant="ghost"
//                         className="w-fit text-slate-400 hover:bg-white/5 hover:text-white"
//                     >
//                         <Link
//                             href={`/expedientes/${expediente.id}`}
//                         >
//                             <ArrowLeft className="mr-2 h-4 w-4" />
//                             Volver al expediente
//                         </Link>
//                     </Button>
//                 </div>

//                 {/* Formulario */}
//                 <div className="mx-auto w-full max-w-5xl">
//                     <ExpedienteForm
//                         mode="edit"
//                         expediente={expediente}
//                     />
//                 </div>
//             </div>
//         </>
//     );
// }
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit3,
    FolderOpen,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import ExpedienteForm from './form/ExpedienteForm';

type Expediente = {
    id: number;
    numero_expediente: string;
    titulo: string;
    tipo_proceso?: string | null;
    gestion?: number | string | null;
    fecha_inicio?: string | null;
    fecha_cierre?: string | null;
    estado: 'abierto' | 'en_proceso' | 'concluido' | 'archivado';
    descripcion?: string | null;
    observaciones?: string | null;
};

type Props = {
    expediente: Expediente;
};

export default function Edit({ expediente }: Props) {
    const handleCancel = () => {
        router.visit(`/expedientes/${expediente.id}`);
    };

    return (
        <>
            <Head
                title={`Editar expediente ${expediente.numero_expediente}`}
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* ENCABEZADO */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                            <Edit3 className="h-6 w-6 text-blue-400" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <FolderOpen className="h-4 w-4 text-slate-500" />

                                <span className="text-sm text-slate-500">
                                    Expedientes
                                </span>

                                <span className="text-slate-700">
                                    /
                                </span>

                                <span className="text-sm text-slate-400">
                                    {expediente.numero_expediente}
                                </span>
                            </div>

                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                                Editar expediente
                            </h1>

                            <p className="mt-1 max-w-2xl text-sm text-slate-400">
                                Modifica la información administrativa del
                                expediente. La documentación digital se
                                administra desde la carpeta del expediente.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="w-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 sm:w-auto"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al expediente
                    </Button>
                </div>

                {/* AVISO */}
                <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3">
                    <div className="flex gap-3">
                        <div className="mt-0.5 shrink-0">
                            <Edit3 className="h-4 w-4 text-blue-400" />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-blue-300">
                                Modificación del expediente
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                Los cambios realizados actualizarán la
                                información del proceso y quedarán registrados
                                en la trazabilidad del expediente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FORMULARIO */}
                <div className="mx-auto w-full max-w-6xl">
                    <ExpedienteForm expediente={expediente} />
                </div>
            </div>
        </>
    );
}
