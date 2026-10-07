// import { Head, Link, router } from '@inertiajs/react';
// import { useEffect, useState } from 'react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';

// import {
//     Eye,
//     Pencil,
//     Plus,
//     Search,
//     Trash2,
//     UserRound,
// } from 'lucide-react';
// import type {
//     PaginatedResponse,
//     AdminUser,
//     UserFilters,
//     UserPresence,
// } from '@/types';
// import { Pagination } from '@/components/pagination';

// import { usePermissions } from '@/hooks/use-permissions';


// type Props = {
//     users: PaginatedResponse<AdminUser>;
//     filters: UserFilters;
// };

// export default function Index({ users, filters }: Props) {
//     const { can } = usePermissions();

//     const [search, setSearch] = useState(filters.search ?? '');
//     const [status, setStatus] = useState(filters.status ?? '');

//     const [presenceUpdates, setPresenceUpdates] = useState<
//         Record<number, UserPresence>
//     >({});
//     const [userRows, setUserRows] = useState(users.data);

//     useEffect(() => {
//         setUserRows(users.data);
//     }, [users.data]);

//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             router.get(
//                 '/users',
//                 {
//                     search: search || undefined,
//                     status: status || undefined,
//                 },
//                 {
//                     preserveState: true,
//                     preserveScroll: true,
//                     replace: true,
//                 },
//             );
//         }, 400);

//         return () => clearTimeout(timeout);
//     }, [search, status]);

//     useEffect(() => {
//         // console.log('🔌 Suscribiendo al canal private-users...');

//         const channel = window.Echo.private('users');

//         channel.subscribed(() => {
//             // console.log('✅ Suscripción exitosa al canal private-users',);
//         });

//         channel.error((error: unknown) => {
//             console.error(
//                 '❌ Error al suscribirse a private-users:',
//                 error,
//             );
//         });

//         channel.listen(
//             '.user.presence.updated',

//             (event: {
//                 user_id: number;
//                 status: UserPresence['status'];
//                 last_activity: string | null;
//                 ip_address: string | null;
//             }) => {

//                 setPresenceUpdates((current) => ({
//                     ...current,
//                     [event.user_id]: {
//                         status: event.status,
//                         last_activity: event.last_activity,
//                         ip_address: event.ip_address,
//                     },
//                 }));
//             },
//         );

//         channel.listen('.user.created', (event: {
//             user: AdminUser;
//         }) => {

//             setUserRows((current) => {
//                 const exists = current.some(
//                     (user) => user.id === event.user.id,
//                 );

//                 if (exists) {
//                     return current;
//                 }

//                 return [event.user, ...current];
//             });
//         });

//         channel.listen('.user.updated', (event: {
//             user: AdminUser;
//         }) => {

//             setUserRows((current) =>
//                 current.map((user) =>
//                     user.id === event.user.id
//                         ? event.user
//                         : user,
//                 ),
//             );
//         });

//         channel.listen('.user.deleted', (event: {
//             user_id: number;
//         }) => {

//             setUserRows((current) =>
//                 current.filter(
//                     (user) => user.id !== event.user_id,
//                 ),
//             );
//         });

//         return () => {

//             window.Echo.leave('users');
//         };
//     }, []);
//     const deleteUser = (user: AdminUser) => {
//         if (
//             !confirm(
//                 `¿Está seguro de eliminar al usuario "${user.name}"?`,
//             )
//         ) {
//             return;
//         }

//         router.delete(`/users/${user.id}`, {
//             preserveScroll: true,
//         });
//     };

//     const getPresenceLabel = (presence: UserPresence) => {
//         switch (presence.status) {
//             case 'online':
//                 return 'Online';

//             case 'away':
//                 return 'Ausente';

//             case 'offline':
//                 return 'Offline';

//             default:
//                 return presence.status;
//         }
//     };

//     const getPresenceClass = (presence: UserPresence) => {
//         switch (presence.status) {
//             case 'online':
//                 return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

//             case 'away':
//                 return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

//             default:
//                 return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
//         }
//     };

//     const getStatusClass = (status: string) => {
//         return status === 'active'
//             ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
//             : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
//     };

//     const getStatusLabel = (status: string) => {
//         return status === 'active' ? 'Activo' : 'Inactivo';
//     };

//     const formatDate = (date: string | null) => {
//         if (!date) {
//             return 'Nunca';
//         }

//         const value = new Date(date);

//         if (Number.isNaN(value.getTime())) {
//             return 'Fecha inválida';
//         }

//         const day = String(value.getDate()).padStart(2, '0');
//         const month = String(value.getMonth() + 1).padStart(2, '0');
//         const year = value.getFullYear();

