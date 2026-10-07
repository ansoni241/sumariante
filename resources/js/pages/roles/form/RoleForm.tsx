// import { useEffect, useMemo, useState } from 'react';
// import type { FormEvent } from 'react';

// import {
//     Check,
//     ChevronDown,
//     ChevronRight,
//     X,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';

// import type {
//     RolePermission,
//     RoleFormData,
//     RoleFormProps,
// } from '@/types';

// export function RoleForm({
//     permissions,
//     role,
//     mode,
//     errors = {},
//     processing = false,

//     lockName = false,
//     lockPermissions = false,

//     onSubmit,
//     onCancel,
// }: RoleFormProps) {
//     /**
//      * Estado del formulario.
//      */
//     const [form, setForm] = useState<RoleFormData>({
//         name: '',
//         permissions: [],
//     });

//     /**
//      * Estado de los módulos abiertos/cerrados.
//      */
//     const [openModules, setOpenModules] = useState<
//         Record<string, boolean>
//     >({});

//     /**
//      * Cargar los datos del rol cuando estamos editando.
//      */
//     useEffect(() => {
//         if (mode === 'edit' && role) {
//             setForm({
//                 name: role.name ?? '',
//                 permissions:
//                     role.permissions?.map(
//                         (permission) => permission.id,
//                     ) ?? [],
//             });

//             return;
//         }

//         /**
//          * Si estamos creando,
//          * dejamos el formulario vacío.
//          */
//         setForm({
//             name: '',
//             permissions: [],
//         });
//     }, [role, mode]);

//     /**
//      * Agrupar permisos por módulo.
//      *
//      * Ejemplo:
//      *
//      * users.view
//      * users.create
//      * users.edit
//      *
//      * =>
//      *
//      * Usuarios
//      * ├── Ver
//      * ├── Crear
//      * └── Editar
//      */
//     const groupedPermissions = useMemo(() => {
//         const groups: Record<string, RolePermission[]> = {};

//         permissions.forEach((permission) => {
//             const [module] = permission.name.split('.');

//             if (!groups[module]) {
//                 groups[module] = [];
//             }

//             groups[module].push(permission);
//         });

//         return groups;
//     }, [permissions]);

//     /**
//      * Ordenar módulos alfabéticamente.
//      */
//     const sortedModules = useMemo(() => {
//         return Object.keys(groupedPermissions).sort((a, b) =>
//             a.localeCompare(b),
//         );
//     }, [groupedPermissions]);

//     /**
//      * Nombre legible del módulo.
//      */
//     const getModuleLabel = (module: string): string => {
//         const labels: Record<string, string> = {
//             users: 'Usuarios',
//             roles: 'Roles',
//             permissions: 'Permisos',
//             dashboard: 'Dashboard',
//             reports: 'Reportes',
//             settings: 'Configuración',
//             profile: 'Perfil',
//         };

//         return (
//             labels[module] ??
//             module.charAt(0).toUpperCase() +
//             module.slice(1)
//         );
//     };

//     /**
//      * Nombre legible de la acción.
//      */
//     const getPermissionLabel = (
//         permission: string,
//     ): string => {
//         const action = permission.split('.').pop();

//         const labels: Record<string, string> = {
//             view: 'Ver',
//             create: 'Crear',
//             edit: 'Editar',
//             update: 'Actualizar',
//             delete: 'Eliminar',
//             status: 'Cambiar estado',
//             manage: 'Administrar',
//             show: 'Ver detalle',
//             index: 'Listar',
//         };

//         return (
//             labels[action ?? ''] ??
//             action ??
//             permission
//         );
//     };

//     /**
//      * Actualizar nombre del rol.
//      */
//     const updateName = (value: string) => {
//         setForm((current) => ({
//             ...current,
//             name: value,
//         }));
//     };

//     /**
//      * Comprobar si un permiso está seleccionado.
//      */
//     const hasPermission = (
//         permissionId: number,
//     ): boolean => {
//         return form.permissions.includes(permissionId);
//     };

