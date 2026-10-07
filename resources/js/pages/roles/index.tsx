// import { Head, Link, router } from '@inertiajs/react';
// import { useEffect, useState } from 'react';

// import {
//     Eye,
//     Pencil,
//     Plus,
//     Search,
//     ShieldCheck,
//     Trash2,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';

// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';

// import { Pagination } from '@/components/pagination';

// import { usePermissions } from '@/hooks/use-permissions';

// import type {
//     PaginatedResponse,
//     RoleWithDetails,
// } from '@/types';

// type Props = {
//     roles: PaginatedResponse<RoleWithDetails>;

//     filters?: {
//         search?: string;
//     };
// };

// export default function Index({
//     roles,
//     filters = {},
// }: Props) {
//     const [search, setSearch] = useState(
//         filters.search ?? '',
//     );

//     /**
//      * =========================================================
//      * PERMISOS DEL USUARIO ACTUAL
//      * =========================================================
//      */
//     const {
//         can,
//         hasRole,
//     } = usePermissions();

//     /**
//      * El usuario actual es Developer.
//      *
//      * Este rol tiene privilegios especiales:
//      *
//      * - Puede editar Administrador.
//      * - Puede eliminar Administrador.
//      * - Puede crear/editar/eliminar otros roles.
//      * - El rol Developer nunca se puede modificar.
//      */
//     const isDeveloper = hasRole('Developer');

//     /**
//      * =========================================================
//      * BÚSQUEDA
//      * =========================================================
//      */
//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             router.get(
//                 '/roles',
//                 {
//                     search: search || undefined,
//                 },
//                 {
//                     preserveState: true,
//                     preserveScroll: true,
//                     replace: true,
//                     only: ['roles', 'filters'],
//                 },
//             );
//         }, 400);

//         return () => clearTimeout(timeout);
//     }, [search]);

//     /**
//      * =========================================================
//      * TIEMPO REAL - ROLES
//      * =========================================================
//      *
//      * Escucha:
//      *
//      * role.created
//      * role.updated
//      * role.deleted
//      *
//      * Cuando ocurre un cambio, solamente se actualiza
//      * la información de roles mediante Inertia.
//      */
//     useEffect(() => {
//         if (typeof window === 'undefined') {
//             return;
//         }

//         if (!window.Echo) {
//             console.warn(
//                 '[Roles] Laravel Echo no está disponible.',
//             );

//             return;
//         }

//         const channel = window.Echo.private('roles');

//         /**
//          * Rol creado.
//          */
//         channel.listen(
//             '.role.created',
//             () => {
//                 router.reload({
//                     only: ['roles'],
//                     preserveScroll: true,
//                     preserveState: true,
//                 });
//             },
//         );

//         /**
//          * Rol actualizado.
//          */
//         channel.listen(
//             '.role.updated',
//             () => {
//                 router.reload({
//                     only: ['roles'],
//                     preserveScroll: true,
//                     preserveState: true,
//                 });
//             },
//         );

//         /**
//          * Rol eliminado.
//          */
//         channel.listen(
//             '.role.deleted',
//             () => {
//                 router.reload({
//                     only: ['roles'],
//                     preserveScroll: true,
//                     preserveState: true,
//                 });
//             },
//         );

//         /**
//          * Limpiar canal.
//          */
//         return () => {
//             window.Echo.leave('roles');
//         };
//     }, []);

//     /**
//      * =========================================================
//      * REGLAS DEL ROL
//      * =========================================================
//      */

//     /**
//      * Determinar si el rol es Developer.
//      *
//      * IMPORTANTE:
//      * Debe coincidir exactamente con el nombre
//      * utilizado en el Seeder.
//      */
//     const isProtectedDeveloper = (
//         role: RoleWithDetails,
//     ): boolean => {
//         return role.name === 'Developer';
//     };

//     /**
//      * Determinar si el rol es Administrador.
//      */
//     const isProtectedAdministrator = (
//         role: RoleWithDetails,
//     ): boolean => {
//         return role.name === 'Administrador';
//     };

