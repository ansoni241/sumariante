// import { Head, Link, router } from '@inertiajs/react';
// import { useState } from 'react';

// import { ArrowLeft } from 'lucide-react';

// import { Button } from '@/components/ui/button';

// import {
//     Card,
//     CardContent,
// } from '@/components/ui/card';

// import type {
//     AdminUser,
//     Role,
//     UserFormData,
// } from '@/types';

// import { UserForm } from './form/UserForm';

// type Props = {
//     user: AdminUser;
//     roles: Role[];
//     errors?: Record<string, string>;
// };

// export default function Edit({
//     user,
//     roles,
//     errors = {},
// }: Props) {
//     const [processing, setProcessing] = useState(false);

//     /**
//      * Actualizar usuario.
//      */
//     const handleSubmit = (data: UserFormData) => {
//         // Evitar múltiples envíos
//         if (processing) {
//             return;
//         }

//         setProcessing(true);

//         router.put(`/users/${user.id}`, data, {
//             preserveScroll: true,

//             onFinish: () => {
//                 setProcessing(false);
//             },
//         });
//     };

//     /**
//      * Cancelar edición.
//      */
//     const handleCancel = () => {
//         if (processing) {
//             return;
//         }

//         router.visit('/users');
//     };

//     return (
//         <>
//             <Head title={`Editar usuario - ${user.name}`} />

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
//                             Editar usuario
//                         </h1>

//                         <p className="text-sm text-muted-foreground">
//                             Modifica la información y configuración
//                             de acceso del usuario.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Formulario */}
//                 <Card>
//                     <CardContent className="p-6">
//                         <UserForm
//                             roles={roles}
//                             mode="edit"
//                             user={user}
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
    UserRoundPen,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
} from '@/components/ui/card';

import type {
    AdminUser,
    Role,
    UserFormData,
} from '@/types';

import { UserForm } from './form/UserForm';

type Props = {
    user: AdminUser;
    roles: Role[];
    errors?: Record<string, string>;
};

export default function Edit({
    user,
    roles,
    errors = {},
}: Props) {
    const [processing, setProcessing] = useState(false);

    /**
     * Actualizar usuario.
     */
    const handleSubmit = (data: UserFormData) => {
        if (processing) {
            return;
        }

        setProcessing(true);

        router.put(`/users/${user.id}`, data, {
            preserveScroll: true,

            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    /**
     * Cancelar edición.
     */
    const handleCancel = () => {
        if (processing) {
            return;
        }

        router.visit('/users');
    };

    return (
        <>
            <Head title={`Editar usuario - ${user.name}`} />

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
                                <UserRoundPen className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        Editar usuario
                                    </h1>

                                </div>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Modifique la información y configuración
                                    de acceso del usuario.
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2">

                                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                                        ID #{user.id}
                                    </span>

                                    <span className="truncate rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                                        {user.email}
                                    </span>

                                </div>

                            </div>

                        </div>
                    </div>

                </div>

                {/* =====================================================
                    AVISO DE SEGURIDAD
                ====================================================== */}

                <Card className="border-slate-200 bg-slate-50/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">

                    <CardContent className="flex items-start gap-3 p-4">

                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                            <ShieldCheck className="h-4 w-4" />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                Administración de acceso
                            </p>

                            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Los cambios realizados aquí pueden modificar
                                el acceso del usuario al sistema. La contraseña
                                solamente se actualizará si se proporciona una nueva.
                            </p>
                        </div>

                    </CardContent>

                </Card>

                {/* =====================================================
                    FORMULARIO
                ====================================================== */}

                <UserForm
                    roles={roles}
                    mode="edit"
                    user={user}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

            </div>
        </>
    );
}