//     /**
//      * Activar/desactivar un permiso individual.
//      */
//     const togglePermission = (
//         permissionId: number,
//     ) => {

//         if (processing || lockPermissions) {
//             return;
//         }

//         setForm((current) => {
//             const exists =
//                 current.permissions.includes(
//                     permissionId,
//                 );

//             if (exists) {
//                 return {
//                     ...current,
//                     permissions:
//                         current.permissions.filter(
//                             (id) =>
//                                 id !== permissionId,
//                         ),
//                 };
//             }

//             return {
//                 ...current,
//                 permissions: [
//                     ...current.permissions,
//                     permissionId,
//                 ],
//             };
//         });
//     };

//     /**
//      * Obtener los IDs de permisos de un módulo.
//      */
//     const getModulePermissionIds = (
//         module: string,
//     ): number[] => {
//         return (
//             groupedPermissions[module]?.map(
//                 (permission) => permission.id,
//             ) ?? []
//         );
//     };

//     /**
//      * Comprobar si todos los permisos de un módulo
//      * están seleccionados.
//      */
//     const isModuleFullySelected = (
//         module: string,
//     ): boolean => {
//         const ids =
//             getModulePermissionIds(module);

//         return (
//             ids.length > 0 &&
//             ids.every((id) =>
//                 form.permissions.includes(id),
//             )
//         );
//     };

//     /**
//      * Comprobar si el módulo está parcialmente seleccionado.
//      */
//     const isModulePartiallySelected = (
//         module: string,
//     ): boolean => {
//         const ids =
//             getModulePermissionIds(module);

//         const selected = ids.filter((id) =>
//             form.permissions.includes(id),
//         ).length;

//         return (
//             selected > 0 &&
//             selected < ids.length
//         );
//     };

//     /**
//      * Seleccionar/deseleccionar todos los permisos
//      * de un módulo.
//      */
//     const toggleModule = (module: string) => {

//         if (processing || lockPermissions) {
//             return;
//         }

//         const ids =
//             getModulePermissionIds(module);

//         setForm((current) => {
//             const allSelected =
//                 ids.length > 0 &&
//                 ids.every((id) =>
//                     current.permissions.includes(
//                         id,
//                     ),
//                 );

//             /**
//              * Si todos están seleccionados,
//              * los quitamos.
//              */
//             if (allSelected) {
//                 return {
//                     ...current,
//                     permissions:
//                         current.permissions.filter(
//                             (id) =>
//                                 !ids.includes(id),
//                         ),
//                 };
//             }

//             /**
//              * Si no están todos seleccionados,
//              * agregamos los que falten.
//              */
//             const newPermissions = [
//                 ...current.permissions,
//             ];

//             ids.forEach((id) => {
//                 if (
//                     !newPermissions.includes(id)
//                 ) {
//                     newPermissions.push(id);
//                 }
//             });

//             return {
//                 ...current,
//                 permissions: newPermissions,
//             };
//         });
//     };

//     /**
//      * Abrir/cerrar módulo.
//      */
//     const toggleModuleOpen = (
//         module: string,
//     ) => {
//         if (processing) {
//             return;
//         }

//         setOpenModules((current) => ({
//             ...current,
//             [module]:
//                 !current[module],
//         }));
//     };

//     /**
//      * Seleccionar todos los permisos.
//      */
//     const selectAll = () => {
//         if (
//             processing ||
//             permissions.length === 0
//         ) {
//             return;
//         }

//         setForm((current) => ({
//             ...current,
//             permissions:
//                 permissions.map(
//                     (permission) =>
//                         permission.id,
//                 ),
//         }));
//     };

//     /**
//      * Quitar todos los permisos.
//      */
//     const clearAll = () => {
//         if (processing) {
//             return;
//         }

//         setForm((current) => ({
//             ...current,
//             permissions: [],
//         }));
//     };

//     /**
//      * Enviar formulario.
//      */
//     const handleSubmit = (
//         event: FormEvent<HTMLFormElement>,
//     ) => {
//         event.preventDefault();