//         const hours = String(value.getHours()).padStart(2, '0');
//         const minutes = String(value.getMinutes()).padStart(2, '0');

//         return `${day}/${month}/${year} ${hours}:${minutes}`;
//     };

//     return (

//         <>
//             <Head title="Usuarios" />

//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 {/* Encabezado */}
//                 <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
//                     <div>
//                         <h1 className="text-2xl font-semibold tracking-tight">
//                             Usuarios
//                         </h1>

//                         <p className="text-sm text-muted-foreground">
//                             Administración de usuarios, acceso y presencia.
//                         </p>
//                     </div>

//                     {can('users.create') && (
//                         <Button asChild>
//                             <Link href="/users/create">
//                                 <Plus className="mr-2 h-4 w-4" />
//                                 Nuevo usuario
//                             </Link>
//                         </Button>
//                     )}
//                 </div>

//                 {/* Filtros */}
//                 <Card>
//                     <CardContent className="p-4">
//                         <div className="flex flex-col gap-4 md:flex-row">
//                             <div className="relative flex-1">
//                                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                                 <Input
//                                     value={search}
//                                     onChange={(event) =>
//                                         setSearch(event.target.value)
//                                     }
//                                     placeholder="Buscar por nombre o correo..."
//                                     className="pl-9"
//                                 />
//                             </div>

//                             <select
//                                 value={status}
//                                 onChange={(event) =>
//                                     setStatus(event.target.value)
//                                 }
//                                 className="h-10 rounded-md border border-input bg-background px-3 text-sm"
//                             >
//                                 <option value="">Todos los estados</option>
//                                 <option value="active">Activos</option>
//                                 <option value="inactive">Inactivos</option>
//                             </select>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Resumen */}
//                 <div className="grid gap-4 md:grid-cols-3">
//                     <Card>
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Total de usuarios
//                             </CardTitle>
//                         </CardHeader>

//                         <CardContent>
//                             <div className="flex items-center gap-3">
//                                 <UserRound className="h-5 w-5 text-muted-foreground" />

//                                 <span className="text-2xl font-bold">
//                                     {users.total}
//                                 </span>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Mostrando
//                             </CardTitle>
//                         </CardHeader>

//                         <CardContent>
//                             <span className="text-2xl font-bold">
//                                 {users.from ?? 0} - {users.to ?? 0}
//                             </span>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-sm font-medium text-muted-foreground">
//                                 Página
//                             </CardTitle>
//                         </CardHeader>

//                         <CardContent>
//                             <span className="text-2xl font-bold">
//                                 {users.current_page} / {users.last_page}
//                             </span>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Tabla */}
//                 <Card className="overflow-hidden">
//                     <CardHeader>
//                         <CardTitle>Listado de usuarios</CardTitle>
//                     </CardHeader>

//                     <CardContent className="p-0">
//                         <div className="w-full overflow-x-auto">
//                             <table className="w-full min-w-[1000px] text-sm">
//                                 <thead className="border-b bg-muted/40">
//                                     <tr>
//                                         <th className="px-4 py-3 text-left font-medium">
//                                             Usuario
//                                         </th>

//                                         <th className="px-4 py-3 text-left font-medium">
//                                             Roles
//                                         </th>

//                                         <th className="px-4 py-3 text-left font-medium">
//                                             Acceso
//                                         </th>

//                                         <th className="px-4 py-3 text-left font-medium">
//                                             Presencia
//                                         </th>

//                                         <th className="px-4 py-3 text-left font-medium">
//                                             Última actividad
//                                         </th>

//                                         <th className="px-4 py-3 text-left font-medium">
//                                             IP
//                                         </th>

