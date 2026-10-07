// import { Head, Link, router } from '@inertiajs/react';

// import {
//     ArrowLeft,
//     Pencil,
//     ShieldCheck,
//     Trash2,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';

// import { usePermissions } from '@/hooks/use-permissions';

// import type { Role } from '@/types';

// type Props = {
//     role: Role;
// };

// export default function Show({ role }: Props) {
//     const {
//         can,
//         hasRole,
//     } = usePermissions();

//     /*
//      * =========================================================
//      * REGLAS DE LOS ROLES PROTEGIDOS
//      * =========================================================
//      */

//     /**
//      * Developer:
//      *
//      * No puede ser editado ni eliminado.
//      */
//     const isDeveloperRole =
//         role.name === 'Developer';

//     /**
//      * Administrador:
//      *
//      * Solamente Developer puede modificarlo.
//      */
//     const isAdministratorRole =
//         role.name === 'Administrador';

//     /**
//      * El usuario actual es Developer.
//      */
//     const isCurrentUserDeveloper =
//         hasRole('Developer');

//     /*
//      * =========================================================
//      * PERMISOS
//      * =========================================================
//      */

//     /**
//      * Puede editar este rol.
//      *
//      * Developer -> NO
//      *
//      * Administrador -> solamente Developer
//      *
//      * Otros -> roles.edit
//      */
//     const canEditRole =
//         !isDeveloperRole &&
//         (
//             isAdministratorRole
//                 ? isCurrentUserDeveloper
//                 : can('roles.edit')
//         );

//     /**
//      * Puede eliminar este rol.
//      *
//      * Developer -> NO
//      *
//      * Administrador -> NO
//      *
//      * Otros -> roles.delete
//      */
//     const canDeleteRole =
//         !isDeveloperRole &&
//         !isAdministratorRole &&
//         can('roles.delete');

//     /**
//      * =========================================================
//      * ELIMINAR ROL
//      * =========================================================
//      */
//     const deleteRole = () => {
//         /*
//          * Protección adicional en frontend.
//          */
//         if (!canDeleteRole) {
//             return;
//         }

//         if (
//             !confirm(
//                 `¿Está seguro de eliminar el rol "${role.name}"?`,
//             )
//         ) {
//             return;
//         }

//         router.delete(`/roles/${role.id}`);
//     };

//     /**
//      * =========================================================
//      * NOMBRE LEGIBLE DEL PERMISO
//      * =========================================================
//      */
//     const getPermissionLabel = (
//         permission: string,
//     ) => {
//         const action =
//             permission.split('.').pop();

//         const labels: Record<string, string> = {
//             view: 'Ver',
//             create: 'Crear',
//             edit: 'Editar',
//             delete: 'Eliminar',
//             status: 'Cambiar estado',
//         };

//         return (
//             labels[action ?? ''] ??
//             action ??
//             permission
//         );
//     };

//     /**
//      * =========================================================
//      * NOMBRE LEGIBLE DEL MÓDULO
//      * =========================================================
//      */
//     const getModuleLabel = (
//         module: string,
//     ) => {
//         const labels: Record<string, string> = {
//             users: 'Usuarios',
//             roles: 'Roles',
//             permissions: 'Permisos',
//         };

//         return (
//             labels[module] ??
//             module.charAt(0).toUpperCase() +
//             module.slice(1)
//         );
//     };

//     /**
//      * =========================================================
//      * AGRUPAR PERMISOS POR MÓDULO
//      * =========================================================
//      */
//     const groupedPermissions = (
//         role.permissions ?? []
//     ).reduce(
//         (
//             groups: Record<
//                 string,
//                 typeof role.permissions
//             >,
//             permission,
//         ) => {
//             const [module] =
//                 permission.name.split('.');

//             if (!groups[module]) {
//                 groups[module] = [];
//             }

//             groups[module].push(permission);

//             return groups;
//         },
//         {},
//     );

//     const sortedModules = Object.keys(
//         groupedPermissions,
//     ).sort((a, b) =>
//         a.localeCompare(b),
//     );

//     return (
//         <>
//             <Head title={`Rol: ${role.name}`} />

//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

//                 {/* =====================================================
//                     ENCABEZADO
//                 ====================================================== */}

//                 <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

