// import { useRef, useState } from 'react';
// import { Head, Link, router } from '@inertiajs/react';
// import {
//     ArrowLeft,
//     CalendarDays,
//     CheckCircle2,
//     Clock3,
//     Download,
//     Edit,
//     FileText,
//     FolderOpen,
//     HardDrive,
//     LockKeyhole,
//     Plus,
//     Upload,
//     User,
//     X,
// } from 'lucide-react';

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

// type UserSummary = {
//     id: number;
//     name: string;
// };

// type Documento = {
//     id: number;
//     tipo_documento: string;
//     titulo: string;
//     descripcion?: string | null;
//     fecha_documento?: string | null;
//     archivo_nombre_original: string;
//     archivo_mime: string;
//     archivo_size: number;
//     orden: number;
//     observaciones?: string | null;
//     created_at: string;
//     creator?: UserSummary | null;
// };

// type Expediente = {
//     id: number;
//     numero_expediente: string;
//     titulo: string;
//     tipo_proceso?: string | null;
//     gestion?: number | string | null;
//     fecha_inicio?: string | null;
//     fecha_cierre?: string | null;
//     estado: 'abierto' | 'en_proceso' | 'concluido' | 'archivado';
//     descripcion?: string | null;
//     observaciones?: string | null;
//     created_at: string;
//     updated_at: string;
//     creator?: UserSummary | null;
//     updater?: UserSummary | null;
//     documentos?: Documento[];
// };

// type Props = {
//     expediente: Expediente;
// };

// const estadoConfig = {
//     abierto: {
//         label: 'Abierto',
//         className:
//             'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
//         icon: Clock3,
//     },
//     en_proceso: {
//         label: 'En proceso',
//         className:
//             'border-blue-500/20 bg-blue-500/10 text-blue-300',
//         icon: Clock3,
//     },
//     concluido: {
//         label: 'Concluido',
//         className:
//             'border-green-500/20 bg-green-500/10 text-green-300',
//         icon: CheckCircle2,
//     },
//     archivado: {
//         label: 'Archivado',
//         className:
//             'border-slate-500/20 bg-slate-500/10 text-slate-300',
//         icon: LockKeyhole,
//     },
// };

// function formatDate(value?: string | null): string {
//     if (!value) {
//         return 'No registrada';
//     }

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//         return value;
//     }

//     return date.toLocaleDateString('es-BO', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//     });
// }

// function formatDateTime(value?: string | null): string {
//     if (!value) {
//         return 'No registrada';
//     }

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//         return value;
//     }

//     return date.toLocaleString('es-BO', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//     });
// }

// function formatFileSize(size: number): string {
//     if (!size) {
//         return '0 KB';
//     }

//     if (size < 1024) {
//         return `${size} B`;
//     }

//     if (size < 1024 * 1024) {
//         return `${(size / 1024).toFixed(1)} KB`;
//     }

//     if (size < 1024 * 1024 * 1024) {
//         return `${(size / (1024 * 1024)).toFixed(1)} MB`;
//     }

//     return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
// }

// export default function Show({ expediente }: Props) {
//     const documentos = expediente.documentos ?? [];

//     const estado =
//         estadoConfig[expediente.estado] ??
//         estadoConfig.abierto;

//     const EstadoIcon = estado.icon;

//     const [showDocumentForm, setShowDocumentForm] = useState(false);
//     const [selectedFile, setSelectedFile] =
//         useState<File | null>(null);

//     const fileInputRef = useRef<HTMLInputElement | null>(null);

//     const [form, setForm] = useState({
//         documento_tipo: '',
//         documento_titulo: '',
//         documento_descripcion: '',
//         documento_fecha: '',
//         documento_observaciones: '',
//     });

//     const [errors, setErrors] = useState<
//         Record<string, string>
//     >({});

//     const [processing, setProcessing] = useState(false);

//     const handleFileChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//         const file = event.target.files?.[0] ?? null;

//         if (!file) {
//             setSelectedFile(null);
//             return;
//         }

//         if (file.type !== 'application/pdf') {
//             setErrors({
//                 documento: 'El documento debe estar en formato PDF.',
//             });

//             event.target.value = '';
//             setSelectedFile(null);

//             return;
//         }

//         if (file.size > 50 * 1024 * 1024) {
//             setErrors({
//                 documento:
//                     'El documento no puede superar los 50 MB.',
//             });

//             event.target.value = '';
//             setSelectedFile(null);

//             return;
//         }

//         setErrors({});
//         setSelectedFile(file);

//         if (!form.documento_titulo) {
//             setForm((current) => ({
//                 ...current,
//                 documento_titulo: file.name.replace(
//                     /\.pdf$/i,
//                     '',
//                 ),
//             }));
//         }
//     };

//     const removeFile = () => {
//         setSelectedFile(null);

//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     const handleAddDocument = (
//         event: React.FormEvent<HTMLFormElement>,
//     ) => {
//         event.preventDefault();

//         if (processing) {
//             return;
//         }

//         if (!selectedFile) {
//             setErrors({
//                 documento: 'Debe seleccionar un documento PDF.',
//             });

//             return;
//         }

//         if (!form.documento_tipo.trim()) {
//             setErrors({
//                 documento_tipo:
//                     'El tipo de documento es obligatorio.',
//             });

//             return;
//         }

//         if (!form.documento_titulo.trim()) {
//             setErrors({
//                 documento_titulo:
//                     'El título del documento es obligatorio.',
//             });

//             return;
//         }

//         setProcessing(true);
//         setErrors({});

//         const data = new FormData();

//         data.append('documento', selectedFile);
//         data.append(
//             'documento_tipo',
//             form.documento_tipo,
//         );
//         data.append(
//             'documento_titulo',
//             form.documento_titulo,
//         );

