
// import { Head, router, useForm } from '@inertiajs/react';

// import { RoleForm } from './form/RoleForm';

// import { usePermissions } from '@/hooks/use-permissions';

// import type {
//     Role,
//     RoleFormData,
//     RolePermission,
// } from '@/types';

// type Props = {
//     role: Role;
//     permissions: RolePermission[];
// };

// export default function Edit({
//     role,
//     permissions,
// }: Props) {
//     const {
//         can,
//         hasRole,
//     } = usePermissions();

//     /*
//      * Roles protegidos del sistema.
//      */
//     const isDeveloperRole =
//         role.name === 'Developer';

//     const isAdministratorRole =
//         role.name === 'Administrador';

//     /*
//      * Developer nunca puede ser editado.
//      */
//     const canEditDeveloper =
//         !isDeveloperRole;

//     /*
//      * Administrador solamente puede ser
//      * editado por un Developer.
//      */
//     const canEditAdministrator =
//         !isAdministratorRole ||
//         hasRole('Developer');

//     /*
//      * El usuario debe tener el permiso
//      * general para editar roles.
//      */
//     const hasEditPermission =
//         can('roles.edit');

//     /*
//      * Regla final.
//      */
//     const canEdit =
//         hasEditPermission &&
//         canEditDeveloper &&
//         canEditAdministrator;

//     const form = useForm<RoleFormData>({
//         name: role.name ?? '',
//         permissions:
//             role.permissions?.map(
//                 (permission) => permission.id,
//             ) ?? [],
//     });

//     const handleSubmit = (data: RoleFormData) => {
//         /*
//          * Protección adicional en el frontend.
//          */
//         if (!canEdit || form.processing) {
//             return;
//         }

//         form.setData(data);

//         form.put(`/roles/${role.id}`, {
//             preserveScroll: true,
//         });
//     };

//     const handleCancel = () => {
//         if (form.processing) {
//             return;
//         }

//         router.visit('/roles');
//     };

//     const lockName =
//         isDeveloperRole ||
//         isAdministratorRole;

//     const lockPermissions =
//         isDeveloperRole ||
//         (
//             isAdministratorRole &&
//             !hasRole('Developer')
//         );

//     /*
//      * Si no puede editar el rol,
//      * no mostramos el formulario.
//      */
//     if (!canEdit) {
//         return (
//             <>
//                 <Head title={`Editar rol: ${role.name}`} />

//                 <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                     <div>
//                         <h1 className="text-2xl font-semibold tracking-tight">
//                             Editar rol
//                         </h1>

//                         <p className="text-sm text-muted-foreground">
//                             No tienes permiso para modificar este rol.
//                         </p>
//                     </div>

//                     <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
//                         <p className="text-sm text-destructive">
//                             {isDeveloperRole
//                                 ? 'El rol Developer es un rol protegido y no puede ser editado.'
//                                 : isAdministratorRole &&
//                                     !hasRole('Developer')
//                                     ? 'El rol Administrador solamente puede ser editado por un Developer.'
//                                     : 'No tienes el permiso necesario para editar roles.'}
//                         </p>
//                     </div>
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <Head title={`Editar rol: ${role.name}`} />

//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 <div>
//                     <h1 className="text-2xl font-semibold tracking-tight">
//                         Editar rol
//                     </h1>

//                     <p className="text-sm text-muted-foreground">
//                         Modifica el nombre y los permisos
//                         asignados al rol.
//                     </p>
//                 </div>

//                 <RoleForm
//                     mode="edit"
//                     role={role}
//                     permissions={permissions}
//                     errors={form.errors}
//                     processing={form.processing}
//                     onSubmit={handleSubmit}
//                     onCancel={handleCancel}
//                     lockName={lockName}
//                     lockPermissions={lockPermissions}
//                 />
//             </div>
//         </>
//     );
// }
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    LockKeyhole,
    Pencil,
    ShieldCheck,
} from 'lucide-react';

import { RoleForm } from './form/RoleForm';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { usePermissions } from '@/hooks/use-permissions';

import type {
    Role,
    RoleFormData,
    RolePermission,
} from '@/types';