//     /**
//      * =========================================================
//      * PERMISO PARA EDITAR
//      * =========================================================
//      *
//      * Reglas:
//      *
//      * Developer:
//      *   ❌ Nunca se puede editar.
//      *
//      * Administrador:
//      *   ✅ Solamente Developer puede editarlo.
//      *
//      * Otros roles:
//      *   ✅ Si tiene roles.edit.
//      */
//     const canEditRole = (
//         role: RoleWithDetails,
//     ): boolean => {
//         /**
//          * Developer nunca se puede editar.
//          */
//         if (isProtectedDeveloper(role)) {
//             return false;
//         }

//         /**
//          * Administrador solamente puede ser
//          * editado por Developer.
//          */
//         if (isProtectedAdministrator(role)) {
//             return isDeveloper;
//         }

//         /**
//          * Otros roles necesitan el permiso.
//          */
//         return can('roles.edit');
//     };

//     /**
//      * =========================================================
//      * PERMISO PARA ELIMINAR
//      * =========================================================
//      *
//      * Reglas:
//      *
//      * Developer:
//      *   ❌ Nunca se puede eliminar.
//      *
//      * Administrador:
//      *   ❌ Nunca se puede eliminar.
//      *
//      * Otros roles:
//      *   ✅ Si tiene roles.delete.
//      */
//     const canDeleteRole = (
//         role: RoleWithDetails,
//     ): boolean => {
//         /**
//          * Los roles base del sistema nunca se pueden eliminar:
//          *
//          * - Developer
//          * - Administrador
//          */
//         if (
//             isProtectedDeveloper(role) ||
//             isProtectedAdministrator(role)
//         ) {
//             return false;
//         }

//         /**
//          * Otros roles necesitan el permiso.
//          */
//         return can('roles.delete');
//     };

//     /**
//      * =========================================================
//      * ELIMINAR ROL
//      * =========================================================
//      */
//     const deleteRole = (
//         role: RoleWithDetails,
//     ) => {
//         /**
//          * Protección adicional en frontend.
//          */
//         if (!canDeleteRole(role)) {
//             return;
//         }

//         if (
//             !confirm(
//                 `¿Está seguro de eliminar el rol "${role.name}"?`,
//             )
//         ) {
//             return;
//         }

//         router.delete(
//             `/roles/${role.id}`,
//             {
//                 preserveScroll: true,
//             },
//         );
//     };

//     /**
//      * =========================================================
//      * NOMBRE LEGIBLE DEL PERMISO
//      * =========================================================
//      *
//      * users.view   -> Ver
//      * users.create -> Crear
//      * users.edit   -> Editar
//      * users.delete -> Eliminar
//      * users.status -> Estado
//      */
//     const getPermissionLabel = (
//         permission: string,
//     ): string => {
//         const action = permission
//             .split('.')
//             .pop();

//         switch (action) {
//             case 'view':
//                 return 'Ver';

//             case 'create':
//                 return 'Crear';

//             case 'edit':
//                 return 'Editar';

//             case 'delete':
//                 return 'Eliminar';

//             case 'status':
//                 return 'Estado';

//             default:
//                 return action ?? permission;
//         }
//     };

//     return (
//         <>
//             <Head title="Roles" />

//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

//                 {/* =====================================================
//                     ENCABEZADO
//                 ====================================================== */}

//                 <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

//                     <div>
//                         <h1 className="text-2xl font-semibold tracking-tight">
//                             Roles
//                         </h1>

//                         <p className="text-sm text-muted-foreground">
//                             Administración de roles y permisos del sistema.
//                         </p>
//                     </div>

//                     {/* Crear rol */}

//                     {can('roles.create') && (
//                         <Button asChild>
//                             <Link href="/roles/create">
//                                 <Plus className="mr-2 h-4 w-4" />
//                                 Nuevo rol
//                             </Link>
//                         </Button>
//                     )}