//         /**
//          * Evitar doble envío.
//          */
//         if (processing) {
//             return;
//         }

//         onSubmit(form);
//     };

//     const isEdit = mode === 'edit';

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="space-y-6"
//         >
//             {/* =====================================================
//                 INFORMACIÓN DEL ROL
//             ====================================================== */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>
//                         Información del rol
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="name">
//                             Nombre del rol
//                         </Label>

//                         <Input
//                             id="name"
//                             name="name"
//                             value={form.name}
//                             onChange={(event) =>
//                                 updateName(
//                                     event.target.value,
//                                 )
//                             }

//                             placeholder={
//                                 lockName
//                                     ? 'Nombre protegido'
//                                     : 'Ej. Administrador'
//                             }

//                             disabled={
//                                 processing ||
//                                 lockName
//                             }
//                             autoComplete="off"
//                         />

//                         {errors.name && (
//                             <p className="text-sm text-destructive">
//                                 {errors.name}
//                             </p>
//                         )}
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* =====================================================
//                 PERMISOS
//             ====================================================== */}
//             <Card>
//                 <CardHeader>
//                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                         <div>
//                             <CardTitle>
//                                 Permisos
//                             </CardTitle>

//                             <p className="mt-1 text-sm text-muted-foreground">
//                                 Selecciona los permisos
//                                 que tendrá este rol.
//                             </p>
//                         </div>

//                         <div className="flex flex-wrap gap-2">
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={selectAll}

//                                 disabled={
//                                     processing ||
//                                     lockPermissions ||
//                                     permissions.length === 0
//                                 }
//                             >
//                                 Seleccionar todos
//                             </Button>

//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={clearAll}
//                                 disabled={
//                                     processing ||
//                                     lockPermissions ||
//                                     form.permissions.length ===
//                                     0
//                                 }
//                             >
//                                 Quitar todos
//                             </Button>
//                         </div>
//                     </div>
//                 </CardHeader>

//                 <CardContent className="space-y-3">
//                     {/* Error general de permisos */}
//                     {errors.permissions && (
//                         <p className="text-sm text-destructive">
//                             {errors.permissions}
//                         </p>
//                     )}

//                     {/* Sin permisos */}
//                     {permissions.length === 0 ? (
//                         <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
//                             No existen permisos
//                             disponibles.
//                         </div>
//                     ) : (
//                         <div className="space-y-3">
//                             {sortedModules.map(
//                                 (module) => {
//                                     const modulePermissions =
//                                         groupedPermissions[
//                                         module
//                                         ] ?? [];

//                                     const isOpen =
//                                         openModules[
//                                         module
//                                         ] ?? true;

//                                     const fullySelected =
//                                         isModuleFullySelected(
//                                             module,
//                                         );

//                                     const partiallySelected =
//                                         isModulePartiallySelected(
//                                             module,
//                                         );

//                                     return (
//                                         <div
//                                             key={module}
//                                             className="overflow-hidden rounded-lg border"
//                                         >
//                                             {/* =================================================
//                                                 CABECERA DEL MÓDULO
//                                             ================================================== */}
//                                             <div className="flex items-center justify-between bg-muted/30 px-4 py-3">
//                                                 <div className="flex items-center gap-2">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>
//                                                             toggleModuleOpen(
//                                                                 module,
//                                                             )
//                                                         }
//                                                         disabled={
//                                                             processing
//                                                         }
//                                                         className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
//                                                         aria-label={
//                                                             isOpen
//                                                                 ? 'Contraer módulo'
//                                                                 : 'Expandir módulo'
//                                                         }
//                                                     >
//                                                         {isOpen ? (
//                                                             <ChevronDown className="h-4 w-4" />
//                                                         ) : (
//                                                             <ChevronRight className="h-4 w-4" />
//                                                         )}
//                                                     </button>

//                                                     <div>
//                                                         <div className="font-medium">
//                                                             {getModuleLabel(
//                                                                 module,
//                                                             )}
//                                                         </div>

