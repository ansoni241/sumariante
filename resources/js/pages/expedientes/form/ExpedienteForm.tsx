// import { FormEvent, useEffect, useState } from 'react';
// import { router, useForm } from '@inertiajs/react';
// import {
//     CalendarDays,
//     FileText,
//     FolderOpen,
//     Upload,
//     X,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

// type Expediente = {
//     id?: number;
//     numero_expediente?: string | null;
//     titulo?: string | null;
//     tipo_proceso?: string | null;
//     gestion?: string | number | null;
//     fecha_inicio?: string | null;
//     fecha_cierre?: string | null;
//     estado?: string | null;
//     descripcion?: string | null;
//     observaciones?: string | null;
// };

// type ExpedienteFormData = {
//     numero_expediente: string;
//     titulo: string;
//     tipo_proceso: string;
//     gestion: string;
//     fecha_inicio: string;
//     fecha_cierre: string;
//     estado: string;
//     descripcion: string;
//     observaciones: string;

//     documento: File | null;
//     documento_tipo: string;
//     documento_titulo: string;
//     documento_descripcion: string;
//     documento_fecha: string;
//     documento_observaciones: string;
// };

// type Props = {
//     expediente?: Expediente;
// };

// const estados = [
//     {
//         value: 'abierto',
//         label: 'Abierto',
//     },
//     {
//         value: 'en_proceso',
//         label: 'En proceso',
//     },
//     {
//         value: 'concluido',
//         label: 'Concluido',
//     },
//     {
//         value: 'archivado',
//         label: 'Archivado',
//     },
// ];

// export default function ExpedienteForm({
//     expediente,
// }: Props) {
//     const isEditing = Boolean(expediente?.id);

//     const [selectedFile, setSelectedFile] = useState<File | null>(
//         null,
//     );

//     const form = useForm<ExpedienteFormData>({
//         numero_expediente:
//             expediente?.numero_expediente ?? '',

//         titulo:
//             expediente?.titulo ?? '',

//         tipo_proceso:
//             expediente?.tipo_proceso ?? '',

//         gestion:
//             expediente?.gestion?.toString() ?? '',

//         fecha_inicio:
//             expediente?.fecha_inicio ?? '',

//         fecha_cierre:
//             expediente?.fecha_cierre ?? '',

//         estado:
//             expediente?.estado ?? 'abierto',

//         descripcion:
//             expediente?.descripcion ?? '',

//         observaciones:
//             expediente?.observaciones ?? '',

//         documento: null,
//         documento_tipo: '',
//         documento_titulo: '',
//         documento_descripcion: '',
//         documento_fecha: '',
//         documento_observaciones: '',
//     });

//     useEffect(() => {
//         if (!expediente) {
//             return;
//         }

//         form.setData({
//             numero_expediente:
//                 expediente.numero_expediente ?? '',

//             titulo:
//                 expediente.titulo ?? '',

//             tipo_proceso:
//                 expediente.tipo_proceso ?? '',

//             gestion:
//                 expediente.gestion?.toString() ?? '',

//             fecha_inicio:
//                 expediente.fecha_inicio ?? '',

//             fecha_cierre:
//                 expediente.fecha_cierre ?? '',

//             estado:
//                 expediente.estado ?? 'abierto',

//             descripcion:
//                 expediente.descripcion ?? '',

//             observaciones:
//                 expediente.observaciones ?? '',

//             documento: null,
//             documento_tipo: '',
//             documento_titulo: '',
//             documento_descripcion: '',
//             documento_fecha: '',
//             documento_observaciones: '',
//         });
//     }, [expediente]);

//     const handleFileChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//         const file = event.target.files?.[0] ?? null;

//         if (!file) {
//             setSelectedFile(null);
//             form.setData('documento', null);
//             return;
//         }

//         if (file.type !== 'application/pdf') {
//             form.setError(
//                 'documento',
//                 'El documento debe estar en formato PDF.',
//             );

//             event.target.value = '';
//             setSelectedFile(null);
//             form.setData('documento', null);

//             return;
//         }

