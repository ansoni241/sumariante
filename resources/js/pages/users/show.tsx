import { Head, Link, router } from '@inertiajs/react';

import {
    Activity,
    ArrowLeft,
    Check,
    Clock3,
    KeyRound,
    LockKeyhole,
    Mail,
    Pencil,
    ShieldCheck,
    Trash2,
    UserRound,
    UsersRound,
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

import type { User } from '@/types';

type Props = {
    user: User;
};

export default function Show({ user }: Props) {
    const { can, hasRole } = usePermissions();

    /*
    |--------------------------------------------------------------------------
    | Cuenta Developer principal
    |--------------------------------------------------------------------------
    */

    const isDeveloperAccount =
        user.roles?.some(
            (role) => role.name === 'Developer',
        ) ?? false;

    const isCurrentUserDeveloper =
        hasRole('Developer');

    /*
    |--------------------------------------------------------------------------
    | Permisos de acciones
    |--------------------------------------------------------------------------
    */

    const canEditUser =
        !isDeveloperAccount &&
        can('users.edit');

    const canDeleteUser =
        !isDeveloperAccount &&
        can('users.delete');

    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    const userStatus = user.status ?? 'inactive';

    const isActive =
        userStatus === 'active';

    const isBlocked =
        userStatus === 'blocked';

    /*
    |--------------------------------------------------------------------------
    | Presencia
    |--------------------------------------------------------------------------
    */

    const presence =
        user.presence ?? null;

    const presenceStatus =
        presence?.status ?? 'offline';

    const isOnline =
        presenceStatus === 'online';

    const isAway =
        presenceStatus === 'away';

    /*
    |--------------------------------------------------------------------------
    | Avatar
    |--------------------------------------------------------------------------
    */

    const getInitials = (): string => {
        const name =
            user.name?.trim() ?? '';

        const apellido =
            user.apellido?.trim() ?? '';

        const first =
            name.charAt(0);

        const second =
            apellido.charAt(0);

        return (
            `${first}${second}` ||
            name.substring(0, 2) ||
            'US'
        ).toUpperCase();
    };

    /*
    |--------------------------------------------------------------------------
    | Etiquetas
    |--------------------------------------------------------------------------
    */

    const getStatusLabel = (
        status: string,
    ): string => {
        const labels: Record<
            string,
            string
        > = {
            active: 'Activo',
            inactive: 'Inactivo',
            blocked: 'Bloqueado',
        };

        return (
            labels[status] ??
            status
        );
    };

    const getPresenceLabel = (
        status: string,
    ): string => {
        const labels: Record<
            string,
            string
        > = {
            online: 'En línea',
            away: 'Ausente',
            offline: 'Desconectado',
        };

        return (
            labels[status] ??
            'Desconectado'
        );
    };

    const getPermissionLabel = (
        permission: string,
    ): string => {
        const action =
            permission.split('.').pop();

        const labels: Record<
            string,
            string
        > = {
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
        const labels: Record<
            string,
            string
        > = {
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
        user.permissions ?? []
    ).reduce(
        (
            groups: Record<
                string,
                NonNullable<User['permissions']>
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
        user.permissions?.length ?? 0;

    const roleCount =
        user.roles?.length ?? 0;

    /*
    |--------------------------------------------------------------------------
    | Eliminar usuario
    |--------------------------------------------------------------------------
    */

    const deleteUser = () => {
        if (!canDeleteUser) {
            return;
        }

        if (
            !confirm(
                `¿Está seguro de eliminar al usuario "${user.name} ${user.apellido ?? ''}"?`,
            )
        ) {
            return;
        }

        router.delete(
            `/users/${user.id}`,
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Vista
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head
                title={`Usuario: ${user.name}`}
            />

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
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a usuarios
                        </Link>
                    </Button>

                    <div className="rounded-2xl border border-border/60 bg-card shadow-sm">

                        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

                            {/* =================================================
                                IDENTIDAD
                            ================================================= */}

                            <div className="flex min-w-0 items-start gap-4">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-lg font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">

                                    {user.imagen ? (
                                        <img
                                            src={user.imagen}
                                            alt={`${user.name} ${user.apellido ?? ''}`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getInitials()
                                    )}

                                </div>

                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h1 className="text-2xl font-semibold tracking-tight">
                                            {user.name}{' '}
                                            {user.apellido ?? ''}
                                        </h1>

                                        {isDeveloperAccount && (
                                            <Badge
                                                variant="outline"
                                                className="gap-1.5 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400"
                                            >
                                                <LockKeyhole className="h-3 w-3" />
                                                Developer
                                            </Badge>
                                        )}

                                    </div>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {user.cargo ||
                                            'Usuario del sistema'}
                                    </p>

                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">

                                        <span className="inline-flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5" />
                                            {user.email}
                                        </span>

                                        {user.telefono && (
                                            <span>
                                                {user.telefono}
                                            </span>
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                ACCIONES
                            ================================================= */}

                            <div className="flex flex-wrap gap-2">

                                {canEditUser && (
                                    <Button
                                        variant="outline"
                                        asChild
                                    >
                                        <Link
                                            href={`/users/${user.id}/edit`}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar usuario
                                        </Link>
                                    </Button>
                                )}

                                {canDeleteUser && (
                                    <Button
                                        variant="destructive"
                                        onClick={deleteUser}
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

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    {/* Estado */}

                    <Card className="border-border/60 shadow-sm">

                        <CardContent className="p-5">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-muted-foreground">
                                        Estado
                                    </p>

                                    <p className="mt-2 text-xl font-semibold tracking-tight">
                                        {getStatusLabel(
                                            userStatus,
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Estado de la cuenta
                                    </p>

                                </div>

                                <div
                                    className={
                                        `flex h-10 w-10 items-center justify-center rounded-xl ${
                                            isActive
                                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                                                : isBlocked
                                                    ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                        }`
                                    }
                                >
                                    <UserRound className="h-5 w-5" />
                                </div>

                            </div>

                        </CardContent>

                    </Card>

                    {/* Presencia */}

                    <Card className="border-border/60 shadow-sm">

                        <CardContent className="p-5">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-muted-foreground">
                                        Presencia
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">

                                        <span className="relative flex h-3 w-3">

                                            {isOnline && (
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                                            )}

                                            <span
                                                className={
                                                    `relative inline-flex h-3 w-3 rounded-full ${
                                                        isOnline
                                                            ? 'bg-emerald-500'
                                                            : isAway
                                                                ? 'bg-amber-500'
                                                                : 'bg-slate-400'
                                                    }`
                                                }
                                            />

                                        </span>

                                        <span className="text-lg font-semibold">
                                            {getPresenceLabel(
                                                presenceStatus,
                                            )}
                                        </span>

                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Actividad de la cuenta
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <Activity className="h-5 w-5" />
                                </div>

                            </div>

                        </CardContent>

                    </Card>

                    {/* Roles */}

                    <Card className="border-border/60 shadow-sm">

                        <CardContent className="p-5">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-muted-foreground">
                                        Roles
                                    </p>

                                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                                        {roleCount}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        roles asignados
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                            </div>

                        </CardContent>

                    </Card>

                    {/* Permisos */}

                    <Card className="border-border/60 shadow-sm">

                        <CardContent className="p-5">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-muted-foreground">
                                        Permisos directos
                                    </p>

                                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                                        {permissionCount}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        permisos asignados directamente
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <KeyRound className="h-5 w-5" />
                                </div>

                            </div>

                        </CardContent>

                    </Card>

                </div>

                {/* =========================================================
                    INFORMACIÓN DE SEGURIDAD
                ========================================================= */}

                {isDeveloperAccount && (
                    <Card className="overflow-hidden border-border/60 shadow-sm">

                        <div className="border-l-4 border-l-amber-500">

                            <CardContent className="p-5">

                                <div className="flex items-start gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                                        <LockKeyhole className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="font-semibold">
                                            Cuenta principal protegida
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            Esta es la cuenta principal
                                            Developer del sistema. Por
                                            seguridad, no puede ser editada
                                            ni eliminada desde la gestión
                                            de usuarios.
                                        </p>

                                    </div>

                                </div>

                            </CardContent>

                        </div>

                    </Card>
                )}

                {/* =========================================================
                    INFORMACIÓN GENERAL
                ========================================================= */}

                <Card className="border-border/60 shadow-sm">

                    <CardHeader className="border-b border-border/60">

                        <CardTitle className="text-base">
                            Información del usuario
                        </CardTitle>

                    </CardHeader>

                    <CardContent className="p-6">

                        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Nombre completo
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {user.name}{' '}
                                    {user.apellido ?? ''}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Correo electrónico
                                </p>

                                <p className="mt-1 break-all text-sm font-medium">
                                    {user.email}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Teléfono
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {user.telefono ||
                                        'No registrado'}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Cargo
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {user.cargo ||
                                        'No registrado'}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Secretaría
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {user.secretaria ||
                                        'No registrada'}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Área
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {user.area?.nombre_area ||
                                        'Sin área asignada'}
                                </p>

                            </div>

                        </div>

                    </CardContent>

                </Card>

                {/* =========================================================
                    ROLES
                ========================================================= */}

                <Card className="border-border/60 shadow-sm">

                    <CardHeader className="border-b border-border/60">

                        <div className="flex flex-col gap-1">

                            <CardTitle className="text-base">
                                Roles asignados
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Roles que determinan el acceso del usuario
                                al sistema.
                            </p>

                        </div>

                    </CardHeader>

                    <CardContent className="p-6">

                        {roleCount === 0 ? (

                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 py-10 text-center">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                                    <UsersRound className="h-6 w-6" />
                                </div>

                                <h3 className="mt-4 font-medium">
                                    Sin roles asignados
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Este usuario actualmente no tiene
                                    ningún rol asignado.
                                </p>

                            </div>

                        ) : (

                            <div className="flex flex-wrap gap-3">

                                {user.roles?.map(
                                    (role) => (
                                        <div
                                            key={role.id}
                                            className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                                        >

                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium">
                                                    {role.name}
                                                </p>

                                                {role.name ===
                                                    'Developer' && (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                                        Rol protegido
                                                    </p>
                                                )}
                                            </div>

                                        </div>
                                    ),
                                )}

                            </div>

                        )}

                    </CardContent>

                </Card>

                {/* =========================================================
                    PERMISOS DIRECTOS
                ========================================================= */}

                <Card className="border-border/60 shadow-sm">

                    <CardHeader className="border-b border-border/60">

                        <div className="flex flex-col gap-1">

                            <CardTitle className="text-base">
                                Permisos directos
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Permisos asignados directamente al usuario,
                                independientes de sus roles.
                            </p>

                        </div>

                    </CardHeader>

                    <CardContent className="p-6">

                        {sortedModules.length === 0 ? (

                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 py-12 text-center">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                                    <KeyRound className="h-6 w-6" />
                                </div>

                                <h3 className="mt-4 font-medium">
                                    Sin permisos directos
                                </h3>

                                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                    El usuario no tiene permisos asignados
                                    directamente. Los permisos pueden
                                    provenir de sus roles.
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

                                                <div className="flex items-center justify-between gap-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background text-sm font-semibold shadow-sm">
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
                    ACTIVIDAD / PRESENCIA
                ========================================================= */}

                <Card className="border-border/60 shadow-sm">

                    <CardHeader className="border-b border-border/60">

                        <CardTitle className="text-base">
                            Actividad y acceso
                        </CardTitle>

                    </CardHeader>

                    <CardContent className="p-6">

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            <div className="flex items-start gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <Clock3 className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Última actividad
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {presence?.last_activity ||
                                            user.last_activity ||
                                            'Sin información'}
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-start gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <Activity className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Dirección IP
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {presence?.ip_address ||
                                            user.ip_address ||
                                            'Sin información'}
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-start gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <UserRound className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Presencia
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {getPresenceLabel(
                                            presenceStatus,
                                        )}
                                    </p>
                                </div>

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
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a usuarios
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-3 sm:flex-row">

                        {canDeleteUser && (
                            <Button
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={deleteUser}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar usuario
                            </Button>
                        )}

                        {canEditUser && (
                            <Button asChild>
                                <Link
                                    href={`/users/${user.id}/edit`}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar usuario
                                </Link>
                            </Button>
                        )}

                    </div>

                </div>

            </div>
        </>
    );
}