//                 </div>

//                 {/* =====================================================
//                     FILTROS
//                 ====================================================== */}

//                 <Card>

//                     <CardContent className="p-4">

//                         <div className="relative max-w-xl">

//                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                             <Input
//                                 value={search}
//                                 onChange={(event) =>
//                                     setSearch(
//                                         event.target.value,
//                                     )
//                                 }
//                                 placeholder="Buscar por nombre de rol..."
//                                 className="pl-9"
//                             />

//                         </div>

//                     </CardContent>

//                 </Card>

//                 {/* =====================================================
//                     RESUMEN
//                 ====================================================== */}

//                 <div className="grid gap-4 md:grid-cols-3">

//                     {/* Total */}

//                     <Card>

//                         <CardHeader className="pb-2">

//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Total de roles
//                             </CardTitle>

//                         </CardHeader>

//                         <CardContent>

//                             <div className="flex items-center gap-3">

//                                 <ShieldCheck className="h-5 w-5 text-muted-foreground" />

//                                 <span className="text-2xl font-bold">
//                                     {roles.total}
//                                 </span>

//                             </div>

//                         </CardContent>

//                     </Card>

//                     {/* Mostrando */}

//                     <Card>

//                         <CardHeader className="pb-2">

//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Mostrando
//                             </CardTitle>

//                         </CardHeader>

//                         <CardContent>

//                             <span className="text-2xl font-bold">
//                                 {roles.from ?? 0} - {roles.to ?? 0}
//                             </span>

//                         </CardContent>

//                     </Card>

//                     {/* Página */}

//                     <Card>

//                         <CardHeader className="pb-2">

//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Página
//                             </CardTitle>

//                         </CardHeader>

//                         <CardContent>

//                             <span className="text-2xl font-bold">
//                                 {roles.current_page} / {roles.last_page}
//                             </span>

//                         </CardContent>

//                     </Card>

//                 </div>

//                 {/* =====================================================
//                     TABLA
//                 ====================================================== */}

//                 <Card className="overflow-hidden">

//                     <CardHeader>

//                         <CardTitle>
//                             Listado de roles
//                         </CardTitle>

//                     </CardHeader>

//                     <CardContent className="p-0">

//                         <div className="w-full overflow-x-auto">

//                             <table className="w-full min-w-[900px] text-sm">

//                                 {/* CABECERA */}

//                                 <thead className="border-b bg-muted/40">

//                                     <tr>

//                                         <th className="px-4 py-3 text-left font-medium">
//                                             Rol
//                                         </th>

//                                         <th className="px-4 py-3 text-left font-medium">
//                                             Permisos
//                                         </th>

//                                         <th className="px-4 py-3 text-left font-medium">
//                                             Usuarios
//                                         </th>

//                                         <th className="px-4 py-3 text-right font-medium">
//                                             Acciones
//                                         </th>

//                                     </tr>

//                                 </thead>

//                                 {/* CUERPO */}

//                                 <tbody>

//                                     {roles.data.length === 0 ? (

//                                         <tr>

//                                             <td
//                                                 colSpan={4}
//                                                 className="px-4 py-10 text-center text-muted-foreground"
//                                             >
//                                                 No se encontraron roles.
//                                             </td>

//                                         </tr>

//                                     ) : (

//                                         roles.data.map(
//                                             (role) => {

//                                                 const protectedDeveloper =
//                                                     isProtectedDeveloper(role);

//                                                 const protectedAdministrator =
//                                                     isProtectedAdministrator(role);

//                                                 const allowEdit =
//                                                     canEditRole(role);

//                                                 const allowDelete =
//                                                     canDeleteRole(role);

//                                                 return (
//                                                     <tr
//                                                         key={role.id}
//                                                         className="border-b last:border-0 hover:bg-muted/30"
//                                                     >

//                                                         {/* =================================================
//                                                             ROL
//                                                         ================================================== */}