//         if (file.size > 50 * 1024 * 1024) {
//             form.setError(
//                 'documento',
//                 'El documento no puede superar los 50 MB.',
//             );

//             event.target.value = '';
//             setSelectedFile(null);
//             form.setData('documento', null);

//             return;
//         }

//         form.clearErrors('documento');

//         setSelectedFile(file);
//         form.setData('documento', file);

//         /*
//         |--------------------------------------------------------------------------
//         | Completar automáticamente el título
//         |--------------------------------------------------------------------------
//         */

//         if (!form.data.documento_titulo) {
//             form.setData(
//                 'documento_titulo',
//                 file.name.replace(/\.pdf$/i, ''),
//             );
//         }
//     };

//     const removeFile = () => {
//         setSelectedFile(null);
//         form.setData('documento', null);
//         form.setData('documento_titulo', '');

//         const input = document.getElementById(
//             'documento',
//         ) as HTMLInputElement | null;

//         if (input) {
//             input.value = '';
//         }

//         form.clearErrors('documento');
//     };

//     const formatFileSize = (size: number): string => {
//         if (size < 1024) {
//             return `${size} B`;
//         }

//         if (size < 1024 * 1024) {
//             return `${(size / 1024).toFixed(1)} KB`;
//         }

//         return `${(size / (1024 * 1024)).toFixed(2)} MB`;
//     };

//     const handleSubmit = (
//         event: FormEvent<HTMLFormElement>,
//     ) => {
//         event.preventDefault();

//         if (form.processing) {
//             return;
//         }

//         if (isEditing && expediente?.id) {
//             form.put(
//                 `/expedientes/${expediente.id}`,
//                 {
//                     preserveScroll: true,
//                 },
//             );

//             return;
//         }

//         form.post('/expedientes', {
//             preserveScroll: true,
//             forceFormData: true,
//         });
//     };

//     const handleCancel = () => {
//         if (form.processing) {
//             return;
//         }

//         router.visit('/expedientes');
//     };

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="space-y-6"
//         >
//             {/* -----------------------------------------------------------
//                 INFORMACIÓN DEL EXPEDIENTE
//             ------------------------------------------------------------ */}

//             <Card className="border-slate-800 bg-slate-950/60">
//                 <CardHeader>
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
//                             <FolderOpen className="h-5 w-5 text-blue-400" />
//                         </div>

//                         <div>
//                             <CardTitle className="text-base text-slate-100">
//                                 Información del expediente
//                             </CardTitle>

//                             <p className="mt-1 text-sm text-slate-400">
//                                 Datos generales del proceso sumario.
//                             </p>
//                         </div>
//                     </div>
//                 </CardHeader>

//                 <CardContent className="space-y-6">
//                     <div className="grid gap-5 md:grid-cols-2">
//                         <div className="space-y-2">
//                             <Label htmlFor="numero_expediente">
//                                 Número de expediente
//                             </Label>

//                             <Input
//                                 id="numero_expediente"
//                                 value={form.data.numero_expediente}
//                                 onChange={(event) =>
//                                     form.setData(
//                                         'numero_expediente',
//                                         event.target.value,
//                                     )
//                                 }
//                                 placeholder="Ej. SUM-001/2026"
//                                 disabled={form.processing}
//                             />

//                             {form.errors.numero_expediente && (
//                                 <p className="text-sm text-red-400">
//                                     {form.errors.numero_expediente}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="gestion">
//                                 Gestión
//                             </Label>

//                             <Input
//                                 id="gestion"
//                                 value={form.data.gestion}
//                                 onChange={(event) =>
//                                     form.setData(
//                                         'gestion',
//                                         event.target.value,
//                                     )
//                                 }
//                                 placeholder="2026"
//                                 maxLength={4}
//                                 disabled={form.processing}
//                             />

//                             {form.errors.gestion && (
//                                 <p className="text-sm text-red-400">
//                                     {form.errors.gestion}
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="titulo">
//                             Título del expediente
//                         </Label>