//         if (form.documento_descripcion) {
//             data.append(
//                 'documento_descripcion',
//                 form.documento_descripcion,
//             );
//         }

//         if (form.documento_fecha) {
//             data.append(
//                 'documento_fecha',
//                 form.documento_fecha,
//             );
//         }

//         if (form.documento_observaciones) {
//             data.append(
//                 'documento_observaciones',
//                 form.documento_observaciones,
//             );
//         }

//         router.post(
//             `/expedientes/${expediente.id}/documentos`,
//             data,
//             {
//                 forceFormData: true,
//                 preserveScroll: true,
//                 onSuccess: () => {
//                     setShowDocumentForm(false);
//                     setSelectedFile(null);

//                     setForm({
//                         documento_tipo: '',
//                         documento_titulo: '',
//                         documento_descripcion: '',
//                         documento_fecha: '',
//                         documento_observaciones: '',
//                     });

//                     if (fileInputRef.current) {
//                         fileInputRef.current.value = '';
//                     }
//                 },
//                 onError: (serverErrors) => {
//                     setErrors(
//                         serverErrors as Record<string, string>,
//                     );
//                 },
//                 onFinish: () => {
//                     setProcessing(false);
//                 },
//             },
//         );
//     };

//     const openAddDocument = () => {
//         setErrors({});
//         setShowDocumentForm(true);
//     };

//     const closeAddDocument = () => {
//         if (processing) {
//             return;
//         }

//         setShowDocumentForm(false);
//         setSelectedFile(null);
//         setErrors({});

//         setForm({
//             documento_tipo: '',
//             documento_titulo: '',
//             documento_descripcion: '',
//             documento_fecha: '',
//             documento_observaciones: '',
//         });

//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     return (
//         <>
//             <Head
//                 title={`Expediente ${expediente.numero_expediente}`}
//             />

//             <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//                     <div className="flex items-start gap-4">
//                         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
//                             <FolderOpen className="h-7 w-7 text-blue-400" />
//                         </div>

//                         <div>
//                             <div className="mb-1 flex items-center gap-2">
//                                 <Link
//                                     href="/expedientes"
//                                     className="text-sm text-slate-500 transition hover:text-slate-300"
//                                 >
//                                     Expedientes
//                                 </Link>

//                                 <span className="text-slate-700">
//                                     /
//                                 </span>

//                                 <span className="text-sm text-slate-400">
//                                     {
//                                         expediente.numero_expediente
//                                     }
//                                 </span>
//                             </div>

//                             <div className="flex flex-wrap items-center gap-3">
//                                 <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
//                                     {expediente.titulo}
//                                 </h1>

//                                 <Badge
//                                     variant="outline"
//                                     className={estado.className}
//                                 >
//                                     <EstadoIcon className="mr-1.5 h-3.5 w-3.5" />
//                                     {estado.label}
//                                 </Badge>
//                             </div>

//                             <p className="mt-2 text-sm text-slate-400">
//                                 Expediente{' '}
//                                 <span className="font-medium text-slate-300">
//                                     {
//                                         expediente.numero_expediente
//                                     }
//                                 </span>
//                                 {expediente.tipo_proceso
//                                     ? ` · ${expediente.tipo_proceso}`
//                                     : ''}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap gap-2">
//                         <Button
//                             asChild
//                             variant="outline"
//                             className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
//                         >
//                             <Link href="/expedientes">
//                                 <ArrowLeft className="mr-2 h-4 w-4" />
//                                 Volver
//                             </Link>
//                         </Button>

//                         <Button
//                             asChild
//                             className="bg-blue-600 text-white hover:bg-blue-500"
//                         >
//                             <Link
//                                 href={`/expedientes/${expediente.id}/edit`}
//                             >
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 Editar expediente
//                             </Link>
//                         </Button>
//                     </div>
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//                     <Card className="border-slate-800 bg-slate-950/60">
//                         <CardContent className="p-5">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                         Documentos
//                                     </p>

//                                     <p className="mt-2 text-2xl font-semibold text-slate-100">
//                                         {documentos.length}
//                                     </p>
//                                 </div>

//                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
//                                     <FileText className="h-5 w-5 text-blue-400" />
//                                 </div>
//                             </div>

//                             <p className="mt-2 text-xs text-slate-500">
//                                 Archivos registrados en el expediente
//                             </p>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-slate-800 bg-slate-950/60">
//                         <CardContent className="p-5">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                         Gestión
//                                     </p>

//                                     <p className="mt-2 text-2xl font-semibold text-slate-100">
//                                         {expediente.gestion ?? '—'}
//                                     </p>
//                                 </div>

//                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
//                                     <CalendarDays className="h-5 w-5 text-indigo-400" />
//                                 </div>
//                             </div>

//                             <p className="mt-2 text-xs text-slate-500">
//                                 Gestión administrativa
//                             </p>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-slate-800 bg-slate-950/60">
//                         <CardContent className="p-5">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                         Inicio
//                                     </p>

//                                     <p className="mt-2 text-lg font-semibold text-slate-100">
//                                         {formatDate(
//                                             expediente.fecha_inicio,
//                                         )}
//                                     </p>
//                                 </div>

//                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
//                                     <Clock3 className="h-5 w-5 text-emerald-400" />
//                                 </div>
//                             </div>

//                             <p className="mt-2 text-xs text-slate-500">
//                                 Fecha de inicio del proceso
//                             </p>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-slate-800 bg-slate-950/60">
//                         <CardContent className="p-5">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                         Registrado por
//                                     </p>

