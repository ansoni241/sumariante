// import { Head, Link, router } from '@inertiajs/react';
// import { useState } from 'react';

// import { ArrowLeft } from 'lucide-react';

// import { Button } from '@/components/ui/button';

// import {
//     Card,
//     CardContent,
// } from '@/components/ui/card';

// import type {
//     Role,
//     UserFormData,
// } from '@/types';

// import { UserForm } from './form/UserForm';

// type Props = {
//     roles: Role[];
//     errors?: Record<string, string>;
// };

// export default function Create({
//     roles,
//     errors = {},
// }: Props) {
//     const [processing, setProcessing] = useState(false);

//     /**
//      * Enviar formulario.
//      */
//     const handleSubmit = (data: UserFormData) => {
//         // Evitar múltiples envíos
//         if (processing) {
//             return;
//         }

//         setProcessing(true);

//         router.post('/users', data, {
//             preserveScroll: true,

//             onFinish: () => {
//                 setProcessing(false);
//             },
//         });
//     };

//     /**
//      * Cancelar creación.
//      */
//     const handleCancel = () => {
//         if (processing) {
//             return;
//         }

//         router.visit('/users');
//     };

//     return (
//         <>
//             <Head title="Nuevo usuario" />

//             <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
//                 {/* Encabezado */}
//                 <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                     <div>
//                         <div className="mb-2">
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 asChild
//                                 disabled={processing}
//                             >
//                                 <Link href="/users">
//                                     <ArrowLeft className="mr-2 h-4 w-4" />
//                                     Volver a usuarios
//                                 </Link>
//                             </Button>
//                         </div>

//                         <h1 className="text-2xl font-semibold tracking-tight">
//                             Nuevo usuario
//                         </h1>

//                         <p className="text-sm text-muted-foreground">
//                             Crea un nuevo usuario y configura su
//                             acceso al sistema.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Formulario */}
//                 <Card>
//                     <CardContent className="p-6">
//                         <UserForm
//                             roles={roles}
//                             mode="create"
//                             errors={errors}
//                             processing={processing}
//                             onSubmit={handleSubmit}
//                             onCancel={handleCancel}
//                         />
//                     </CardContent>
//                 </Card>
//             </div>
//         </>
//     );
// }
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import {
    ArrowLeft,
    ShieldCheck,
    UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
} from '@/components/ui/card';

import type {
    Role,
    UserFormData,
} from '@/types';

import { UserForm } from './form/UserForm';

type Props = {
    roles: Role[];
    errors?: Record<string, string>;
};

export default function Create({
    roles,
    errors = {},
}: Props) {
    const [processing, setProcessing] = useState(false);

    /**
     * Crear usuario.
     */
    const handleSubmit = (data: UserFormData) => {
        if (processing) {
            return;
        }

        setProcessing(true);

        router.post('/users', data, {
            preserveScroll: true,

            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    /**
     * Cancelar creación.
     */
    const handleCancel = () => {
        if (processing) {
            return;
        }

        router.visit('/users');
    };

    return (
        <>
            <Head title="Nuevo usuario" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

                {/* =====================================================
                    ENCABEZADO
                ====================================================== */}

                <div className="flex flex-col gap-5">

                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            disabled={processing}
                            className="-ml-2 mb-3 h-8 gap-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                        >
                            <Link href="/users">
                                <ArrowLeft className="h-4 w-4" />
                                Volver a usuarios
                            </Link>
                        </Button>

                        <div className="flex items-start gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                <UserPlus className="h-5 w-5" />
                            </div>

                            <div>
                                <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                    Nuevo usuario
                                </h1>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Registre un nuevo usuario y configure
                                    sus credenciales y permisos de acceso.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* =====================================================
                    INFORMACIÓN DEL MÓDULO
                ====================================================== */}

                <Card className="border-slate-200 bg-slate-50/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">

                    <CardContent className="flex items-start gap-3 p-4">

                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                            <ShieldCheck className="h-4 w-4" />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                Configuración de acceso
                            </p>

                            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                La información registrada determinará
                                la identidad, estado y nivel de acceso
                                del usuario dentro de SISAS.
                            </p>
                        </div>

                    </CardContent>

                </Card>

                {/* =====================================================
                    FORMULARIO
                ====================================================== */}

                <UserForm
                    roles={roles}
                    mode="create"
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

            </div>
        </>
    );
}