//                                         <th className="px-4 py-3 text-right font-medium">
//                                             Acciones
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {users.data.length === 0 ? (
//                                         <tr>
//                                             <td
//                                                 colSpan={7}
//                                                 className="px-4 py-10 text-center text-muted-foreground"
//                                             >
//                                                 No se encontraron usuarios.
//                                             </td>
//                                         </tr>
//                                     ) : (
//                                         // users.data.map((user) => {
//                                         userRows.map((user) => {
//                                             const presence: UserPresence =
//                                                 presenceUpdates[user.id] ?? user.presence ?? {
//                                                     status: 'offline',
//                                                     last_activity: null,
//                                                     ip_address: null,
//                                                 };

//                                             return (
//                                                 <tr
//                                                     key={user.id}
//                                                     className="border-b last:border-0 hover:bg-muted/30"
//                                                 >
//                                                     <td className="px-4 py-4">
//                                                         <div className="font-medium">
//                                                             {user.name}
//                                                         </div>

//                                                         <div className="text-xs text-muted-foreground">
//                                                             {user.email}
//                                                         </div>
//                                                     </td>

//                                                     <td className="px-4 py-4">
//                                                         <div className="flex flex-wrap gap-1">
//                                                             {user.roles.length > 0 ? (
//                                                                 user.roles.map((role) => (
//                                                                     <Badge
//                                                                         key={role.id}
//                                                                         variant="secondary"
//                                                                     >
//                                                                         {role.name}
//                                                                     </Badge>
//                                                                 ))
//                                                             ) : (
//                                                                 <span className="text-xs text-muted-foreground">
//                                                                     Sin rol
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </td>

//                                                     <td className="px-4 py-4">
//                                                         <Badge
//                                                             className={getStatusClass(
//                                                                 user.status,
//                                                             )}
//                                                         >
//                                                             {getStatusLabel(user.status)}
//                                                         </Badge>
//                                                     </td>

//                                                     <td className="px-4 py-4">
//                                                         <Badge
//                                                             className={getPresenceClass(
//                                                                 presence,
//                                                             )}
//                                                         >
//                                                             <span className="mr-1">
//                                                                 ●
//                                                             </span>

//                                                             {getPresenceLabel(
//                                                                 presence,
//                                                             )}
//                                                         </Badge>
//                                                     </td>

//                                                     <td className="px-4 py-4 text-xs">
//                                                         {formatDate(
//                                                             presence.last_activity ??
//                                                             user.last_login_at,
//                                                         )}
//                                                     </td>

//                                                     <td className="px-4 py-4 font-mono text-xs">
//                                                         {presence.ip_address ??
//                                                             user.last_login_ip ??
//                                                             '—'}
//                                                     </td>

//                                                     <td className="px-4 py-4">
//                                                         <div className="flex justify-end gap-1">
//                                                             {can('users.view') && (
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="icon"
//                                                                     asChild
//                                                                     title="Ver usuario"
//                                                                 >
//                                                                     <Link
//                                                                         href={`/users/${user.id}`}
//                                                                     >
//                                                                         <Eye className="h-4 w-4" />
//                                                                     </Link>
//                                                                 </Button>
//                                                             )}
//                                                             {can('users.edit') && (
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="icon"
//                                                                     asChild
//                                                                     title="Editar usuario"
//                                                                 >
//                                                                     <Link
//                                                                         href={`/users/${user.id}/edit`}
//                                                                     >
//                                                                         <Pencil className="h-4 w-4" />
//                                                                     </Link>
//                                                                 </Button>
//                                                             )}
//                                                             {can('users.delete') && (
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="icon"
//                                                                     title="Eliminar usuario"
//                                                                     onClick={() =>
//                                                                         deleteUser(user)
//                                                                     }
//                                                                 >
//                                                                     <Trash2 className="h-4 w-4 text-destructive" />
//                                                                 </Button>
//                                                             )}
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Paginación */}
//                 <Pagination links={users.links} />
//             </div>
//         </>
//     );
// }
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
    Eye,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UserRound,
    UsersRound,
} from 'lucide-react';

import type {
    AdminUser,
    PaginatedResponse,
    UserFilters,
    UserPresence,
} from '@/types';

import { Pagination } from '@/components/pagination';
import { usePermissions } from '@/hooks/use-permissions';

type Props = {
    users: PaginatedResponse<AdminUser>;
    filters: UserFilters;
};