//                                     <p className="mt-2 truncate text-lg font-semibold text-slate-100">
//                                         {expediente.creator?.name ??
//                                             'Usuario'}
//                                     </p>
//                                 </div>

//                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
//                                     <User className="h-5 w-5 text-violet-400" />
//                                 </div>
//                             </div>

//                             <p className="mt-2 text-xs text-slate-500">
//                                 Responsable del registro
//                             </p>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
//                     <Card className="border-slate-800 bg-slate-950/60">
//                         <CardHeader className="border-b border-slate-800">
//                             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                     <div className="flex items-center gap-2">
//                                         <FolderOpen className="h-5 w-5 text-blue-400" />

//                                         <CardTitle className="text-base text-slate-100">
//                                             Carpeta digital
//                                         </CardTitle>
//                                     </div>

//                                     <p className="mt-1 text-sm text-slate-500">
//                                         Documentación digital asociada al
//                                         expediente.
//                                     </p>
//                                 </div>

//                                 <Button
//                                     type="button"
//                                     onClick={openAddDocument}
//                                     className="bg-blue-600 text-white hover:bg-blue-500"
//                                 >
//                                     <Plus className="mr-2 h-4 w-4" />
//                                     Agregar documento
//                                 </Button>
//                             </div>
//                         </CardHeader>

//                         <CardContent className="p-0">
//                             {showDocumentForm && (
//                                 <div className="border-b border-slate-800 bg-slate-900/40 p-5">
//                                     <div className="mb-5 flex items-center justify-between gap-4">
//                                         <div>
//                                             <h2 className="text-base font-semibold text-slate-100">
//                                                 Agregar documento
//                                             </h2>

//                                             <p className="mt-1 text-sm text-slate-500">
//                                                 Registra un nuevo documento
//                                                 PDF en este expediente.
//                                             </p>
//                                         </div>

//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="icon"
//                                             onClick={closeAddDocument}
//                                             disabled={processing}
//                                             className="text-slate-400 hover:bg-slate-800 hover:text-slate-200"
//                                         >
//                                             <X className="h-4 w-4" />
//                                         </Button>
//                                     </div>

//                                     <form
//                                         onSubmit={handleAddDocument}
//                                         className="space-y-5"
//                                     >
//                                         <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-5">
//                                             {!selectedFile ? (
//                                                 <div className="text-center">
//                                                     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900">
//                                                         <Upload className="h-5 w-5 text-slate-400" />
//                                                     </div>

//                                                     <p className="mt-3 text-sm font-medium text-slate-200">
//                                                         Seleccionar documento
//                                                         PDF
//                                                     </p>

//                                                     <p className="mt-1 text-xs text-slate-500">
//                                                         PDF · Máximo 50 MB
//                                                     </p>

//                                                     <Label
//                                                         htmlFor="nuevo_documento"
//                                                         className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
//                                                     >
//                                                         <Upload className="h-4 w-4" />
//                                                         Seleccionar archivo
//                                                     </Label>

//                                                     <Input
//                                                         ref={fileInputRef}
//                                                         id="nuevo_documento"
//                                                         type="file"
//                                                         accept="application/pdf,.pdf"
//                                                         onChange={
//                                                             handleFileChange
//                                                         }
//                                                         disabled={
//                                                             processing
//                                                         }
//                                                         className="hidden"
//                                                     />
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex items-center justify-between gap-4">
//                                                     <div className="flex min-w-0 items-center gap-3">
//                                                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
//                                                             <FileText className="h-5 w-5 text-red-400" />
//                                                         </div>

//                                                         <div className="min-w-0">
//                                                             <p className="truncate text-sm font-medium text-slate-200">
//                                                                 {
//                                                                     selectedFile.name
//                                                                 }
//                                                             </p>

//                                                             <p className="mt-1 text-xs text-slate-500">
//                                                                 PDF ·{' '}
//                                                                 {formatFileSize(
//                                                                     selectedFile.size,
//                                                                 )}
//                                                             </p>
//                                                         </div>
//                                                     </div>

//                                                     <Button
//                                                         type="button"
//                                                         variant="ghost"
//                                                         size="icon"
//                                                         onClick={
//                                                             removeFile
//                                                         }
//                                                         disabled={
//                                                             processing
//                                                         }
//                                                         className="shrink-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
//                                                     >
//                                                         <X className="h-4 w-4" />
//                                                     </Button>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {errors.documento && (
//                                             <p className="text-sm text-red-400">
//                                                 {errors.documento}
//                                             </p>
//                                         )}

//                                         <div className="grid gap-5 md:grid-cols-2">
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="documento_tipo">
//                                                     Tipo de documento
//                                                 </Label>

//                                                 <Input
//                                                     id="documento_tipo"
//                                                     value={
//                                                         form.documento_tipo
//                                                     }
//                                                     onChange={(event) =>
//                                                         setForm(
//                                                             (current) => ({
//                                                                 ...current,
//                                                                 documento_tipo:
//                                                                     event.target
//                                                                         .value,
//                                                             }),
//                                                         )
//                                                     }
//                                                     placeholder="Ej. Informe, Resolución, Notificación"
//                                                     disabled={processing}
//                                                 />

//                                                 {errors.documento_tipo && (
//                                                     <p className="text-sm text-red-400">
//                                                         {
//                                                             errors.documento_tipo
//                                                         }
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="documento_titulo">
//                                                     Título del documento
//                                                 </Label>

//                                                 <Input
//                                                     id="documento_titulo"
//                                                     value={
//                                                         form.documento_titulo
//                                                     }
//                                                     onChange={(event) =>
//                                                         setForm(
//                                                             (current) => ({
//                                                                 ...current,
//                                                                 documento_titulo:
//                                                                     event.target
//                                                                         .value,
//                                                             }),
//                                                         )
//                                                     }
//                                                     placeholder="Título del documento"
//                                                     disabled={processing}
//                                                 />

