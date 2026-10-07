// import { Head, router, useForm } from '@inertiajs/react';

// import { RoleForm } from './form/RoleForm';

// import type {
//     RoleFormData,
//     RolePermission,
// } from '@/types';

// type Props = {
//     permissions: RolePermission[];
// };

// export default function Create({ permissions }: Props) {
//     const form = useForm<RoleFormData>({
//         name: '',
//         permissions: [],
//     });

//     const handleSubmit = (data: RoleFormData) => {
//         form.setData(data);

//         form.post('/roles', {
//             preserveScroll: true,
//         });
//     };

//     const handleCancel = () => {
//         if (form.processing) {
//             return;
//         }

//         router.visit('/roles');
//     };

//     return (
//         <>
//             <Head title="Crear rol" />

//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 <div>
//                     <h1 className="text-2xl font-semibold tracking-tight">
//                         Crear rol
//                     </h1>

//                     <p className="text-sm text-muted-foreground">
//                         Crea un nuevo rol y asigna los permisos
//                         correspondientes.
//                     </p>
//                 </div>

//                 <RoleForm
//                     mode="create"
//                     permissions={permissions}
//                     errors={form.errors}
//                     processing={form.processing}
//                     onSubmit={handleSubmit}
//                     onCancel={handleCancel}
//                 />
//             </div>
//         </>
//     );
// }
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ShieldPlus,
    ShieldCheck,
    LockKeyhole,
} from 'lucide-react';

import { RoleForm } from './form/RoleForm';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type {
    RoleFormData,
    RolePermission,
} from '@/types';

type Props = {
    permissions: RolePermission[];
};

export default function Create({ permissions }: Props) {
    const form = useForm<RoleFormData>({
        name: '',
        permissions: [],
    });

    const handleSubmit = (data: RoleFormData) => {
        form.setData(data);

        form.post('/roles', {
            preserveScroll: true,
        });
    };

    const handleCancel = () => {
        if (form.processing) {
            return;
        }

        router.visit('/roles');
    };

    return (
        <>
            <Head title="Crear rol" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* =====================================================
                    ENCABEZADO
                ====================================================== */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            disabled={form.processing}
                            className="-ml-2 w-fit"
                        >
                            <Link href="/roles">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a roles
                            </Link>
                        </Button>

                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                <ShieldPlus className="h-6 w-6" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        Crear rol
                                    </h1>

                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        Administración
                                    </span>
                                </div>

                                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                    Crea un nuevo rol y define los permisos
                                    que tendrá dentro de SISAS.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    INFORMACIÓN DE SEGURIDAD
                ====================================================== */}
                <Card className="border-slate-200/80 dark:border-slate-800">
                    <CardContent className="flex items-start gap-3 p-4">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <LockKeyhole className="h-4 w-4" />
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                Configuración de acceso
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Los permisos determinan qué módulos y
                                acciones estarán disponibles para los
                                usuarios que tengan este rol.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* =====================================================
                    FORMULARIO
                ====================================================== */}
                <RoleForm
                    mode="create"
                    permissions={permissions}
                    errors={form.errors}
                    processing={form.processing}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </>
    );
}