//                         <Input
//                             id="titulo"
//                             value={form.data.titulo}
//                             onChange={(event) =>
//                                 form.setData(
//                                     'titulo',
//                                     event.target.value,
//                                 )
//                             }
//                             placeholder="Descripción breve del proceso sumario"
//                             disabled={form.processing}
//                         />

//                         {form.errors.titulo && (
//                             <p className="text-sm text-red-400">
//                                 {form.errors.titulo}
//                             </p>
//                         )}
//                     </div>

//                     <div className="grid gap-5 md:grid-cols-3">
//                         <div className="space-y-2">
//                             <Label htmlFor="tipo_proceso">
//                                 Tipo de proceso
//                             </Label>

//                             <Input
//                                 id="tipo_proceso"
//                                 value={form.data.tipo_proceso}
//                                 onChange={(event) =>
//                                     form.setData(
//                                         'tipo_proceso',
//                                         event.target.value,
//                                     )
//                                 }
//                                 placeholder="Proceso sumario"
//                                 disabled={form.processing}
//                             />

//                             {form.errors.tipo_proceso && (
//                                 <p className="text-sm text-red-400">
//                                     {form.errors.tipo_proceso}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="fecha_inicio">
//                                 Fecha de inicio
//                             </Label>

//                             <Input
//                                 id="fecha_inicio"
//                                 type="date"
//                                 value={form.data.fecha_inicio}
//                                 onChange={(event) =>
//                                     form.setData(
//                                         'fecha_inicio',
//                                         event.target.value,
//                                     )
//                                 }
//                                 disabled={form.processing}
//                             />

//                             {form.errors.fecha_inicio && (
//                                 <p className="text-sm text-red-400">
//                                     {form.errors.fecha_inicio}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="fecha_cierre">
//                                 Fecha de cierre
//                             </Label>

//                             <Input
//                                 id="fecha_cierre"
//                                 type="date"
//                                 value={form.data.fecha_cierre}
//                                 onChange={(event) =>
//                                     form.setData(
//                                         'fecha_cierre',
//                                         event.target.value,
//                                     )
//                                 }
//                                 disabled={form.processing}
//                             />

//                             {form.errors.fecha_cierre && (
//                                 <p className="text-sm text-red-400">
//                                     {form.errors.fecha_cierre}
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="estado">
//                             Estado
//                         </Label>

//                         <select
//                             id="estado"
//                             value={form.data.estado}
//                             onChange={(event) =>
//                                 form.setData(
//                                     'estado',
//                                     event.target.value,
//                                 )
//                             }
//                             disabled={form.processing}
//                             className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
//                         >
//                             {estados.map((estado) => (
//                                 <option
//                                     key={estado.value}
//                                     value={estado.value}
//                                 >
//                                     {estado.label}
//                                 </option>
//                             ))}
//                         </select>

//                         {form.errors.estado && (
//                             <p className="text-sm text-red-400">
//                                 {form.errors.estado}
//                             </p>
//                         )}
//                     </div>

//                     <div className="grid gap-5 md:grid-cols-2">
//                         <div className="space-y-2">
//                             <Label htmlFor="descripcion">
//                                 Descripción
//                             </Label>

//                             <Textarea
//                                 id="descripcion"
//                                 value={form.data.descripcion}
//                                 onChange={(event) =>
//                                     form.setData(
//                                         'descripcion',
//                                         event.target.value,
//                                     )
//                                 }
//                                 placeholder="Descripción general del expediente..."
//                                 rows={5}
//                                 disabled={form.processing}
//                             />

//                             {form.errors.descripcion && (
//                                 <p className="text-sm text-red-400">
//                                     {form.errors.descripcion}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="observaciones">
//                                 Observaciones
//                             </Label>

//                             <Textarea
//                                 id="observaciones"
//                                 value={form.data.observaciones}
//                                 onChange={(event) =>
//                                     form.setData(
//                                         'observaciones',
//                                         event.target.value,
//                                     )
//                                 }
//                                 placeholder="Observaciones adicionales..."
//                                 rows={5}
//                                 disabled={form.processing}
//                             />