//                                                 {errors.documento_titulo && (
//                                                     <p className="text-sm text-red-400">
//                                                         {
//                                                             errors.documento_titulo
//                                                         }
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div className="grid gap-5 md:grid-cols-2">
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="documento_fecha">
//                                                     Fecha del documento
//                                                 </Label>

//                                                 <div className="relative">
//                                                     <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

//                                                     <Input
//                                                         id="documento_fecha"
//                                                         type="date"
//                                                         value={
//                                                             form.documento_fecha
//                                                         }
//                                                         onChange={(
//                                                             event,
//                                                         ) =>
//                                                             setForm(
//                                                                 (
//                                                                     current,
//                                                                 ) => ({
//                                                                     ...current,
//                                                                     documento_fecha:
//                                                                         event
//                                                                             .target
//                                                                             .value,
//                                                                 }),
//                                                             )
//                                                         }
//                                                         disabled={
//                                                             processing
//                                                         }
//                                                         className="pl-9"
//                                                     />
//                                                 </div>

//                                                 {errors.documento_fecha && (
//                                                     <p className="text-sm text-red-400">
//                                                         {
//                                                             errors.documento_fecha
//                                                         }
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="documento_descripcion">
//                                                     Descripción
//                                                 </Label>

//                                                 <Input
//                                                     id="documento_descripcion"
//                                                     value={
//                                                         form.documento_descripcion
//                                                     }
//                                                     onChange={(event) =>
//                                                         setForm(
//                                                             (current) => ({
//                                                                 ...current,
//                                                                 documento_descripcion:
//                                                                     event.target
//                                                                         .value,
//                                                             }),
//                                                         )
//                                                     }
//                                                     placeholder="Descripción breve del documento"
//                                                     disabled={processing}
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <Label htmlFor="documento_observaciones">
//                                                 Observaciones
//                                             </Label>

//                                             <Textarea
//                                                 id="documento_observaciones"
//                                                 value={
//                                                     form.documento_observaciones
//                                                 }
//                                                 onChange={(event) =>
//                                                     setForm(
//                                                         (current) => ({
//                                                             ...current,
//                                                             documento_observaciones:
//                                                                 event.target
//                                                                     .value,
//                                                         }),
//                                                     )
//                                                 }
//                                                 placeholder="Observaciones del documento..."
//                                                 rows={3}
//                                                 disabled={processing}
//                                             />
//                                         </div>

//                                         <div className="flex justify-end gap-2 border-t border-slate-800 pt-5">
//                                             <Button
//                                                 type="button"
//                                                 variant="outline"
//                                                 onClick={
//                                                     closeAddDocument
//                                                 }
//                                                 disabled={processing}
//                                                 className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
//                                             >
//                                                 Cancelar
//                                             </Button>

//                                             <Button
//                                                 type="submit"
//                                                 disabled={
//                                                     processing
//                                                 }
//                                                 className="bg-blue-600 text-white hover:bg-blue-500"
//                                             >
//                                                 {processing
//                                                     ? 'Guardando...'
//                                                     : 'Guardar documento'}
//                                             </Button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             )}

//                             {documentos.length === 0 ? (
//                                 <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
//                                     <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
//                                         <FileText className="h-7 w-7 text-slate-600" />
//                                     </div>

//                                     <h3 className="mt-4 text-base font-medium text-slate-200">
//                                         No hay documentos registrados
//                                     </h3>

//                                     <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
//                                         Este expediente todavía no tiene
//                                         documentos digitales asociados.
//                                     </p>

//                                     {!showDocumentForm && (
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             onClick={openAddDocument}
//                                             className="mt-5 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
//                                         >
//                                             <Plus className="mr-2 h-4 w-4" />
//                                             Agregar primer documento
//                                         </Button>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className="divide-y divide-slate-800">
//                                     {documentos.map(
//                                         (documento, index) => (
//                                             <div
//                                                 key={documento.id}
//                                                 className="flex flex-col gap-4 p-5 transition hover:bg-slate-900/40 md:flex-row md:items-center md:justify-between"
//                                             >
//                                                 <div className="flex min-w-0 items-start gap-4">
//                                                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
//                                                         <FileText className="h-5 w-5 text-red-400" />
//                                                     </div>

//                                                     <div className="min-w-0">
//                                                         <div className="flex flex-wrap items-center gap-2">
//                                                             <span className="text-xs font-medium text-slate-500">
//                                                                 #
//                                                                 {index +
//                                                                     1}
//                                                             </span>

//                                                             <Badge
//                                                                 variant="outline"
//                                                                 className="border-slate-700 bg-slate-900 text-slate-400"
//                                                             >
//                                                                 {
//                                                                     documento.tipo_documento
//                                                                 }
//                                                             </Badge>
//                                                         </div>

//                                                         <h3 className="mt-2 truncate text-sm font-semibold text-slate-200">
//                                                             {
//                                                                 documento.titulo
//                                                             }
//                                                         </h3>

//                                                         <p className="mt-1 truncate text-xs text-slate-500">
//                                                             {
//                                                                 documento.archivo_nombre_original
//                                                             }
//                                                         </p>

//                                                         <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
//                                                             <span>
//                                                                 {formatFileSize(
//                                                                     documento.archivo_size,
//                                                                 )}
//                                                             </span>

//                                                             <span>
//                                                                 {formatDate(
//                                                                     documento.fecha_documento,
//                                                                 )}
//                                                             </span>