//                                                         <td className="px-4 py-4">

//                                                             <div className="flex items-center gap-3">

//                                                                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">

//                                                                     <ShieldCheck className="h-4 w-4" />

//                                                                 </div>

//                                                                 <div>

//                                                                     <div className="flex items-center gap-2 font-medium">

//                                                                         {role.name}

//                                                                         {protectedDeveloper && (
//                                                                             <Badge variant="secondary">
//                                                                                 Protegido
//                                                                             </Badge>
//                                                                         )}

//                                                                         {protectedAdministrator && (
//                                                                             <Badge variant="outline">
//                                                                                 Sistema
//                                                                             </Badge>
//                                                                         )}

//                                                                     </div>

//                                                                     <div className="text-xs text-muted-foreground">
//                                                                         Rol del sistema
//                                                                     </div>

//                                                                 </div>

//                                                             </div>

//                                                         </td>

//                                                         {/* =================================================
//                                                             PERMISOS
//                                                         ================================================== */}

//                                                         <td className="px-4 py-4">

//                                                             <div className="flex flex-wrap gap-1">

//                                                                 {role.permissions.length > 0 ? (

//                                                                     <>

//                                                                         {role.permissions
//                                                                             .slice(0, 5)
//                                                                             .map(
//                                                                                 (
//                                                                                     permission,
//                                                                                 ) => (

//                                                                                     <Badge
//                                                                                         key={
//                                                                                             permission.id
//                                                                                         }
//                                                                                         variant="secondary"
//                                                                                     >
//                                                                                         {getPermissionLabel(
//                                                                                             permission.name,
//                                                                                         )}
//                                                                                     </Badge>

//                                                                                 ),
//                                                                             )}

//                                                                         {role.permissions.length > 5 && (

//                                                                             <Badge variant="outline">

//                                                                                 +{role.permissions.length - 5}

//                                                                             </Badge>

//                                                                         )}

//                                                                     </>

//                                                                 ) : (

//                                                                     <span className="text-xs text-muted-foreground">
//                                                                         Sin permisos
//                                                                     </span>

//                                                                 )}

//                                                             </div>

//                                                         </td>

//                                                         {/* =================================================
//                                                             USUARIOS
//                                                         ================================================== */}

//                                                         <td className="px-4 py-4">

//                                                             <Badge variant="secondary">

//                                                                 {role.users_count}{' '}

//                                                                 {role.users_count === 1
//                                                                     ? 'usuario'
//                                                                     : 'usuarios'}

//                                                             </Badge>

//                                                         </td>

//                                                         {/* =================================================
//                                                             ACCIONES
//                                                         ================================================== */}

//                                                         <td className="px-4 py-4">

//                                                             <div className="flex justify-end gap-1">

//                                                                 {/* Ver */}

//                                                                 {can('roles.view') && (
//                                                                     <Button
//                                                                         variant="ghost"
//                                                                         size="icon"
//                                                                         asChild
//                                                                         title="Ver rol"
//                                                                     >
//                                                                         <Link
//                                                                             href={`/roles/${role.id}`}
//                                                                         >
//                                                                             <Eye className="h-4 w-4" />
//                                                                         </Link>
//                                                                     </Button>
//                                                                 )}

//                                                                 {/* Editar */}

//                                                                 {allowEdit && (
//                                                                     <Button
//                                                                         variant="ghost"
//                                                                         size="icon"
//                                                                         asChild
//                                                                         title={
//                                                                             protectedAdministrator
//                                                                                 ? 'Editar Administrador'
//                                                                                 : 'Editar rol'
//                                                                         }
//                                                                     >
//                                                                         <Link
//                                                                             href={`/roles/${role.id}/edit`}
//                                                                         >
//                                                                             <Pencil className="h-4 w-4" />
//                                                                         </Link>
//                                                                     </Button>
//                                                                 )}

//                                                                 {/* Eliminar */}