type Props = {
    role: Role;
    permissions: RolePermission[];
};

export default function Edit({
    role,
    permissions,
}: Props) {
    const {
        can,
        hasRole,
    } = usePermissions();

    /*
    |--------------------------------------------------------------------------
    | Roles protegidos
    |--------------------------------------------------------------------------
    */

    const isDeveloperRole =
        role.name === 'Developer';

    const isAdministratorRole =
        role.name === 'Administrador';

    /*
    |--------------------------------------------------------------------------
    | Permisos de edición
    |--------------------------------------------------------------------------
    */

    const canEditDeveloper =
        !isDeveloperRole;

    const canEditAdministrator =
        !isAdministratorRole ||
        hasRole('Developer');

    const hasEditPermission =
        can('roles.edit');

    const canEdit =
        hasEditPermission &&
        canEditDeveloper &&
        canEditAdministrator;

    /*
    |--------------------------------------------------------------------------
    | Formulario
    |--------------------------------------------------------------------------
    */

    const form = useForm<RoleFormData>({
        name: role.name ?? '',
        permissions:
            role.permissions?.map(
                (permission) => permission.id,
            ) ?? [],
    });

    const handleSubmit = (data: RoleFormData) => {
        if (!canEdit || form.processing) {
            return;
        }

        form.setData(data);

        form.put(`/roles/${role.id}`, {
            preserveScroll: true,
        });
    };

    const handleCancel = () => {
        if (form.processing) {
            return;
        }

        router.visit('/roles');
    };

    /*
    |--------------------------------------------------------------------------
    | Protección de campos
    |--------------------------------------------------------------------------
    */

    const lockName =
        isDeveloperRole ||
        isAdministratorRole;

    const lockPermissions =
        isDeveloperRole ||
        (
            isAdministratorRole &&
            !hasRole('Developer')
        );

    /*
    |--------------------------------------------------------------------------
    | Rol no editable
    |--------------------------------------------------------------------------
    */

    if (!canEdit) {
        return (
            <>
                <Head title={`Editar rol: ${role.name}`} />

                <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                    <div className="space-y-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="-ml-2 w-fit"
                        >
                            <Link href="/roles">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a roles
                            </Link>
                        </Button>

                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                <ShieldCheck className="h-6 w-6" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        {role.name}
                                    </h1>

                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
                                        <LockKeyhole className="h-3 w-3" />
                                        Protegido
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Este rol no puede ser modificado
                                    desde esta cuenta.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Card className="border-destructive/20 bg-destructive/[0.03]">
                        <CardContent className="flex items-start gap-3 p-5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                <LockKeyhole className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="font-medium text-destructive">
                                    Acceso restringido
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {isDeveloperRole
                                        ? 'El rol Developer es un rol protegido del sistema y no puede ser editado.'
                                        : isAdministratorRole &&
                                            !hasRole('Developer')
                                            ? 'El rol Administrador solamente puede ser editado por un Developer.'
                                            : 'No tienes el permiso necesario para editar roles.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Formulario editable
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head title={`Editar rol: ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* =====================================================
                    ENCABEZADO
                ====================================================== */}
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

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                {/* <ShieldPen className="h-6 w-6" /> */}
                                <Pencil className="h-6 w-6" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        Editar rol
                                    </h1>

                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {role.name}
                                    </span>
                                </div>

                                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                    Modifica la configuración y los
                                    permisos asignados a este rol.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    AVISO PARA ADMINISTRADOR
                ====================================================== */}
                {isAdministratorRole && (
                    <Card className="border-slate-200/80 dark:border-slate-800">
                        <CardContent className="flex items-start gap-3 p-4">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <LockKeyhole className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Rol Administrador
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    El nombre del rol está protegido.
                                    {hasRole('Developer')
                                        ? ' Los permisos pueden ser administrados por un Developer.'
                                        : ' Los permisos requieren autorización de un Developer.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <RoleForm
                    mode="edit"
                    role={role}
                    permissions={permissions}
                    errors={form.errors}
                    processing={form.processing}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    lockName={lockName}
                    lockPermissions={lockPermissions}
                />
            </div>
        </>
    );
}