//                             {form.errors.observaciones && (
//                                 <p className="text-sm text-red-400">
//                                     {form.errors.observaciones}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* -----------------------------------------------------------
//                 DOCUMENTO INICIAL
//             ------------------------------------------------------------ */}

//             {!isEditing && (
//                 <Card className="border-slate-800 bg-slate-950/60">
//                     <CardHeader>
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
//                                 <FileText className="h-5 w-5 text-emerald-400" />
//                             </div>

//                             <div>
//                                 <CardTitle className="text-base text-slate-100">
//                                     Documento inicial
//                                 </CardTitle>

//                                 <p className="mt-1 text-sm text-slate-400">
//                                     Puede adjuntar el primer documento digital
//                                     del expediente.
//                                 </p>
//                             </div>
//                         </div>
//                     </CardHeader>

//                     <CardContent className="space-y-6">
//                         {!selectedFile ? (
//                             <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center transition hover:border-slate-600">
//                                 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">
//                                     <Upload className="h-6 w-6 text-slate-400" />
//                                 </div>

//                                 <h3 className="mt-4 text-sm font-medium text-slate-200">
//                                     Seleccionar documento PDF
//                                 </h3>

//                                 <p className="mt-1 text-sm text-slate-500">
//                                     Formato PDF · Máximo 50 MB
//                                 </p>

//                                 <div className="mt-5">
//                                     <Label
//                                         htmlFor="documento"
//                                         className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
//                                     >
//                                         <Upload className="h-4 w-4" />
//                                         Seleccionar archivo
//                                     </Label>

//                                     <Input
//                                         id="documento"
//                                         type="file"
//                                         accept="application/pdf,.pdf"
//                                         onChange={handleFileChange}
//                                         disabled={form.processing}
//                                         className="hidden"
//                                     />
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
//                                 <div className="flex items-start justify-between gap-4">
//                                     <div className="flex min-w-0 items-center gap-4">
//                                         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
//                                             <FileText className="h-6 w-6 text-red-400" />
//                                         </div>

//                                         <div className="min-w-0">
//                                             <p className="truncate text-sm font-medium text-slate-100">
//                                                 {selectedFile.name}
//                                             </p>

//                                             <p className="mt-1 text-xs text-slate-500">
//                                                 PDF ·{' '}
//                                                 {formatFileSize(
//                                                     selectedFile.size,
//                                                 )}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={removeFile}
//                                         disabled={form.processing}
//                                         className="shrink-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
//                                     >
//                                         <X className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         )}

//                         {form.errors.documento && (
//                             <p className="text-sm text-red-400">
//                                 {form.errors.documento}
//                             </p>
//                         )}

//                         <div className="grid gap-5 md:grid-cols-2">
//                             <div className="space-y-2">
//                                 <Label htmlFor="documento_tipo">
//                                     Tipo de documento
//                                 </Label>

//                                 <Input
//                                     id="documento_tipo"
//                                     value={form.data.documento_tipo}
//                                     onChange={(event) =>
//                                         form.setData(
//                                             'documento_tipo',
//                                             event.target.value,
//                                         )
//                                     }
//                                     placeholder="Ej. Resolución de inicio"
//                                     disabled={form.processing}
//                                 />

//                                 {form.errors.documento_tipo && (
//                                     <p className="text-sm text-red-400">
//                                         {form.errors.documento_tipo}
//                                     </p>
//                                 )}
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="documento_titulo">
//                                     Título del documento
//                                 </Label>

//                                 <Input
//                                     id="documento_titulo"
//                                     value={form.data.documento_titulo}
//                                     onChange={(event) =>
//                                         form.setData(
//                                             'documento_titulo',
//                                             event.target.value,
//                                         )
//                                     }
//                                     placeholder="Ej. Resolución Administrativa N.º 001/2026"
//                                     disabled={form.processing}
//                                 />

//                                 {form.errors.documento_titulo && (
//                                     <p className="text-sm text-red-400">
//                                         {form.errors.documento_titulo}
//                                     </p>
//                                 )}
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="documento_fecha">
//                                     Fecha del documento
//                                 </Label>