//                                                             {documento.creator && (
//                                                                 <span>
//                                                                     Por{' '}
//                                                                     {
//                                                                         documento
//                                                                             .creator
//                                                                             .name
//                                                                     }
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="flex shrink-0 gap-2">
//                                                     <Button
//                                                         asChild
//                                                         type="button"
//                                                         variant="outline"
//                                                         size="sm"
//                                                         className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
//                                                     >
//                                                         <a
//                                                             href={`/expedientes/${expediente.id}/documentos/${documento.id}/ver`}
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                         >
//                                                             <FileText className="mr-2 h-4 w-4" />
//                                                             Ver
//                                                         </a>
//                                                     </Button>

//                                                     <Button
//                                                         asChild
//                                                         type="button"
//                                                         variant="outline"
//                                                         size="sm"
//                                                         className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
//                                                     >
//                                                         <a
//                                                             href={`/expedientes/${expediente.id}/documentos/${documento.id}/descargar`}
//                                                         >
//                                                             <Download className="mr-2 h-4 w-4" />
//                                                             Descargar
//                                                         </a>
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         ),
//                                     )}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>

//                     <div className="space-y-6">
//                         <Card className="border-slate-800 bg-slate-950/60">
//                             <CardHeader>
//                                 <CardTitle className="text-base text-slate-100">
//                                     Información del expediente
//                                 </CardTitle>
//                             </CardHeader>

//                             <CardContent className="space-y-4">
//                                 <div>
//                                     <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                         Número
//                                     </p>

//                                     <p className="mt-1 text-sm font-medium text-slate-200">
//                                         {
//                                             expediente.numero_expediente
//                                         }
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                         Tipo de proceso
//                                     </p>

//                                     <p className="mt-1 text-sm text-slate-300">
//                                         {expediente.tipo_proceso ??
//                                             'No especificado'}
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                         Fecha de inicio
//                                     </p>

//                                     <p className="mt-1 text-sm text-slate-300">
//                                         {formatDate(
//                                             expediente.fecha_inicio,
//                                         )}
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                                         Fecha de cierre
//                                     </p>

//                                     <p className="mt-1 text-sm text-slate-300">
//                                         {formatDate(
//                                             expediente.fecha_cierre,
//                                         )}
//                                     </p>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         <Card className="border-slate-800 bg-slate-950/60">
//                             <CardHeader>
//                                 <CardTitle className="text-base text-slate-100">
//                                     Descripción
//                                 </CardTitle>
//                             </CardHeader>

//                             <CardContent>
//                                 <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
//                                     {expediente.descripcion ||
//                                         'No se registró una descripción para este expediente.'}
//                                 </p>
//                             </CardContent>
//                         </Card>

//                         <Card className="border-slate-800 bg-slate-950/60">
//                             <CardHeader>
//                                 <CardTitle className="text-base text-slate-100">
//                                     Control y trazabilidad
//                                 </CardTitle>
//                             </CardHeader>

//                             <CardContent className="space-y-4">
//                                 <div className="flex gap-3">
//                                     <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

//                                     <div>
//                                         <p className="text-xs text-slate-500">
//                                             Creado por
//                                         </p>

//                                         <p className="mt-1 text-sm text-slate-300">
//                                             {expediente.creator?.name ??
//                                                 'No disponible'}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex gap-3">
//                                     <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

//                                     <div>
//                                         <p className="text-xs text-slate-500">
//                                             Última modificación
//                                         </p>

//                                         <p className="mt-1 text-sm text-slate-300">
//                                             {formatDateTime(
//                                                 expediente.updated_at,
//                                             )}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {expediente.updater && (
//                                     <div className="flex gap-3">
//                                         <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

//                                         <div>
//                                             <p className="text-xs text-slate-500">
//                                                 Modificado por
//                                             </p>

//                                             <p className="mt-1 text-sm text-slate-300">
//                                                 {
//                                                     expediente
//                                                         .updater
//                                                         .name
//                                                 }
//                                             </p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>

//                 {expediente.observaciones && (
//                     <Card className="border-amber-500/10 bg-amber-500/5">
//                         <CardContent className="p-5">
//                             <p className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
//                                 Observaciones
//                             </p>