//                                                         <div className="text-xs text-muted-foreground">
//                                                             {
//                                                                 modulePermissions.length
//                                                             }{' '}
//                                                             {modulePermissions.length ===
//                                                                 1
//                                                                 ? 'permiso'
//                                                                 : 'permisos'}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* =================================================
//                                                     CHECKBOX DEL MÓDULO
//                                                 ================================================== */}
//                                                 <button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         toggleModule(
//                                                             module,
//                                                         )
//                                                     }

//                                                     disabled={
//                                                         processing ||
//                                                         lockPermissions
//                                                     }
//                                                     className={`flex h-5 w-5 items-center justify-center rounded border transition disabled:cursor-not-allowed disabled:opacity-50 ${fullySelected
//                                                         ? 'border-primary bg-primary text-primary-foreground'
//                                                         : partiallySelected
//                                                             ? 'border-primary bg-primary/20'
//                                                             : 'border-input bg-background'
//                                                         }`}
//                                                     aria-label={`Seleccionar permisos de ${getModuleLabel(module)}`}
//                                                 >
//                                                     {fullySelected && (
//                                                         <Check className="h-3.5 w-3.5" />
//                                                     )}

//                                                     {partiallySelected &&
//                                                         !fullySelected && (
//                                                             <span className="h-2 w-2 rounded-sm bg-primary" />
//                                                         )}
//                                                 </button>
//                                             </div>

//                                             {/* =================================================
//                                                 PERMISOS DEL MÓDULO
//                                             ================================================== */}
//                                             {isOpen && (
//                                                 <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
//                                                     {modulePermissions.map(
//                                                         (
//                                                             permission,
//                                                         ) => {
//                                                             const selected =
//                                                                 hasPermission(
//                                                                     permission.id,
//                                                                 );

//                                                             return (
//                                                                 <button
//                                                                     key={
//                                                                         permission.id
//                                                                     }
//                                                                     type="button"
//                                                                     onClick={() =>
//                                                                         togglePermission(
//                                                                             permission.id,
//                                                                         )
//                                                                     }
//                                                                     disabled={
//                                                                         processing ||
//                                                                         lockPermissions
//                                                                     }
//                                                                     className={`flex items-center gap-3 rounded-md border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${selected
//                                                                         ? 'border-primary bg-primary/5'
//                                                                         : 'border-border hover:bg-muted/50'
//                                                                         }`}
//                                                                 >
//                                                                     {/* Checkbox visual */}
//                                                                     <span
//                                                                         className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selected
//                                                                             ? 'border-primary bg-primary text-primary-foreground'
//                                                                             : 'border-input bg-background'
//                                                                             }`}
//                                                                     >
//                                                                         {selected ? (
//                                                                             <Check className="h-3.5 w-3.5" />
//                                                                         ) : (
//                                                                             <X className="h-3.5 w-3.5 text-muted-foreground opacity-0" />
//                                                                         )}
//                                                                     </span>

//                                                                     <div className="min-w-0">
//                                                                         <div className="font-medium">
//                                                                             {getPermissionLabel(
//                                                                                 permission.name,
//                                                                             )}
//                                                                         </div>

//                                                                         <div className="truncate text-xs text-muted-foreground">
//                                                                             {
//                                                                                 permission.name
//                                                                             }
//                                                                         </div>
//                                                                     </div>
//                                                                 </button>
//                                                             );
//                                                         },
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 },
//                             )}
//                         </div>
//                     )}

//                     {/* Error de permissions.* */}
//                     {errors['permissions.0'] && (
//                         <p className="text-sm text-destructive">
//                             {
//                                 errors[
//                                 'permissions.0'
//                                 ]
//                             }
//                         </p>
//                     )}

//                     {/* Resumen */}
//                     <div className="rounded-md bg-muted/40 px-4 py-3 text-sm">
//                         <span className="font-medium">
//                             {
//                                 form.permissions
//                                     .length
//                             }
//                         </span>{' '}
//                         de{' '}
//                         <span className="font-medium">
//                             {permissions.length}
//                         </span>{' '}
//                         permisos seleccionados
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* =====================================================
//                 ACCIONES
//             ====================================================== */}
//             <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={onCancel}
//                     disabled={processing}
//                 >
//                     Cancelar
//                 </Button>