//                                                                 {allowDelete && (
//                                                                     <Button
//                                                                         variant="ghost"
//                                                                         size="icon"
//                                                                         title={
//                                                                             protectedAdministrator
//                                                                                 ? 'Eliminar Administrador'
//                                                                                 : 'Eliminar rol'
//                                                                         }
//                                                                         onClick={() =>
//                                                                             deleteRole(
//                                                                                 role,
//                                                                             )
//                                                                         }
//                                                                     >
//                                                                         <Trash2 className="h-4 w-4 text-destructive" />
//                                                                     </Button>
//                                                                 )}

//                                                             </div>

//                                                         </td>

//                                                     </tr>
//                                                 );
//                                             },
//                                         )

//                                     )}

//                                 </tbody>

//                             </table>

//                         </div>

//                     </CardContent>

//                 </Card>

//                 {/* =====================================================
//                     PAGINACIÓN
//                 ====================================================== */}

//                 <Pagination
//                     links={roles.links}
//                 />

//             </div>
//         </>
//     );
// }
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import {
    Eye,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UsersRound,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Pagination } from '@/components/pagination';
import { usePermissions } from '@/hooks/use-permissions';

import type {
    PaginatedResponse,
    RoleWithDetails,
} from '@/types';

type Props = {
    roles: PaginatedResponse<RoleWithDetails>;

    filters?: {
        search?: string;
    };
};