//                             <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
//                                 {expediente.observaciones}
//                             </p>
//                         </CardContent>
//                     </Card>
//                 )}
//             </div>
//         </>
//     );
// }
import { useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Download,
    Edit,
    FileText,
    FolderOpen,
    HardDrive,
    LockKeyhole,
    Plus,
    Trash2,
    Upload,
    User,
    X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
import { usePermissions } from '@/hooks/use-permissions';

type UserSummary = {
    id: number;
    name: string;
};

type Documento = {
    id: number;
    tipo_documento: string;
    titulo: string;
    descripcion?: string | null;
    fecha_documento?: string | null;
    archivo_nombre_original: string;
    archivo_mime: string;
    archivo_size: number;
    orden: number;
    observaciones?: string | null;
    created_at: string;
    creator?: UserSummary | null;
};

type Expediente = {
    id: number;
    numero_expediente: string;
    titulo: string;
    tipo_proceso?: string | null;
    gestion?: number | string | null;
    fecha_inicio?: string | null;
    fecha_cierre?: string | null;
    estado: 'abierto' | 'en_proceso' | 'concluido' | 'archivado';
    descripcion?: string | null;
    observaciones?: string | null;
    created_at: string;
    updated_at: string;
    creator?: UserSummary | null;
    updater?: UserSummary | null;
    documentos?: Documento[];
};

type Props = {
    expediente: Expediente;
};

const estadoConfig = {
    abierto: {
        label: 'Abierto',
        className:
            'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
        icon: Clock3,
    },
    en_proceso: {
        label: 'En proceso',
        className:
            'border-blue-500/20 bg-blue-500/10 text-blue-300',
        icon: Clock3,
    },
    concluido: {
        label: 'Concluido',
        className:
            'border-green-500/20 bg-green-500/10 text-green-300',
        icon: CheckCircle2,
    },
    archivado: {
        label: 'Archivado',
        className:
            'border-slate-500/20 bg-slate-500/10 text-slate-300',
        icon: LockKeyhole,
    },
};

function formatDate(value?: string | null): string {
    if (!value) {
        return 'No registrada';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatDateTime(value?: string | null): string {
    if (!value) {
        return 'No registrada';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatFileSize(size: number): string {
    if (!size) {
        return '0 KB';
    }

    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function Show({ expediente }: Props) {
    const { can } = usePermissions();

    const documentos = expediente.documentos ?? [];

    const canView = can('expedientes.view');
    const canEdit = can('expedientes.edit');
    const canDelete = can('expedientes.delete');
    const canViewDocuments = can('expedientes.documentos.view');
    const canCreateDocuments = can('expedientes.documentos.create');

    const estado =
        estadoConfig[expediente.estado] ??
        estadoConfig.abierto;

    const EstadoIcon = estado.icon;

    const [showDocumentForm, setShowDocumentForm] = useState(false);
    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState({
        documento_tipo: '',
        documento_titulo: '',
        documento_descripcion: '',
        documento_fecha: '',
        documento_observaciones: '',
    });

    const [errors, setErrors] = useState<
        Record<string, string>
    >({});

    const [processing, setProcessing] = useState(false);

    const handleDeleteExpediente = () => {
        if (!canDelete) {
            return;
        }

        const confirmed = window.confirm(
            `¿Está seguro de eliminar el expediente ${expediente.numero_expediente}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/expedientes/${expediente.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!canCreateDocuments) {
            event.target.value = '';
            return;
        }

        const file = event.target.files?.[0] ?? null;

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (file.type !== 'application/pdf') {
            setErrors({
                documento: 'El documento debe estar en formato PDF.',
            });

            event.target.value = '';
            setSelectedFile(null);

            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setErrors({
                documento:
                    'El documento no puede superar los 50 MB.',
            });

            event.target.value = '';
            setSelectedFile(null);

            return;
        }

        setErrors({});
        setSelectedFile(file);

        if (!form.documento_titulo) {
            setForm((current) => ({
                ...current,
                documento_titulo: file.name.replace(
                    /\.pdf$/i,
                    '',
                ),
            }));
        }
    };

    const removeFile = () => {
        if (!canCreateDocuments) {
            return;
        }

        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddDocument = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!canCreateDocuments) {
            return;
        }

        if (processing) {
            return;
        }

        if (!selectedFile) {
            setErrors({
                documento: 'Debe seleccionar un documento PDF.',
            });

            return;
        }

        if (!form.documento_tipo.trim()) {
            setErrors({
                documento_tipo:
                    'El tipo de documento es obligatorio.',
            });

            return;
        }

        if (!form.documento_titulo.trim()) {
            setErrors({
                documento_titulo:
                    'El título del documento es obligatorio.',
            });

            return;
        }

        setProcessing(true);
        setErrors({});

        const data = new FormData();

        data.append('documento', selectedFile);
        data.append(
            'documento_tipo',
            form.documento_tipo,
        );
        data.append(
            'documento_titulo',
            form.documento_titulo,
        );

        if (form.documento_descripcion) {
            data.append(
                'documento_descripcion',
                form.documento_descripcion,
            );
        }

        if (form.documento_fecha) {
            data.append(
                'documento_fecha',
                form.documento_fecha,
            );
        }

        if (form.documento_observaciones) {
            data.append(
                'documento_observaciones',
                form.documento_observaciones,
            );
        }

        router.post(
            `/expedientes/${expediente.id}/documentos`,
            data,
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setShowDocumentForm(false);
                    setSelectedFile(null);

                    setForm({
                        documento_tipo: '',
                        documento_titulo: '',
                        documento_descripcion: '',
                        documento_fecha: '',
                        documento_observaciones: '',
                    });

                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
                onError: (serverErrors) => {
                    setErrors(
                        serverErrors as Record<string, string>,
                    );
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    const openAddDocument = () => {
        if (!canCreateDocuments) {
            return;
        }

        setErrors({});
        setShowDocumentForm(true);
    };

    const closeAddDocument = () => {
        if (processing) {
            return;
        }

        setShowDocumentForm(false);
        setSelectedFile(null);
        setErrors({});

        setForm({
            documento_tipo: '',
            documento_titulo: '',
            documento_descripcion: '',
            documento_fecha: '',
            documento_observaciones: '',
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Head
                title={`Expediente ${expediente.numero_expediente}`}
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                            <FolderOpen className="h-7 w-7 text-blue-400" />
                        </div>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <Link
                                    href="/expedientes"
                                    className="text-sm text-slate-500 transition hover:text-slate-300"
                                >
                                    Expedientes
                                </Link>

                                <span className="text-slate-700">
                                    /
                                </span>

                                <span className="text-sm text-slate-400">
                                    {
                                        expediente.numero_expediente
                                    }
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
                                    {expediente.titulo}
                                </h1>

                                <Badge
                                    variant="outline"
                                    className={estado.className}
                                >
                                    <EstadoIcon className="mr-1.5 h-3.5 w-3.5" />
                                    {estado.label}
                                </Badge>
                            </div>

                            <p className="mt-2 text-sm text-slate-400">
                                Expediente{' '}
                                <span className="font-medium text-slate-300">
                                    {
                                        expediente.numero_expediente
                                    }
                                </span>
                                {expediente.tipo_proceso
                                    ? ` · ${expediente.tipo_proceso}`
                                    : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            asChild
                            variant="outline"
                            className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                        >
                            <Link href="/expedientes">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Link>
                        </Button>

                        {canEdit && (
                            <Button
                                asChild
                                className="bg-blue-600 text-white hover:bg-blue-500"
                            >
                                <Link
                                    href={`/expedientes/${expediente.id}/edit`}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar expediente
                                </Link>
                            </Button>
                        )}

                        {canDelete && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleDeleteExpediente}
                                className="border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-slate-800 bg-slate-950/60">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Documentos
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold text-slate-100">
                                        {documentos.length}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                                    <FileText className="h-5 w-5 text-blue-400" />
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Archivos registrados en el expediente
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-950/60">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Gestión
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold text-slate-100">
                                        {expediente.gestion ?? '—'}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                                    <CalendarDays className="h-5 w-5 text-indigo-400" />
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Gestión administrativa
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-950/60">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Inicio
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-slate-100">
                                        {formatDate(
                                            expediente.fecha_inicio,
                                        )}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                                    <Clock3 className="h-5 w-5 text-emerald-400" />
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Fecha de inicio del proceso
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-950/60">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Registrado por
                                    </p>

                                    <p className="mt-2 truncate text-lg font-semibold text-slate-100">
                                        {expediente.creator?.name ??
                                            'Usuario'}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                                    <User className="h-5 w-5 text-violet-400" />
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Responsable del registro
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <Card className="border-slate-800 bg-slate-950/60">
                        <CardHeader className="border-b border-slate-800">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FolderOpen className="h-5 w-5 text-blue-400" />

                                        <CardTitle className="text-base text-slate-100">
                                            Carpeta digital
                                        </CardTitle>
                                    </div>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Documentación digital asociada al
                                        expediente.
                                    </p>
                                </div>

                                {canCreateDocuments && (
                                    <Button
                                        type="button"
                                        onClick={openAddDocument}
                                        className="bg-blue-600 text-white hover:bg-blue-500"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar documento
                                    </Button>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {showDocumentForm &&
                                canCreateDocuments && (
                                    <div className="border-b border-slate-800 bg-slate-900/40 p-5">
                                        <div className="mb-5 flex items-center justify-between gap-4">
                                            <div>
                                                <h2 className="text-base font-semibold text-slate-100">
                                                    Agregar documento
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Registra un nuevo documento
                                                    PDF en este expediente.
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={closeAddDocument}
                                                disabled={processing}
                                                className="text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <form
                                            onSubmit={handleAddDocument}
                                            className="space-y-5"
                                        >
                                            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-5">
                                                {!selectedFile ? (
                                                    <div className="text-center">
                                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900">
                                                            <Upload className="h-5 w-5 text-slate-400" />
                                                        </div>

                                                        <p className="mt-3 text-sm font-medium text-slate-200">
                                                            Seleccionar documento
                                                            PDF
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            PDF · Máximo 50 MB
                                                        </p>

                                                        <Label
                                                            htmlFor="nuevo_documento"
                                                            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                                                        >
                                                            <Upload className="h-4 w-4" />
                                                            Seleccionar archivo
                                                        </Label>

                                                        <Input
                                                            ref={fileInputRef}
                                                            id="nuevo_documento"
                                                            type="file"
                                                            accept="application/pdf,.pdf"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                            className="hidden"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                                                                <FileText className="h-5 w-5 text-red-400" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-medium text-slate-200">
                                                                    {
                                                                        selectedFile.name
                                                                    }
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
                                                            onClick={
                                                                removeFile
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                            className="shrink-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {errors.documento && (
                                                <p className="text-sm text-red-400">
                                                    {errors.documento}
                                                </p>
                                            )}

                                            <div className="grid gap-5 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="documento_tipo">
                                                        Tipo de documento
                                                    </Label>

                                                    <Input
                                                        id="documento_tipo"
                                                        value={
                                                            form.documento_tipo
                                                        }
                                                        onChange={(event) =>
                                                            setForm(
                                                                (current) => ({
                                                                    ...current,
                                                                    documento_tipo:
                                                                        event.target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        placeholder="Ej. Informe, Resolución, Notificación"
                                                        disabled={processing}
                                                    />

                                                    {errors.documento_tipo && (
                                                        <p className="text-sm text-red-400">
                                                            {
                                                                errors.documento_tipo
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="documento_titulo">
                                                        Título del documento
                                                    </Label>

                                                    <Input
                                                        id="documento_titulo"
                                                        value={
                                                            form.documento_titulo
                                                        }
                                                        onChange={(event) =>
                                                            setForm(
                                                                (current) => ({
                                                                    ...current,
                                                                    documento_titulo:
                                                                        event.target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        placeholder="Título del documento"
                                                        disabled={processing}
                                                    />

                                                    {errors.documento_titulo && (
                                                        <p className="text-sm text-red-400">
                                                            {
                                                                errors.documento_titulo
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid gap-5 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="documento_fecha">
                                                        Fecha del documento
                                                    </Label>

                                                    <div className="relative">
                                                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                                        <Input
                                                            id="documento_fecha"
                                                            type="date"
                                                            value={
                                                                form.documento_fecha
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                setForm(
                                                                    (
                                                                        current,
                                                                    ) => ({
                                                                        ...current,
                                                                        documento_fecha:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                            className="pl-9"
                                                        />
                                                    </div>

                                                    {errors.documento_fecha && (
                                                        <p className="text-sm text-red-400">
                                                            {
                                                                errors.documento_fecha
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="documento_descripcion">
                                                        Descripción
                                                    </Label>

                                                    <Input
                                                        id="documento_descripcion"
                                                        value={
                                                            form.documento_descripcion
                                                        }
                                                        onChange={(event) =>
                                                            setForm(
                                                                (current) => ({
                                                                    ...current,
                                                                    documento_descripcion:
                                                                        event.target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        placeholder="Descripción breve del documento"
                                                        disabled={processing}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="documento_observaciones">
                                                    Observaciones
                                                </Label>

                                                <Textarea
                                                    id="documento_observaciones"
                                                    value={
                                                        form.documento_observaciones
                                                    }
                                                    onChange={(event) =>
                                                        setForm(
                                                            (current) => ({
                                                                ...current,
                                                                documento_observaciones:
                                                                    event.target
                                                                        .value,
                                                            }),
                                                        )
                                                    }
                                                    placeholder="Observaciones del documento..."
                                                    rows={3}
                                                    disabled={processing}
                                                />
                                            </div>

                                            <div className="flex justify-end gap-2 border-t border-slate-800 pt-5">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={
                                                        closeAddDocument
                                                    }
                                                    disabled={processing}
                                                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                                                >
                                                    Cancelar
                                                </Button>

                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        processing
                                                    }
                                                    className="bg-blue-600 text-white hover:bg-blue-500"
                                                >
                                                    {processing
                                                        ? 'Guardando...'
                                                        : 'Guardar documento'}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                            {documentos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
                                        <FileText className="h-7 w-7 text-slate-600" />
                                    </div>

                                    <h3 className="mt-4 text-base font-medium text-slate-200">
                                        No hay documentos registrados
                                    </h3>

                                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        Este expediente todavía no tiene
                                        documentos digitales asociados.
                                    </p>

                                    {!showDocumentForm &&
                                        canCreateDocuments && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={
                                                    openAddDocument
                                                }
                                                className="mt-5 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Agregar primer documento
                                            </Button>
                                        )}
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800">
                                    {documentos.map(
                                        (documento, index) => (
                                            <div
                                                key={documento.id}
                                                className="flex flex-col gap-4 p-5 transition hover:bg-slate-900/40 md:flex-row md:items-center md:justify-between"
                                            >
                                                <div className="flex min-w-0 items-start gap-4">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                                                        <FileText className="h-5 w-5 text-red-400" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-xs font-medium text-slate-500">
                                                                #
                                                                {index +
                                                                    1}
                                                            </span>

                                                            <Badge
                                                                variant="outline"
                                                                className="border-slate-700 bg-slate-900 text-slate-400"
                                                            >
                                                                {
                                                                    documento.tipo_documento
                                                                }
                                                            </Badge>
                                                        </div>

                                                        <h3 className="mt-2 truncate text-sm font-semibold text-slate-200">
                                                            {
                                                                documento.titulo
                                                            }
                                                        </h3>

                                                        <p className="mt-1 truncate text-xs text-slate-500">
                                                            {
                                                                documento.archivo_nombre_original
                                                            }
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                                            <span>
                                                                {formatFileSize(
                                                                    documento.archivo_size,
                                                                )}
                                                            </span>

                                                            <span>
                                                                {formatDate(
                                                                    documento.fecha_documento,
                                                                )}
                                                            </span>

                                                            {documento.creator && (
                                                                <span>
                                                                    Por{' '}
                                                                    {
                                                                        documento
                                                                            .creator
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {canViewDocuments && (
                                                    <div className="flex shrink-0 gap-2">
                                                        <Button
                                                            asChild
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                                                        >
                                                            <a
                                                                href={`/expedientes/${expediente.id}/documentos/${documento.id}/ver`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                Ver
                                                            </a>
                                                        </Button>

                                                        <Button
                                                            asChild
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                                                        >
                                                            <a
                                                                href={`/expedientes/${expediente.id}/documentos/${documento.id}/descargar`}
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Descargar
                                                            </a>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-slate-800 bg-slate-950/60">
                            <CardHeader>
                                <CardTitle className="text-base text-slate-100">
                                    Información del expediente
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Número
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-200">
                                        {
                                            expediente.numero_expediente
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Tipo de proceso
                                    </p>

                                    <p className="mt-1 text-sm text-slate-300">
                                        {expediente.tipo_proceso ??
                                            'No especificado'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Fecha de inicio
                                    </p>

                                    <p className="mt-1 text-sm text-slate-300">
                                        {formatDate(
                                            expediente.fecha_inicio,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Fecha de cierre
                                    </p>

                                    <p className="mt-1 text-sm text-slate-300">
                                        {formatDate(
                                            expediente.fecha_cierre,
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-800 bg-slate-950/60">
                            <CardHeader>
                                <CardTitle className="text-base text-slate-100">
                                    Descripción
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
                                    {expediente.descripcion ||
                                        'No se registró una descripción para este expediente.'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-800 bg-slate-950/60">
                            <CardHeader>
                                <CardTitle className="text-base text-slate-100">
                                    Control y trazabilidad
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Creado por
                                        </p>

                                        <p className="mt-1 text-sm text-slate-300">
                                            {expediente.creator?.name ??
                                                'No disponible'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Última modificación
                                        </p>

                                        <p className="mt-1 text-sm text-slate-300">
                                            {formatDateTime(
                                                expediente.updated_at,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {expediente.updater && (
                                    <div className="flex gap-3">
                                        <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Modificado por
                                            </p>

                                            <p className="mt-1 text-sm text-slate-300">
                                                {
                                                    expediente
                                                        .updater
                                                        .name
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {expediente.observaciones && (
                    <Card className="border-amber-500/10 bg-amber-500/5">
                        <CardContent className="p-5">
                            <p className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
                                Observaciones
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                                {expediente.observaciones}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