export default function Index({ users, filters }: Props) {
    const { can } = usePermissions();

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const [presenceUpdates, setPresenceUpdates] = useState<
        Record<number, UserPresence>
    >({});

    const [userRows, setUserRows] = useState(users.data);

    /**
     * Mantener sincronizada la tabla con los datos
     * recibidos desde Inertia.
     */
    useEffect(() => {
        setUserRows(users.data);
    }, [users.data]);

    /**
     * Búsqueda y filtros.
     */
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/users',
                {
                    search: search || undefined,
                    status: status || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, status]);

    /**
     * Eventos en tiempo real mediante Laravel Echo.
     *
     * Se conserva la estructura real de tus eventos:
     *
     * .user.presence.updated
     * .user.created
     * .user.updated
     * .user.deleted
     */
    useEffect(() => {
        const channel = window.Echo.private('users');

        channel.listen(
            '.user.presence.updated',
            (event: {
                user_id: number;
                status: UserPresence['status'];
                last_activity: string | null;
                ip_address: string | null;
            }) => {
                setPresenceUpdates((current) => ({
                    ...current,
                    [event.user_id]: {
                        status: event.status,
                        last_activity: event.last_activity,
                        ip_address: event.ip_address,
                    },
                }));
            },
        );

        channel.listen(
            '.user.created',
            (event: { user: AdminUser }) => {
                setUserRows((current) => {
                    const exists = current.some(
                        (user) => user.id === event.user.id,
                    );

                    if (exists) {
                        return current;
                    }

                    return [event.user, ...current];
                });
            },
        );

        channel.listen(
            '.user.updated',
            (event: { user: AdminUser }) => {
                setUserRows((current) =>
                    current.map((user) =>
                        user.id === event.user.id
                            ? event.user
                            : user,
                    ),
                );
            },
        );

        channel.listen(
            '.user.deleted',
            (event: { user_id: number }) => {
                setUserRows((current) =>
                    current.filter(
                        (user) => user.id !== event.user_id,
                    ),
                );
            },
        );

        return () => {
            window.Echo.leave('users');
        };
    }, []);

    /**
     * Eliminar usuario.
     */
    const deleteUser = (user: AdminUser) => {
        if (
            !confirm(
                `¿Está seguro de eliminar al usuario "${user.name}"?`,
            )
        ) {
            return;
        }

        router.delete(`/users/${user.id}`, {
            preserveScroll: true,
        });
    };

    /**
     * Estado de presencia.
     */
    const getPresenceLabel = (presence: UserPresence) => {
        switch (presence.status) {
            case 'online':
                return 'En línea';

            case 'away':
                return 'Ausente';

            default:
                return 'Offline';
        }
    };

    const getPresenceClass = (presence: UserPresence) => {
        switch (presence.status) {
            case 'online':
                return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400';

            case 'away':
                return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400';

            default:
                return 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400';
        }
    };

    /**
     * Estado de la cuenta.
     */
    const getStatusClass = (status: string) => {
        if (status === 'active') {
            return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400';
        }

        return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400';
    };

    const getStatusLabel = (status: string) => {
        return status === 'active' ? 'Activo' : 'Inactivo';
    };

    /**
     * Formato de fecha.
     */
    const formatDate = (
        date: string | null | undefined,
    ) => {
        if (!date) {
            return 'Nunca';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Fecha inválida';
        }

        return parsedDate.toLocaleString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Iniciales del usuario.
     */
    const getInitials = (user: AdminUser) => {
        const firstName = user.name?.trim()?.charAt(0) ?? '';
        const lastName = user.apellido?.trim()?.charAt(0) ?? '';

        const initials = `${firstName}${lastName}`.toUpperCase();

        return initials || 'U';
    };

    /**
     * Usuarios actualmente en línea en la página.
     */
    const onlineCount = useMemo(() => {
        return userRows.filter((user) => {
            const presence: UserPresence =
                presenceUpdates[user.id] ??
                user.presence ?? {
                    status: 'offline',
                    last_activity: null,
                    ip_address: null,
                };

            return presence.status === 'online';
        }).length;
    }, [userRows, presenceUpdates]);

    return (
        <>
            <Head title="Usuarios" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                {/* =========================================================
                    ENCABEZADO
                ========================================================= */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                            <UsersRound className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                Usuarios
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Administre los usuarios, sus roles,
                                permisos y acceso al SISAS.
                            </p>
                        </div>
                    </div>

                    {can('users.create') && (
                        <Button
                            asChild
                            className="h-10 gap-2 rounded-lg bg-slate-900 px-4 text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                            <Link href="/users/create">
                                <Plus className="h-4 w-4" />
                                Nuevo usuario
                            </Link>
                        </Button>
                    )}
                </div>

                {/* =========================================================
                    RESUMEN
                ========================================================= */}
                <div className="grid gap-3 sm:grid-cols-3">
                    <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                <UsersRound className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Total usuarios
                                </p>

                                <p className="mt-0.5 text-2xl font-semibold text-slate-900 dark:text-white">
                                    {users.total}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                <UserRound className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Mostrando
                                </p>

                                <p className="mt-0.5 text-2xl font-semibold text-slate-900 dark:text-white">
                                    {userRows.length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-50 dark:ring-emerald-950/40" />

                                <ShieldCheck className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    En línea
                                </p>

                                <p className="mt-0.5 text-2xl font-semibold text-slate-900 dark:text-white">
                                    {onlineCount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* =========================================================
                    FILTROS
                ========================================================= */}
                <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Buscar por nombre, apellido o correo..."
                                    className="h-10 border-slate-200 bg-white pl-9 dark:border-slate-800 dark:bg-slate-950"
                                />
                            </div>

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:focus:border-slate-600 dark:focus:ring-slate-800"
                            >
                                <option value="">
                                    Todos los estados
                                </option>

                                <option value="active">
                                    Activos
                                </option>

                                <option value="inactive">
                                    Inactivos
                                </option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* =========================================================
                    TABLA
                ========================================================= */}
                <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px]">
                            <thead className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Usuario
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Roles
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Acceso
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Presencia
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Última actividad
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        IP
                                    </th>

                                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {userRows.map((user) => {
                                    const presence: UserPresence =
                                        presenceUpdates[user.id] ??
                                        user.presence ?? {
                                            status: 'offline',
                                            last_activity: null,
                                            ip_address: null,
                                        };

                                    const lastActivity =
                                        presence.last_activity ??
                                        user.last_login_at;

                                    const ipAddress =
                                        presence.ip_address ??
                                        user.last_login_ip ??
                                        '—';

                                    return (
                                        <tr
                                            key={user.id}
                                            className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/40"
                                        >
                                            {/* USUARIO */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {user.imagen ? (
                                                            <img
                                                                src={user.imagen}
                                                                alt={`${user.name} ${user.apellido ?? ''}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            getInitials(user)
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                                {user.name}{' '}
                                                                {user.apellido}
                                                            </p>

                                                            <span
                                                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                                                    presence.status ===
                                                                    'online'
                                                                        ? 'bg-emerald-500'
                                                                        : presence.status ===
                                                                            'away'
                                                                          ? 'bg-amber-500'
                                                                          : 'bg-slate-300 dark:bg-slate-600'
                                                                }`}
                                                            />
                                                        </div>

                                                        <p className="mt-0.5 max-w-[280px] truncate text-xs text-slate-500 dark:text-slate-400">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* ROLES */}
                                            <td className="px-4 py-4">
                                                <div className="flex max-w-[190px] flex-wrap gap-1.5">
                                                    {user.roles?.length ? (
                                                        user.roles.map(
                                                            (role) => (
                                                                <Badge
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    variant="outline"
                                                                    className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                                                >
                                                                    {
                                                                        role.name
                                                                    }
                                                                </Badge>
                                                            ),
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-slate-400">
                                                            Sin rol
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* ACCESO */}
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className={getStatusClass(
                                                        user.status,
                                                    )}
                                                >
                                                    {getStatusLabel(
                                                        user.status,
                                                    )}
                                                </Badge>
                                            </td>

                                            {/* PRESENCIA */}
                                            <td className="px-4 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className={getPresenceClass(
                                                        presence,
                                                    )}
                                                >
                                                    <span
                                                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                                            presence.status ===
                                                            'online'
                                                                ? 'bg-emerald-500'
                                                                : presence.status ===
                                                                    'away'
                                                                  ? 'bg-amber-500'
                                                                  : 'bg-slate-400'
                                                        }`}
                                                    />

                                                    {getPresenceLabel(
                                                        presence,
                                                    )}
                                                </Badge>
                                            </td>

                                            {/* ACTIVIDAD */}
                                            <td className="px-4 py-4">
                                                <span className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                    {formatDate(
                                                        lastActivity,
                                                    )}
                                                </span>
                                            </td>

                                            {/* IP */}
                                            <td className="px-4 py-4">
                                                <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                                                    {ipAddress}
                                                </code>
                                            </td>

                                            {/* ACCIONES */}
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-1 opacity-100 transition-opacity md:opacity-70 md:group-hover:opacity-100">
                                                    {can('users.view') && (
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                                                        >
                                                            <Link
                                                                href={`/users/${user.id}`}
                                                                title="Ver usuario"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {can('users.edit') && (
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                                                        >
                                                            <Link
                                                                href={`/users/${user.id}/edit`}
                                                                title="Editar usuario"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {can('users.delete') && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user,
                                                                )
                                                            }
                                                            title="Eliminar usuario"
                                                            className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* =====================================================
                        ESTADO VACÍO
                    ===================================================== */}
                    {userRows.length === 0 && (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                                <UserRound className="h-6 w-6" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                                No se encontraron usuarios
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                No existen usuarios que coincidan con
                                los criterios de búsqueda seleccionados.
                            </p>

                            {(search || status) && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-5"
                                    onClick={() => {
                                        setSearch('');
                                        setStatus('');
                                    }}
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    )}
                </Card>

                {/* =========================================================
                    PAGINACIÓN
                ========================================================= */}
                {users.links && users.links.length > 0 && (
                    <div className="flex justify-end">
                        <Pagination links={users.links} />
                    </div>
                )}
            </div>
        </>
    );
}