//                 <Button
//                     type="submit"
//                     disabled={
//                         processing ||
//                         !form.name.trim()
//                     }
//                 >
//                     {processing
//                         ? 'Guardando...'
//                         : isEdit
//                             ? 'Actualizar rol'
//                             : 'Crear rol'}
//                 </Button>
//             </div>
//         </form>
//     );
// }
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import {
    Check,
    ChevronDown,
    ChevronRight,
    LockKeyhole,
    ShieldCheck,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import type {
    RolePermission,
    RoleFormData,
    RoleFormProps,
} from '@/types';

export function RoleForm({
    permissions,
    role,
    mode,
    errors = {},
    processing = false,
    lockName = false,
    lockPermissions = false,
    onSubmit,
    onCancel,
}: RoleFormProps) {
    const [form, setForm] = useState<RoleFormData>({
        name: '',
        permissions: [],
    });

    const [openModules, setOpenModules] = useState<
        Record<string, boolean>
    >({});

    /*
    |--------------------------------------------------------------------------
    | Cargar formulario
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (mode === 'edit' && role) {
            setForm({
                name: role.name ?? '',
                permissions:
                    role.permissions?.map(
                        (permission) => permission.id,
                    ) ?? [],
            });

            return;
        }

        setForm({
            name: '',
            permissions: [],
        });
    }, [role, mode]);

    /*
    |--------------------------------------------------------------------------
    | Agrupar permisos
    |--------------------------------------------------------------------------
    */

    const groupedPermissions = useMemo(() => {
        const groups: Record<string, RolePermission[]> = {};

        permissions.forEach((permission) => {
            const [module] = permission.name.split('.');

            if (!groups[module]) {
                groups[module] = [];
            }

            groups[module].push(permission);
        });

        return groups;
    }, [permissions]);

    const sortedModules = useMemo(() => {
        return Object.keys(groupedPermissions).sort((a, b) =>
            a.localeCompare(b),
        );
    }, [groupedPermissions]);

    /*
    |--------------------------------------------------------------------------
    | Etiquetas
    |--------------------------------------------------------------------------
    */

    const getModuleLabel = (module: string): string => {
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

    /*
    |--------------------------------------------------------------------------
    | Nombre
    |--------------------------------------------------------------------------
    */

    const updateName = (value: string) => {
        setForm((current) => ({
            ...current,
            name: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Permisos individuales
    |--------------------------------------------------------------------------
    */

    const hasPermission = (
        permissionId: number,
    ): boolean => {
        return form.permissions.includes(permissionId);
    };

    const togglePermission = (
        permissionId: number,
    ) => {
        if (processing || lockPermissions) {
            return;
        }

        setForm((current) => {
            const exists =
                current.permissions.includes(permissionId);

            if (exists) {
                return {
                    ...current,
                    permissions:
                        current.permissions.filter(
                            (id) =>
                                id !== permissionId,
                        ),
                };
            }

            return {
                ...current,
                permissions: [
                    ...current.permissions,
                    permissionId,
                ],
            };
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Permisos por módulo
    |--------------------------------------------------------------------------
    */

    const getModulePermissionIds = (
        module: string,
    ): number[] => {
        return (
            groupedPermissions[module]?.map(
                (permission) => permission.id,
            ) ?? []
        );
    };

    const isModuleFullySelected = (
        module: string,
    ): boolean => {
        const ids =
            getModulePermissionIds(module);

        return (
            ids.length > 0 &&
            ids.every((id) =>
                form.permissions.includes(id),
            )
        );
    };

    const isModulePartiallySelected = (
        module: string,
    ): boolean => {
        const ids =
            getModulePermissionIds(module);

        const selected = ids.filter((id) =>
            form.permissions.includes(id),
        ).length;

        return (
            selected > 0 &&
            selected < ids.length
        );
    };

    const toggleModule = (module: string) => {
        if (processing || lockPermissions) {
            return;
        }

        const ids =
            getModulePermissionIds(module);

        setForm((current) => {
            const allSelected =
                ids.length > 0 &&
                ids.every((id) =>
                    current.permissions.includes(id),
                );

            if (allSelected) {
                return {
                    ...current,
                    permissions:
                        current.permissions.filter(
                            (id) =>
                                !ids.includes(id),
                        ),
                };
            }

            const newPermissions = [
                ...current.permissions,
            ];

            ids.forEach((id) => {
                if (!newPermissions.includes(id)) {
                    newPermissions.push(id);
                }
            });

            return {
                ...current,
                permissions: newPermissions,
            };
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Módulos abiertos
    |--------------------------------------------------------------------------
    */

    const toggleModuleOpen = (
        module: string,
    ) => {
        if (processing) {
            return;
        }

        setOpenModules((current) => ({
            ...current,
            [module]:
                !current[module],
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Todos los permisos
    |--------------------------------------------------------------------------
    */

    const selectAll = () => {
        if (
            processing ||
            lockPermissions ||
            permissions.length === 0
        ) {
            return;
        }

        setForm((current) => ({
            ...current,
            permissions:
                permissions.map(
                    (permission) =>
                        permission.id,
                ),
        }));
    };

    const clearAll = () => {
        if (processing || lockPermissions) {
            return;
        }

        setForm((current) => ({
            ...current,
            permissions: [],
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Enviar
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (processing) {
            return;
        }

        onSubmit(form);
    };

    const isEdit = mode === 'edit';

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* =====================================================
                INFORMACIÓN DEL ROL
            ====================================================== */}
            <Card className="border-slate-200/80 dark:border-slate-800">
                <CardHeader className="border-b border-border/60">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <ShieldCheck className="h-4 w-4" />
                        </div>

                        <div>
                            <CardTitle className="text-base">
                                Información del rol
                            </CardTitle>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Define el nombre que identificará
                                este rol dentro del sistema.
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="max-w-xl space-y-2">
                        <Label htmlFor="name">
                            Nombre del rol
                        </Label>

                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={(event) =>
                                updateName(
                                    event.target.value,
                                )
                            }
                            placeholder={
                                lockName
                                    ? 'Nombre protegido'
                                    : 'Ej. Administrador'
                            }
                            disabled={
                                processing ||
                                lockName
                            }
                            autoComplete="off"
                        />

                        {lockName && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <LockKeyhole className="h-3.5 w-3.5" />
                                El nombre de este rol está protegido.
                            </div>
                        )}

                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* =====================================================
                PERMISOS
            ====================================================== */}
            <Card className="border-slate-200/80 dark:border-slate-800">
                <CardHeader className="border-b border-border/60">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <LockKeyhole className="h-4 w-4" />
                            </div>

                            <div>
                                <CardTitle className="text-base">
                                    Permisos de acceso
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Selecciona los módulos y acciones
                                    disponibles para este rol.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={selectAll}
                                disabled={
                                    processing ||
                                    lockPermissions ||
                                    permissions.length === 0
                                }
                            >
                                Seleccionar todos
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={clearAll}
                                disabled={
                                    processing ||
                                    lockPermissions ||
                                    form.permissions.length === 0
                                }
                            >
                                Quitar todos
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 p-6">
                    {lockPermissions && (
                        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                            <div>
                                <p className="text-sm font-medium">
                                    Permisos protegidos
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Los permisos de este rol no pueden
                                    modificarse desde la cuenta actual.
                                </p>
                            </div>
                        </div>
                    )}

                    {errors.permissions && (
                        <p className="text-sm text-destructive">
                            {errors.permissions}
                        </p>
                    )}

                    {permissions.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-10 text-center">
                            <LockKeyhole className="mx-auto h-8 w-8 text-muted-foreground/60" />

                            <p className="mt-3 text-sm font-medium">
                                No existen permisos disponibles
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                No hay permisos configurados para
                                asignar a este rol.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sortedModules.map((module) => {
                                const modulePermissions =
                                    groupedPermissions[module] ?? [];

                                const isOpen =
                                    openModules[module] ?? true;

                                const fullySelected =
                                    isModuleFullySelected(module);

                                const partiallySelected =
                                    isModulePartiallySelected(module);

                                return (
                                    <div
                                        key={module}
                                        className="overflow-hidden rounded-xl border border-border/70"
                                    >
                                        {/* Módulo */}
                                        <div className="flex items-center justify-between bg-muted/30 px-4 py-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleModuleOpen(
                                                            module,
                                                        )
                                                    }
                                                    disabled={processing}
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label={
                                                        isOpen
                                                            ? 'Contraer módulo'
                                                            : 'Expandir módulo'
                                                    }
                                                >
                                                    {isOpen ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                </button>

                                                <div className="min-w-0">
                                                    <div className="font-medium">
                                                        {getModuleLabel(
                                                            module,
                                                        )}
                                                    </div>

                                                    <div className="text-xs text-muted-foreground">
                                                        {
                                                            modulePermissions.length
                                                        }{' '}
                                                        {modulePermissions.length ===
                                                        1
                                                            ? 'permiso'
                                                            : 'permisos'}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleModule(
                                                        module,
                                                    )
                                                }
                                                disabled={
                                                    processing ||
                                                    lockPermissions
                                                }
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    fullySelected
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : partiallySelected
                                                            ? 'border-primary bg-primary/15'
                                                            : 'border-input bg-background'
                                                }`}
                                                aria-label={`Seleccionar permisos de ${getModuleLabel(module)}`}
                                            >
                                                {fullySelected && (
                                                    <Check className="h-3.5 w-3.5" />
                                                )}

                                                {partiallySelected &&
                                                    !fullySelected && (
                                                        <span className="h-2 w-2 rounded-sm bg-primary" />
                                                    )}
                                            </button>
                                        </div>

                                        {/* Permisos */}
                                        {isOpen && (
                                            <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {modulePermissions.map(
                                                    (permission) => {
                                                        const selected =
                                                            hasPermission(
                                                                permission.id,
                                                            );

                                                        return (
                                                            <button
                                                                key={
                                                                    permission.id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    togglePermission(
                                                                        permission.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing ||
                                                                    lockPermissions
                                                                }
                                                                className={`flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left transition ${
                                                                    selected
                                                                        ? 'border-primary/40 bg-primary/5'
                                                                        : 'border-border hover:bg-muted/50'
                                                                } disabled:cursor-not-allowed disabled:opacity-60`}
                                                            >
                                                                <span
                                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                                                        selected
                                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                                            : 'border-input bg-background'
                                                                    }`}
                                                                >
                                                                    {selected ? (
                                                                        <Check className="h-3.5 w-3.5" />
                                                                    ) : (
                                                                        <X className="h-3.5 w-3.5 text-muted-foreground opacity-0" />
                                                                    )}
                                                                </span>

                                                                <div className="min-w-0">
                                                                    <div className="font-medium">
                                                                        {getPermissionLabel(
                                                                            permission.name,
                                                                        )}
                                                                    </div>

                                                                    <div className="truncate text-xs text-muted-foreground">
                                                                        {
                                                                            permission.name
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {errors['permissions.0'] && (
                        <p className="text-sm text-destructive">
                            {errors['permissions.0']}
                        </p>
                    )}

                    {/* Resumen */}
                    <div className="flex flex-col gap-2 rounded-lg bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm text-muted-foreground">
                            Permisos seleccionados
                        </span>

                        <span className="text-sm font-semibold">
                            {form.permissions.length}
                            <span className="font-normal text-muted-foreground">
                                {' '}
                                de {permissions.length}
                            </span>
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* =====================================================
                ACCIONES
            ====================================================== */}
            <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={processing}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    disabled={
                        processing ||
                        !form.name.trim()
                    }
                >
                    {processing
                        ? 'Guardando...'
                        : isEdit
                            ? 'Actualizar rol'
                            : 'Crear rol'}
                </Button>
            </div>
        </form>
    );
}