//                                 <div className="relative">
//                                     <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

//                                     <Input
//                                         id="documento_fecha"
//                                         type="date"
//                                         value={form.data.documento_fecha}
//                                         onChange={(event) =>
//                                             form.setData(
//                                                 'documento_fecha',
//                                                 event.target.value,
//                                             )
//                                         }
//                                         disabled={form.processing}
//                                         className="pl-9"
//                                     />
//                                 </div>

//                                 {form.errors.documento_fecha && (
//                                     <p className="text-sm text-red-400">
//                                         {form.errors.documento_fecha}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="grid gap-5 md:grid-cols-2">
//                             <div className="space-y-2">
//                                 <Label htmlFor="documento_descripcion">
//                                     Descripción
//                                 </Label>

//                                 <Textarea
//                                     id="documento_descripcion"
//                                     value={
//                                         form.data.documento_descripcion
//                                     }
//                                     onChange={(event) =>
//                                         form.setData(
//                                             'documento_descripcion',
//                                             event.target.value,
//                                         )
//                                     }
//                                     placeholder="Descripción del documento..."
//                                     rows={4}
//                                     disabled={form.processing}
//                                 />

//                                 {form.errors.documento_descripcion && (
//                                     <p className="text-sm text-red-400">
//                                         {
//                                             form.errors
//                                                 .documento_descripcion
//                                         }
//                                     </p>
//                                 )}
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="documento_observaciones">
//                                     Observaciones
//                                 </Label>

//                                 <Textarea
//                                     id="documento_observaciones"
//                                     value={
//                                         form.data
//                                             .documento_observaciones
//                                     }
//                                     onChange={(event) =>
//                                         form.setData(
//                                             'documento_observaciones',
//                                             event.target.value,
//                                         )
//                                     }
//                                     placeholder="Observaciones del documento..."
//                                     rows={4}
//                                     disabled={form.processing}
//                                 />

//                                 {form.errors.documento_observaciones && (
//                                     <p className="text-sm text-red-400">
//                                         {
//                                             form.errors
//                                                 .documento_observaciones
//                                         }
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* -----------------------------------------------------------
//                 ACCIONES
//             ------------------------------------------------------------ */}

//             <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-800 pt-6 sm:flex-row">
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleCancel}
//                     disabled={form.processing}
//                     className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
//                 >
//                     Cancelar
//                 </Button>

//                 <Button
//                     type="submit"
//                     disabled={form.processing}
//                     className="bg-blue-600 text-white hover:bg-blue-500"
//                 >
//                     {form.processing
//                         ? 'Guardando...'
//                         : isEditing
//                           ? 'Guardar cambios'
//                           : 'Crear expediente'}
//                 </Button>
//             </div>
//         </form>
//     );
// }
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    FileText,
    FolderOpen,
    Upload,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Expediente = {
    id?: number;
    numero_expediente?: string | null;
    titulo?: string | null;
    tipo_proceso?: string | null;
    gestion?: string | number | null;
    fecha_inicio?: string | null;
    fecha_cierre?: string | null;
    estado?: string | null;
    descripcion?: string | null;
    observaciones?: string | null;
};

type ExpedienteFormData = {
    numero_expediente: string;
    titulo: string;
    tipo_proceso: string;
    gestion: string;
    fecha_inicio: string;
    fecha_cierre: string;
    estado: string;
    descripcion: string;
    observaciones: string;
    documento: File | null;
    documento_tipo: string;
    documento_titulo: string;
    documento_descripcion: string;
    documento_fecha: string;
    documento_observaciones: string;
};

type Props = {
    expediente?: Expediente;
};

const estados = [
    {
        value: 'abierto',
        label: 'Abierto',
    },
    {
        value: 'en_proceso',
        label: 'En proceso',
    },
    {
        value: 'concluido',
        label: 'Concluido',
    },
    {
        value: 'archivado',
        label: 'Archivado',
    },
];

const normalizeDate = (value?: string | null): string => {
    if (!value) {
        return '';
    }

    return value.slice(0, 10);
};