//                     <div className="flex items-center gap-3">

//                         <Button
//                             variant="outline"
//                             size="icon"
//                             asChild
//                             title="Volver"
//                         >
//                             <Link href="/roles">
//                                 <ArrowLeft className="h-4 w-4" />
//                             </Link>
//                         </Button>

//                         <div>

//                             <h1 className="text-2xl font-semibold tracking-tight">
//                                 {role.name}
//                             </h1>

//                             <p className="text-sm text-muted-foreground">
//                                 Información y permisos
//                                 asignados al rol.
//                             </p>

//                         </div>

//                     </div>

//                     {/* =================================================
//                         ACCIONES PRINCIPALES
//                     ================================================== */}

//                     <div className="flex gap-2">

//                         {/* Editar */}

//                         {canEditRole && (
//                             <Button
//                                 variant="outline"
//                                 asChild
//                             >
//                                 <Link
//                                     href={`/roles/${role.id}/edit`}
//                                 >
//                                     <Pencil className="mr-2 h-4 w-4" />
//                                     Editar
//                                 </Link>
//                             </Button>
//                         )}

//                         {/* Eliminar */}

//                         {canDeleteRole && (
//                             <Button
//                                 variant="destructive"
//                                 onClick={deleteRole}
//                             >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 Eliminar
//                             </Button>
//                         )}

//                     </div>

//                 </div>

//                 {/* =====================================================
//                     INFORMACIÓN GENERAL
//                 ====================================================== */}

//                 <div className="grid gap-4 md:grid-cols-3">

//                     {/* Nombre */}

//                     <Card>

//                         <CardHeader className="pb-2">

//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Rol
//                             </CardTitle>

//                         </CardHeader>

//                         <CardContent>

//                             <div className="flex items-center gap-3">

//                                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">

//                                     <ShieldCheck className="h-5 w-5" />

//                                 </div>

//                                 <div>

//                                     <div className="font-semibold">
//                                         {role.name}
//                                     </div>

//                                     <div className="text-xs text-muted-foreground">
//                                         ID #{role.id}
//                                     </div>

//                                 </div>

//                             </div>

//                         </CardContent>

//                     </Card>

//                     {/* Permisos */}

//                     <Card>

//                         <CardHeader className="pb-2">

//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Permisos
//                             </CardTitle>

//                         </CardHeader>

//                         <CardContent>

//                             <span className="text-2xl font-bold">
//                                 {role.permissions
//                                     ?.length ?? 0}
//                             </span>

//                             <p className="text-xs text-muted-foreground">
//                                 permisos asignados
//                             </p>

//                         </CardContent>

//                     </Card>

//                     {/* Usuarios */}

//                     <Card>

//                         <CardHeader className="pb-2">

//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Usuarios
//                             </CardTitle>

//                         </CardHeader>

//                         <CardContent>

//                             <span className="text-2xl font-bold">
//                                 {role.users_count ?? 0}
//                             </span>

//                             <p className="text-xs text-muted-foreground">
//                                 usuarios con este rol
//                             </p>

//                         </CardContent>

//                     </Card>

//                 </div>

//                 {/* =====================================================
//                     PERMISOS
//                 ====================================================== */}

//                 <Card>

//                     <CardHeader>

//                         <CardTitle>
//                             Permisos asignados
//                         </CardTitle>

//                         <p className="text-sm text-muted-foreground">
//                             Permisos que actualmente tiene
//                             asignados este rol.
//                         </p>

//                     </CardHeader>

//                     <CardContent>

//                         {role.permissions &&
//                             role.permissions.length > 0 ? (

//                             <div className="space-y-4">

//                                 {sortedModules.map(
//                                     (module) => {

//                                         const modulePermissions =
//                                             groupedPermissions[
//                                             module
//                                             ] ?? [];

//                                         return (
//                                             <div
//                                                 key={module}
//                                                 className="rounded-lg border"
//                                             >

//                                                 <div className="border-b bg-muted/30 px-4 py-3">

//                                                     <div className="font-medium">
//                                                         {getModuleLabel(
//                                                             module,
//                                                         )}
//                                                     </div>

//                                                     <div className="text-xs text-muted-foreground">

//                                                         {
//                                                             modulePermissions.length
//                                                         }{' '}

