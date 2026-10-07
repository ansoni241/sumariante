
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    FilePlus2,
    FolderOpen,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import ExpedienteForm from './form/ExpedienteForm';

export default function Create() {
    const handleCancel = () => {
        router.visit('/expedientes');
    };

    return (
        <>
            <Head title="Nuevo expediente" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* -------------------------------------------------------
                    ENCABEZADO
                -------------------------------------------------------- */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                            <FilePlus2 className="h-6 w-6 text-blue-400" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <FolderOpen className="h-4 w-4 text-slate-500" />

                                <span className="text-sm text-slate-500">
                                    Expedientes
                                </span>
                            </div>

                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                                Nuevo expediente
                            </h1>

                            <p className="mt-1 max-w-2xl text-sm text-slate-400">
                                Registra un nuevo proceso sumario y,
                                si corresponde, adjunta su documento
                                digital inicial.
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
                        Volver a expedientes
                    </Button>
                </div>

                {/* -------------------------------------------------------
                    INFORMACIÓN
                -------------------------------------------------------- */}

                <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3">
                    <div className="flex gap-3">
                        <div className="mt-0.5 shrink-0">
                            <FilePlus2 className="h-4 w-4 text-blue-400" />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-blue-300">
                                Registro de expediente
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                Completa los datos del proceso. El documento
                                inicial es opcional y puede agregarse
                                posteriormente desde el expediente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* -------------------------------------------------------
                    FORMULARIO
                -------------------------------------------------------- */}

                <div className="mx-auto w-full max-w-6xl">
                    <ExpedienteForm />
                </div>
            </div>
        </>
    );
}