export default function Index({
    roles,
    filters = {},
}: Props) {
    const [search, setSearch] = useState(
        filters.search ?? '',
    );

    /**
     * =========================================================
     * PERMISOS DEL USUARIO ACTUAL
     * =========================================================
     */
    const { can, hasRole } = usePermissions();

    /**
     * Developer tiene privilegios especiales sobre
     * el rol Administrador.
     */
    const isDeveloper = hasRole('Developer');

    /**
     * =========================================================
     * BÚSQUEDA
     * =========================================================
     */
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/roles',
                {
                    search: search || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['roles', 'filters'],
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    /**
     * =========================================================
     * TIEMPO REAL - ROLES
     * =========================================================
     */
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (!window.Echo) {
            return;
        }

        const channel = window.Echo.private('roles');

        channel.listen('.role.created', () => {
            router.reload({
                only: ['roles'],
                preserveScroll: true,
                preserveState: true,
            });
        });

        channel.listen('.role.updated', () => {
            router.reload({
                only: ['roles'],
                preserveScroll: true,
                preserveState: true,
            });
        });

        channel.listen('.role.deleted', () => {
            router.reload({
                only: ['roles'],
                preserveScroll: true,
                preserveState: true,
            });
        });

        return () => {
            window.Echo.leave('roles');
        };
    }, []);

    /**
     * =========================================================
     * ROLES PROTEGIDOS
     * =========================================================
     */
    const isProtectedDeveloper = (
        role: RoleWithDetails,
    ): boolean => {
        return role.name === 'Developer';
    };

    const isProtectedAdministrator = (
        role: RoleWithDetails,
    ): boolean => {
        return role.name === 'Administrador';
    };

    /**
     * =========================================================
     * PERMISO PARA EDITAR
     * =========================================================
     *
     * Developer:
     *   No se puede editar.
     *
     * Administrador:
     *   Solamente Developer puede editarlo.
     *
     * Otros:
     *   Requieren roles.edit.
     */
    const canEditRole = (
        role: RoleWithDetails,
    ): boolean => {
        if (isProtectedDeveloper(role)) {
            return false;
        }

        if (isProtectedAdministrator(role)) {
            return isDeveloper;
        }

        return can('roles.edit');
    };

    /**
     * =========================================================
     * PERMISO PARA ELIMINAR
     * =========================================================
     *
     * Developer:
     *   No se puede eliminar.
     *
     * Administrador:
     *   No se puede eliminar.
     *
     * Otros:
     *   Requieren roles.delete.
     */
    const canDeleteRole = (
        role: RoleWithDetails,
    ): boolean => {
        if (
            isProtectedDeveloper(role) ||
            isProtectedAdministrator(role)
        ) {
            return false;
        }

        return can('roles.delete');
    };

    /**
     * =========================================================
     * ELIMINAR ROL
     * =========================================================
     */
    const deleteRole = (
        role: RoleWithDetails,
    ) => {
        if (!canDeleteRole(role)) {
            return;
        }

        if (
            !confirm(
                `¿Está seguro de eliminar el rol "${role.name}"?`,
            )
        ) {
            return;
        }

        router.delete(
            `/roles/${role.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    /**
     * =========================================================
     * NOMBRE LEGIBLE DEL PERMISO
     * =========================================================
     */
    const getPermissionLabel = (
        permission: string,
    ): string => {
        const action = permission
            .split('.')
            .pop();

        switch (action) {
            case 'view':
                return 'Ver';

            case 'create':
                return 'Crear';

            case 'edit':
                return 'Editar';

            case 'delete':
                return 'Eliminar';

            case 'status':
                return 'Estado';

            default:
                return action ?? permission;
        }
    };

    return (
        <>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">

                {/* =====================================================
                    ENCABEZADO
                ====================================================== */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                Roles
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Administre los roles y permisos de acceso al SISAS.
                            </p>
                        </div>

                    </div>

                    {can('roles.create') && (
                        <Button
                            asChild
                            className="h-10 gap-2 rounded-lg bg-slate-900 px-4 text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                            <Link href="/roles/create">
                                <Plus className="h-4 w-4" />
                                Nuevo rol
                            </Link>
                        </Button>
                    )}

                </div>

                {/* =====================================================
                    RESUMEN
                ====================================================== */}
                <div className="grid gap-3 sm:grid-cols-3">

                    {/* TOTAL */}

                    <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                        <CardContent className="flex items-center gap-4 p-4">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                <ShieldCheck className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Total de roles
                                </p>

                                <p className="mt-0.5 text-2xl font-semibold text-slate-900 dark:text-white">
                                    {roles.total}
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                    {/* MOSTRANDO */}

                    <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                        <CardContent className="flex items-center gap-4 p-4">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                <UsersRound className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Mostrando
                                </p>

                                <p className="mt-0.5 text-2xl font-semibold text-slate-900 dark:text-white">
                                    {roles.from ?? 0} - {roles.to ?? 0}
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                    {/* PÁGINA */}

                    <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                        <CardContent className="flex items-center gap-4 p-4">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                <span className="text-sm font-semibold">
                                    {roles.current_page}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Página
                                </p>

                                <p className="mt-0.5 text-2xl font-semibold text-slate-900 dark:text-white">
                                    {roles.current_page}{' '}
                                    <span className="text-base font-normal text-slate-400">
                                        / {roles.last_page}
                                    </span>
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                </div>

                {/* =====================================================
                    FILTROS
                ====================================================== */}
                <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                    <CardContent className="p-4">

                        <div className="relative max-w-xl">

                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value,
                                    )
                                }
                                placeholder="Buscar por nombre de rol..."
                                className="h-10 border-slate-200 bg-white pl-9 dark:border-slate-800 dark:bg-slate-950"
                            />

                        </div>

                    </CardContent>
                </Card>

                {/* =====================================================
                    TABLA
                ====================================================== */}
                <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px]">

                            {/* CABECERA */}

                            <thead className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">

                                <tr>

                                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Rol
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Permisos
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Usuarios
                                    </th>

                                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            {/* CUERPO */}

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                                {roles.data.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={4}
                                            className="px-6 py-16 text-center"
                                        >

                                            <div className="flex flex-col items-center justify-center">

                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                                                    <ShieldCheck className="h-6 w-6" />
                                                </div>

                                                <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                                                    No se encontraron roles
                                                </h3>

                                                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                                    No existen roles que coincidan con el criterio de búsqueda.
                                                </p>

                                                {search && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="mt-5"
                                                        onClick={() =>
                                                            setSearch('')
                                                        }
                                                    >
                                                        Limpiar búsqueda
                                                    </Button>
                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    roles.data.map((role) => {

                                        const protectedDeveloper =
                                            isProtectedDeveloper(role);

                                        const protectedAdministrator =
                                            isProtectedAdministrator(role);

                                        const allowEdit =
                                            canEditRole(role);

                                        const allowDelete =
                                            canDeleteRole(role);

                                        return (
                                            <tr
                                                key={role.id}
                                                className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/40"
                                            >

                                                {/* =================================================
                                                    ROL
                                                ================================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            <ShieldCheck className="h-5 w-5" />
                                                        </div>

                                                        <div className="min-w-0">

                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                                    {role.name}
                                                                </span>

                                                                {protectedDeveloper && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-slate-300 bg-slate-100 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                                    >
                                                                        Protegido
                                                                    </Badge>
                                                                )}

                                                                {protectedAdministrator && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                                                                    >
                                                                        Sistema
                                                                    </Badge>
                                                                )}

                                                            </div>

                                                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                                Rol del sistema
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* =================================================
                                                    PERMISOS
                                                ================================================== */}

                                                <td className="px-4 py-4">

                                                    <div className="flex max-w-[430px] flex-wrap gap-1.5">

                                                        {role.permissions.length > 0 ? (

                                                            <>

                                                                {role.permissions
                                                                    .slice(0, 5)
                                                                    .map(
                                                                        (
                                                                            permission,
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    permission.id
                                                                                }
                                                                                variant="outline"
                                                                                className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                                                            >
                                                                                {getPermissionLabel(
                                                                                    permission.name,
                                                                                )}
                                                                            </Badge>
                                                                        ),
                                                                    )}

                                                                {role.permissions.length >
                                                                    5 && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-slate-200 bg-white text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
                                                                    >
                                                                        +
                                                                        {role.permissions.length -
                                                                            5}
                                                                    </Badge>
                                                                )}

                                                            </>

                                                        ) : (

                                                            <span className="text-xs text-slate-400">
                                                                Sin permisos
                                                            </span>

                                                        )}

                                                    </div>

                                                </td>

                                                {/* =================================================
                                                    USUARIOS
                                                ================================================== */}

                                                <td className="px-4 py-4">

                                                    <Badge
                                                        variant="outline"
                                                        className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                                    >
                                                        <UsersRound className="mr-1.5 h-3.5 w-3.5" />

                                                        {role.users_count}{' '}

                                                        {role.users_count ===
                                                        1
                                                            ? 'usuario'
                                                            : 'usuarios'}
                                                    </Badge>

                                                </td>

                                                {/* =================================================
                                                    ACCIONES
                                                ================================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end gap-1 opacity-100 transition-opacity md:opacity-70 md:group-hover:opacity-100">

                                                        {/* VER */}

                                                        {can('roles.view') && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                                title="Ver rol"
                                                                className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                                                            >
                                                                <Link
                                                                    href={`/roles/${role.id}`}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}

                                                        {/* EDITAR */}

                                                        {allowEdit && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                                title={
                                                                    protectedAdministrator
                                                                        ? 'Editar Administrador'
                                                                        : 'Editar rol'
                                                                }
                                                                className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                                                            >
                                                                <Link
                                                                    href={`/roles/${role.id}/edit`}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}

                                                        {/* ELIMINAR */}

                                                        {allowDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Eliminar rol"
                                                                onClick={() =>
                                                                    deleteRole(
                                                                        role,
                                                                    )
                                                                }
                                                                className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                </Card>

                {/* =====================================================
                    PAGINACIÓN
                ====================================================== */}

                {roles.links &&
                    roles.links.length > 0 && (
                        <div className="flex justify-end">
                            <Pagination
                                links={roles.links}
                            />
                        </div>
                    )}

            </div>
        </>
    );
}