//                                                         {modulePermissions.length ===
//                                                             1
//                                                             ? 'permiso'
//                                                             : 'permisos'}

//                                                     </div>

//                                                 </div>

//                                                 <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">

//                                                     {modulePermissions.map(
//                                                         (
//                                                             permission,
//                                                         ) => (

//                                                             <div
//                                                                 key={
//                                                                     permission.id
//                                                                 }
//                                                                 className="flex items-center justify-between rounded-md border p-3"
//                                                             >

//                                                                 <div className="min-w-0">

//                                                                     <div className="font-medium">

//                                                                         {getPermissionLabel(
//                                                                             permission.name,
//                                                                         )}

//                                                                     </div>

//                                                                     <div className="truncate text-xs text-muted-foreground">

//                                                                         {
//                                                                             permission.name
//                                                                         }

//                                                                     </div>

//                                                                 </div>

//                                                                 <Badge variant="secondary">
//                                                                     Asignado
//                                                                 </Badge>

//                                                             </div>

//                                                         ),
//                                                     )}

//                                                 </div>

//                                             </div>
//                                         );
//                                     },
//                                 )}

//                             </div>

//                         ) : (

//                             <div className="rounded-lg border border-dashed p-10 text-center">

//                                 <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

//                                 <p className="font-medium">
//                                     Sin permisos
//                                 </p>

//                                 <p className="mt-1 text-sm text-muted-foreground">
//                                     Este rol no tiene permisos
//                                     asignados actualmente.
//                                 </p>

//                             </div>

//                         )}

//                     </CardContent>

//                 </Card>

//                 {/* =====================================================
//                     ACCIONES INFERIORES
//                 ====================================================== */}

//                 <div className="flex justify-end gap-2">

//                     <Button
//                         variant="outline"
//                         asChild
//                     >
//                         <Link href="/roles">
//                             <ArrowLeft className="mr-2 h-4 w-4" />
//                             Volver a roles
//                         </Link>
//                     </Button>

//                     {/* Editar rol */}

//                     {canEditRole && (
//                         <Button asChild>
//                             <Link
//                                 href={`/roles/${role.id}/edit`}
//                             >
//                                 <Pencil className="mr-2 h-4 w-4" />
//                                 Editar rol
//                             </Link>
//                         </Button>
//                     )}

//                 </div>

//             </div>
//         </>
//     );
// }
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    LockKeyhole,
    Pencil,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { usePermissions } from '@/hooks/use-permissions';
import type { Role } from '@/types';

type Props = {
    role: Role;
};