export default function ExpedienteForm({
    expediente,
}: Props) {
    const isEditing = Boolean(expediente?.id);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<ExpedienteFormData>({
        numero_expediente: expediente?.numero_expediente ?? '',
        titulo: expediente?.titulo ?? '',
        tipo_proceso: expediente?.tipo_proceso ?? '',
        gestion: expediente?.gestion?.toString() ?? '',
        fecha_inicio: normalizeDate(expediente?.fecha_inicio),
        fecha_cierre: normalizeDate(expediente?.fecha_cierre),
        estado: expediente?.estado ?? 'abierto',
        descripcion: expediente?.descripcion ?? '',
        observaciones: expediente?.observaciones ?? '',
        documento: null,
        documento_tipo: '',
        documento_titulo: '',
        documento_descripcion: '',
        documento_fecha: '',
        documento_observaciones: '',
    });

    useEffect(() => {
        if (!expediente) {
            return;
        }

        form.setData({
            numero_expediente: expediente.numero_expediente ?? '',
            titulo: expediente.titulo ?? '',
            tipo_proceso: expediente.tipo_proceso ?? '',
            gestion: expediente.gestion?.toString() ?? '',
            fecha_inicio: normalizeDate(expediente.fecha_inicio),
            fecha_cierre: normalizeDate(expediente.fecha_cierre),
            estado: expediente.estado ?? 'abierto',
            descripcion: expediente.descripcion ?? '',
            observaciones: expediente.observaciones ?? '',
            documento: null,
            documento_tipo: '',
            documento_titulo: '',
            documento_descripcion: '',
            documento_fecha: '',
            documento_observaciones: '',
        });

        setSelectedFile(null);
    }, [expediente]);

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            setSelectedFile(null);
            form.setData('documento', null);
            return;
        }

        if (file.type !== 'application/pdf') {
            form.setError(
                'documento',
                'El documento debe estar en formato PDF.',
            );

            event.target.value = '';
            setSelectedFile(null);
            form.setData('documento', null);

            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            form.setError(
                'documento',
                'El documento no puede superar los 50 MB.',
            );

            event.target.value = '';
            setSelectedFile(null);
            form.setData('documento', null);

            return;
        }

        form.clearErrors('documento');
        setSelectedFile(file);
        form.setData('documento', file);

        if (!form.data.documento_titulo) {
            form.setData(
                'documento_titulo',
                file.name.replace(/\.pdf$/i, ''),
            );
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        form.setData('documento', null);
        form.setData('documento_titulo', '');

        const input = document.getElementById(
            'documento',
        ) as HTMLInputElement | null;

        if (input) {
            input.value = '';
        }

        form.clearErrors('documento');
    };

    const formatFileSize = (size: number): string => {
        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (form.processing) {
            return;
        }

        if (isEditing && expediente?.id) {
            form.put(`/expedientes/${expediente.id}`, {
                preserveScroll: true,
            });

            return;
        }

        form.post('/expedientes', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handleCancel = () => {
        if (form.processing) {
            return;
        }

        if (isEditing && expediente?.id) {
            router.visit(`/expedientes/${expediente.id}`);
            return;
        }

        router.visit('/expedientes');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <Card className="border-slate-800 bg-slate-950/60">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                            <FolderOpen className="h-5 w-5 text-blue-400" />
                        </div>

                        <div>
                            <CardTitle className="text-base text-slate-100">
                                Información del expediente
                            </CardTitle>

                            <p className="mt-1 text-sm text-slate-400">
                                Datos generales del proceso sumario.
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="numero_expediente">
                                Número de expediente
                            </Label>

                            <Input
                                id="numero_expediente"
                                value={form.data.numero_expediente}
                                onChange={(event) =>
                                    form.setData(
                                        'numero_expediente',
                                        event.target.value,
                                    )
                                }
                                placeholder="Ej. SUM-001/2026"
                                disabled={form.processing}
                            />

                            {form.errors.numero_expediente && (
                                <p className="text-sm text-red-400">
                                    {form.errors.numero_expediente}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gestion">
                                Gestión
                            </Label>

                            <Input
                                id="gestion"
                                value={form.data.gestion}
                                onChange={(event) =>
                                    form.setData(
                                        'gestion',
                                        event.target.value,
                                    )
                                }
                                placeholder="2026"
                                maxLength={4}
                                disabled={form.processing}
                            />

                            {form.errors.gestion && (
                                <p className="text-sm text-red-400">
                                    {form.errors.gestion}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="titulo">
                            Título del expediente
                        </Label>

                        <Input
                            id="titulo"
                            value={form.data.titulo}
                            onChange={(event) =>
                                form.setData(
                                    'titulo',
                                    event.target.value,
                                )
                            }
                            placeholder="Descripción breve del proceso sumario"
                            disabled={form.processing}
                        />

                        {form.errors.titulo && (
                            <p className="text-sm text-red-400">
                                {form.errors.titulo}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="tipo_proceso">
                                Tipo de proceso
                            </Label>

                            <Input
                                id="tipo_proceso"
                                value={form.data.tipo_proceso}
                                onChange={(event) =>
                                    form.setData(
                                        'tipo_proceso',
                                        event.target.value,
                                    )
                                }
                                placeholder="Proceso sumario"
                                disabled={form.processing}
                            />

                            {form.errors.tipo_proceso && (
                                <p className="text-sm text-red-400">
                                    {form.errors.tipo_proceso}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fecha_inicio">
                                Fecha de inicio
                            </Label>

                            <Input
                                id="fecha_inicio"
                                type="date"
                                value={form.data.fecha_inicio}
                                onChange={(event) =>
                                    form.setData(
                                        'fecha_inicio',
                                        event.target.value,
                                    )
                                }
                                disabled={form.processing}
                            />

                            {form.errors.fecha_inicio && (
                                <p className="text-sm text-red-400">
                                    {form.errors.fecha_inicio}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fecha_cierre">
                                Fecha de cierre
                            </Label>

                            <Input
                                id="fecha_cierre"
                                type="date"
                                value={form.data.fecha_cierre}
                                onChange={(event) =>
                                    form.setData(
                                        'fecha_cierre',
                                        event.target.value,
                                    )
                                }
                                disabled={form.processing}
                            />

                            {form.errors.fecha_cierre && (
                                <p className="text-sm text-red-400">
                                    {form.errors.fecha_cierre}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estado">
                            Estado
                        </Label>

                        <select
                            id="estado"
                            value={form.data.estado}
                            onChange={(event) =>
                                form.setData(
                                    'estado',
                                    event.target.value,
                                )
                            }
                            disabled={form.processing}
                            className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                            {estados.map((estado) => (
                                <option
                                    key={estado.value}
                                    value={estado.value}
                                >
                                    {estado.label}
                                </option>
                            ))}
                        </select>

                        {form.errors.estado && (
                            <p className="text-sm text-red-400">
                                {form.errors.estado}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="descripcion">
                                Descripción
                            </Label>

                            <Textarea
                                id="descripcion"
                                value={form.data.descripcion}
                                onChange={(event) =>
                                    form.setData(
                                        'descripcion',
                                        event.target.value,
                                    )
                                }
                                placeholder="Descripción general del expediente..."
                                rows={5}
                                disabled={form.processing}
                            />

                            {form.errors.descripcion && (
                                <p className="text-sm text-red-400">
                                    {form.errors.descripcion}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observaciones">
                                Observaciones
                            </Label>

                            <Textarea
                                id="observaciones"
                                value={form.data.observaciones}
                                onChange={(event) =>
                                    form.setData(
                                        'observaciones',
                                        event.target.value,
                                    )
                                }
                                placeholder="Observaciones adicionales..."
                                rows={5}
                                disabled={form.processing}
                            />

                            {form.errors.observaciones && (
                                <p className="text-sm text-red-400">
                                    {form.errors.observaciones}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {!isEditing && (
                <Card className="border-slate-800 bg-slate-950/60">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                                <FileText className="h-5 w-5 text-emerald-400" />
                            </div>

                            <div>
                                <CardTitle className="text-base text-slate-100">
                                    Documento inicial
                                </CardTitle>

                                <p className="mt-1 text-sm text-slate-400">
                                    Puede adjuntar el primer documento digital
                                    del expediente.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {!selectedFile ? (
                            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center transition hover:border-slate-600">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">
                                    <Upload className="h-6 w-6 text-slate-400" />
                                </div>

                                <h3 className="mt-4 text-sm font-medium text-slate-200">
                                    Seleccionar documento PDF
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Formato PDF · Máximo 50 MB
                                </p>

                                <div className="mt-5">
                                    <Label
                                        htmlFor="documento"
                                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Seleccionar archivo
                                    </Label>

                                    <Input
                                        id="documento"
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        onChange={handleFileChange}
                                        disabled={form.processing}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                                            <FileText className="h-6 w-6 text-red-400" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-100">
                                                {selectedFile.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                PDF ·{' '}
                                                {formatFileSize(
                                                    selectedFile.size,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={removeFile}
                                        disabled={form.processing}
                                        className="shrink-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {form.errors.documento && (
                            <p className="text-sm text-red-400">
                                {form.errors.documento}
                            </p>
                        )}

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="documento_tipo">
                                    Tipo de documento
                                </Label>

                                <Input
                                    id="documento_tipo"
                                    value={form.data.documento_tipo}
                                    onChange={(event) =>
                                        form.setData(
                                            'documento_tipo',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Ej. Resolución de inicio"
                                    disabled={form.processing}
                                />

                                {form.errors.documento_tipo && (
                                    <p className="text-sm text-red-400">
                                        {form.errors.documento_tipo}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documento_titulo">
                                    Título del documento
                                </Label>

                                <Input
                                    id="documento_titulo"
                                    value={form.data.documento_titulo}
                                    onChange={(event) =>
                                        form.setData(
                                            'documento_titulo',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Ej. Resolución Administrativa N.º 001/2026"
                                    disabled={form.processing}
                                />

                                {form.errors.documento_titulo && (
                                    <p className="text-sm text-red-400">
                                        {form.errors.documento_titulo}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documento_fecha">
                                    Fecha del documento
                                </Label>

                                <div className="relative">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                    <Input
                                        id="documento_fecha"
                                        type="date"
                                        value={form.data.documento_fecha}
                                        onChange={(event) =>
                                            form.setData(
                                                'documento_fecha',
                                                event.target.value,
                                            )
                                        }
                                        disabled={form.processing}
                                        className="pl-9"
                                    />
                                </div>

                                {form.errors.documento_fecha && (
                                    <p className="text-sm text-red-400">
                                        {form.errors.documento_fecha}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="documento_descripcion">
                                    Descripción
                                </Label>

                                <Textarea
                                    id="documento_descripcion"
                                    value={form.data.documento_descripcion}
                                    onChange={(event) =>
                                        form.setData(
                                            'documento_descripcion',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Descripción del documento..."
                                    rows={4}
                                    disabled={form.processing}
                                />

                                {form.errors.documento_descripcion && (
                                    <p className="text-sm text-red-400">
                                        {form.errors.documento_descripcion}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documento_observaciones">
                                    Observaciones
                                </Label>

                                <Textarea
                                    id="documento_observaciones"
                                    value={form.data.documento_observaciones}
                                    onChange={(event) =>
                                        form.setData(
                                            'documento_observaciones',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Observaciones del documento..."
                                    rows={4}
                                    disabled={form.processing}
                                />

                                {form.errors.documento_observaciones && (
                                    <p className="text-sm text-red-400">
                                        {form.errors.documento_observaciones}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-800 pt-6 sm:flex-row">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={form.processing}
                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    disabled={form.processing}
                    className="bg-blue-600 text-white hover:bg-blue-500"
                >
                    {form.processing
                        ? 'Guardando...'
                        : isEditing
                          ? 'Guardar cambios'
                          : 'Crear expediente'}
                </Button>
            </div>
        </form>
    );
}