export default function Show({ role }: Props) {
    const { can, hasRole } = usePermissions();

    /*
    |--------------------------------------------------------------------------
    | Protección de roles
    |--------------------------------------------------------------------------
    */

    const isDeveloperRole = role.name === 'Developer';
    const isAdministratorRole = role.name === 'Administrador';
    const isCurrentUserDeveloper = hasRole('Developer');

    const isProtectedRole =
        isDeveloperRole || isAdministratorRole;

    const canEditRole =
        !isDeveloperRole &&
        (
            isAdministratorRole
                ? isCurrentUserDeveloper
                : can('roles.edit')
        );

    const canDeleteRole =
        !isDeveloperRole &&
        !isAdministratorRole &&
        can('roles.delete');

    /*
    |--------------------------------------------------------------------------
    | Acciones
    |--------------------------------------------------------------------------
    */

    const deleteRole = () => {
        if (!canDeleteRole) {
            return;
        }

        if (
            !confirm(
                `¿Está seguro de eliminar el rol "${role.name}"?`,
            )
        ) {
            return;
        }

        router.delete(`/roles/${role.id}`);
    };

    /*
    |--------------------------------------------------------------------------
    | Etiquetas
    |--------------------------------------------------------------------------
    */

    const getPermissionLabel = (
        permission: string,
    ): string => {
        const action = permission.split('.').pop();

        const labels: Record<string, string> = {
            view: 'Ver',
            create: 'Crear',
            edit: 'Editar',
            update: 'Actualizar',
            delete: 'Eliminar',
            status: 'Cambiar estado',
            manage: 'Administrar',
            show: 'Ver detalle',
            index: 'Listar',
        };

        return (
            labels[action ?? ''] ??
            action ??
            permission
        );
    };

    const getModuleLabel = (
        module: string,
    ): string => {
        const labels: Record<string, string> = {
            users: 'Usuarios',
            roles: 'Roles',
            permissions: 'Permisos',
            dashboard: 'Dashboard',
            reports: 'Reportes',
            settings: 'Configuración',
            profile: 'Perfil',
        };

        return (
            labels[module] ??
            module.charAt(0).toUpperCase() +
                module.slice(1)
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Permisos agrupados
    |--------------------------------------------------------------------------
    */

    const groupedPermissions = (
        role.permissions ?? []
    ).reduce(
        (
            groups: Record<
                string,
                NonNullable<Role['permissions']>
            >,
            permission,
        ) => {
            const [module] =
                permission.name.split('.');

            if (!groups[module]) {
                groups[module] = [];
            }

            groups[module].push(permission);

            return groups;
        },
        {},
    );

    const sortedModules = Object.keys(
        groupedPermissions,
    ).sort((a, b) =>
        a.localeCompare(b),
    );

    const permissionCount =
        role.permissions?.length ?? 0;

    const userCount =
        role.users_count ?? 0;

    /*
    |--------------------------------------------------------------------------
    | Vista
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head title={`Rol: ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* =========================================================
                    ENCABEZADO
                ========================================================= */}

                <div className="space-y-4">

                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/roles">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a roles
                        </Link>
                    </Button>

                    <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
                        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

                            {/* Identidad del rol */}

                            <div className="flex min-w-0 items-start gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>

                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h1 className="text-2xl font-semibold tracking-tight">
                                            {role.name}
                                        </h1>

                                        {isDeveloperRole && (
                                            <Badge
                                                variant="outline"
                                                className="gap-1.5 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400"
                                            >
                                                <LockKeyhole className="h-3 w-3" />
                                                Protegido
                                            </Badge>
                                        )}

                                        {isAdministratorRole && (
                                            <Badge
                                                variant="outline"
                                                className="gap-1.5 border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                            >
                                                <LockKeyhole className="h-3 w-3" />
                                                Rol del sistema
                                            </Badge>
                                        )}

                                    </div>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Detalle, permisos y usuarios
                                        asociados a este rol.
                                    </p>

                                </div>
                            </div>

                            {/* Acciones */}

                            <div className="flex flex-wrap gap-2">

                                {canEditRole && (
                                    <Button
                                        variant="outline"
                                        asChild
                                    >
                                        <Link
                                            href={`/roles/${role.id}/edit`}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar rol
                                        </Link>
                                    </Button>
                                )}

                                {canDeleteRole && (
                                    <Button
                                        variant="destructive"
                                        onClick={deleteRole}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
                                    </Button>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    RESUMEN
                ========================================================= */}

                <div className="grid gap-4 md:grid-cols-3">

                    {/* Permisos */}

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="p-5">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Permisos asignados
                                    </p>

                                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                                        {permissionCount}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        permisos disponibles para este rol
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                    {/* Usuarios */}

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="p-5">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Usuarios asociados
                                    </p>

                                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                                        {userCount}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        usuarios con este rol
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <Users className="h-5 w-5" />
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                    {/* Estado */}

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="p-5">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Estado del rol
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">

                                        <span className="relative flex h-3 w-3">
                                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                                            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                                        </span>

                                        <span className="text-lg font-semibold">
                                            Activo
                                        </span>

                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        El rol está disponible en el sistema
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                                    <Check className="h-5 w-5" />
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                </div>

                {/* =========================================================
                    AVISO DE PROTECCIÓN
                ========================================================= */}

                {isProtectedRole && (
                    <Card className="overflow-hidden border-border/60 shadow-sm">

                        <div className="border-l-4 border-l-slate-500">

                            <CardContent className="p-5">

                                <div className="flex items-start gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                        <LockKeyhole className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="font-semibold">
                                            Configuración protegida
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">

                                            {isDeveloperRole
                                                ? 'El rol Developer forma parte de la configuración principal del sistema. No puede ser editado ni eliminado.'
                                                : 'El rol Administrador forma parte de la configuración del sistema. No puede ser eliminado y solamente un usuario con rol Developer puede modificarlo.'
                                            }

                                        </p>

                                    </div>

                                </div>

                            </CardContent>

                        </div>

                    </Card>
                )}

                {/* =========================================================
                    PERMISOS
                ========================================================= */}

                <Card className="border-border/60 shadow-sm">

                    <CardHeader className="border-b border-border/60">

                        <div className="flex flex-col gap-1">

                            <CardTitle className="text-base">
                                Permisos del rol
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Permisos organizados por módulo del sistema.
                            </p>

                        </div>

                    </CardHeader>

                    <CardContent className="p-6">

                        {sortedModules.length === 0 ? (

                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 py-12 text-center">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>

                                <h3 className="mt-4 font-medium">
                                    Sin permisos asignados
                                </h3>

                                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                    Este rol actualmente no tiene permisos
                                    configurados.
                                </p>

                            </div>

                        ) : (

                            <div className="grid gap-4 md:grid-cols-2">

                                {sortedModules.map(
                                    (module) => {

                                        const permissions =
                                            groupedPermissions[
                                                module
                                            ];

                                        return (
                                            <div
                                                key={module}
                                                className="rounded-xl border border-border/60 bg-muted/20 p-5 transition-colors hover:bg-muted/30"
                                            >

                                                {/* Cabecera módulo */}

                                                <div className="flex items-center justify-between gap-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background text-sm font-semibold text-foreground shadow-sm">
                                                            {getModuleLabel(
                                                                module,
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <h3 className="font-semibold">
                                                                {getModuleLabel(
                                                                    module,
                                                                )}
                                                            </h3>

                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    permissions.length
                                                                }{' '}
                                                                {permissions.length ===
                                                                1
                                                                    ? 'permiso'
                                                                    : 'permisos'}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <Badge
                                                        variant="secondary"
                                                        className="shrink-0"
                                                    >
                                                        {
                                                            permissions.length
                                                        }
                                                    </Badge>

                                                </div>

                                                {/* Permisos */}

                                                <div className="mt-4 flex flex-wrap gap-2">

                                                    {permissions
                                                        .sort(
                                                            (
                                                                a,
                                                                b,
                                                            ) =>
                                                                a.name.localeCompare(
                                                                    b.name,
                                                                ),
                                                        )
                                                        .map(
                                                            (
                                                                permission,
                                                            ) => (
                                                                <Badge
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    variant="outline"
                                                                    className="gap-1.5 bg-background/80 px-2.5 py-1"
                                                                >
                                                                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />

                                                                    {
                                                                        getPermissionLabel(
                                                                            permission.name,
                                                                        )
                                                                    }
                                                                </Badge>
                                                            ),
                                                        )}

                                                </div>

                                            </div>
                                        );
                                    },
                                )}

                            </div>

                        )}

                    </CardContent>

                </Card>

                {/* =========================================================
                    INFORMACIÓN DEL ROL
                ========================================================= */}

                <Card className="border-border/60 shadow-sm">

                    <CardHeader className="border-b border-border/60">

                        <CardTitle className="text-base">
                            Información del rol
                        </CardTitle>

                    </CardHeader>

                    <CardContent className="p-6">

                        <div className="grid gap-6 sm:grid-cols-2">

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Nombre
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {role.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Tipo
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {isDeveloperRole
                                        ? 'Rol protegido'
                                        : isAdministratorRole
                                            ? 'Rol del sistema'
                                            : 'Rol personalizado'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Permisos
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {permissionCount}{' '}
                                    {permissionCount === 1
                                        ? 'permiso'
                                        : 'permisos'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Usuarios
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {userCount}{' '}
                                    {userCount === 1
                                        ? 'usuario'
                                        : 'usuarios'}
                                </p>
                            </div>

                        </div>

                    </CardContent>

                </Card>

                {/* =========================================================
                    ACCIONES FINALES
                ========================================================= */}

                <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <Button
                        variant="outline"
                        asChild
                    >
                        <Link href="/roles">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a roles
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-3 sm:flex-row">

                        {canDeleteRole && (
                            <Button
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={deleteRole}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar rol
                            </Button>
                        )}

                        {canEditRole && (
                            <Button asChild>
                                <Link
                                    href={`/roles/${role.id}/edit`}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar rol
                                </Link>
                            </Button>
                        )}

                    </div>

                </div>

            </div>
        </>
    );
}
