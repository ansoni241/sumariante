<?php

namespace App\Http\Controllers\Admin\Expediente;

use App\Http\Requests\Admin\Expediente\StoreExpedienteRequest;
use App\Http\Requests\Admin\Expediente\UpdateExpedienteRequest;
use App\Models\Expediente;
use App\Models\ExpedienteDocumento;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Expediente\StoreExpedienteDocumentoRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ExpedienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $expedientes = Expediente::query()
            ->with([
                'creator:id,name',
                'updater:id,name',
            ])
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->string('search');

                    $query->where(function ($query) use ($search) {
                        $query
                            ->where('numero_expediente', 'like', "%{$search}%")
                            ->orWhere('titulo', 'like', "%{$search}%")
                            ->orWhere('tipo_proceso', 'like', "%{$search}%");
                    });
                }
            )
            ->when(
                $request->filled('estado'),
                fn($query) => $query->where(
                    'estado',
                    $request->string('estado')
                )
            )
            ->when(
                $request->filled('gestion'),
                fn($query) => $query->where(
                    'gestion',
                    $request->integer('gestion')
                )
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('expedientes/index', [
            'expedientes' => $expedientes,
            'filters' => [
                'search' => $request->input('search', ''),
                'estado' => $request->input('estado', ''),
                'gestion' => $request->input('gestion', ''),
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Formulario de creación
    |--------------------------------------------------------------------------
    */

    public function create(): Response
    {
        return Inertia::render('expedientes/create');
    }

    /*
    |--------------------------------------------------------------------------
    | Crear expediente
    |--------------------------------------------------------------------------
    */

    public function store(
        StoreExpedienteRequest $request
    ): RedirectResponse {
        $validated = $request->validated();

        $expediente = DB::transaction(function () use (
            $request,
            $validated
        ) {
            /*
            |--------------------------------------------------------------------------
            | Crear expediente
            |--------------------------------------------------------------------------
            */

            $expediente = Expediente::create([
                'numero_expediente' => $validated['numero_expediente'],
                'titulo' => $validated['titulo'],
                'tipo_proceso' => $validated['tipo_proceso'] ?? null,
                'gestion' => $validated['gestion'] ?? null,
                'fecha_inicio' => $validated['fecha_inicio'] ?? null,
                'fecha_cierre' => $validated['fecha_cierre'] ?? null,
                'estado' => $validated['estado'],
                'descripcion' => $validated['descripcion'] ?? null,
                'observaciones' => $validated['observaciones'] ?? null,
                'created_by' => auth()->id(),
                // 'updated_by' => auth()->id(),
            ]);

            /*
            |--------------------------------------------------------------------------
            | Documento inicial
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('documento')) {
                $file = $request->file('documento');

                /*
                |--------------------------------------------------------------------------
                | Generar nombre y carpeta privada
                |--------------------------------------------------------------------------
                */

                $extension = $file->getClientOriginalExtension();

                $nombreArchivo = Str::uuid()->toString()
                    . '.'
                    . $extension;

                $directorio = sprintf(
                    'expedientes/%s/%s/documentos',
                    $expediente->gestion ?? now()->format('Y'),
                    $expediente->id,
                );

                /*
                |--------------------------------------------------------------------------
                | Guardar archivo
                |--------------------------------------------------------------------------
                |
                | Se utiliza el disco "local", por lo que el archivo
                | queda fuera de public/ y no puede abrirse directamente
                | mediante una URL pública.
                |
                */

                $archivoPath = $file->storeAs(
                    $directorio,
                    $nombreArchivo,
                    'local',
                );

                /*
                |--------------------------------------------------------------------------
                | Registrar documento
                |--------------------------------------------------------------------------
                */

                ExpedienteDocumento::create([
                    'expediente_id' => $expediente->id,

                    'tipo_documento' =>
                    $validated['documento_tipo']
                        ?? 'Documento inicial',

                    'titulo' =>
                    $validated['documento_titulo']
                        ?? $file->getClientOriginalName(),

                    'descripcion' =>
                    $validated['documento_descripcion']
                        ?? null,

                    'fecha_documento' =>
                    $validated['documento_fecha']
                        ?? null,

                    'archivo_path' => $archivoPath,

                    'archivo_nombre' => $nombreArchivo,

                    'archivo_nombre_original' =>
                    $file->getClientOriginalName(),

                    'archivo_mime' =>
                    $file->getMimeType(),

                    'archivo_size' =>
                    $file->getSize(),

                    'orden' => 1,

                    'observaciones' =>
                    $validated['documento_observaciones']
                        ?? null,

                    'created_by' => auth()->id(),
                    // 'updated_by' => auth()->id(),
                ]);
            }

            return $expediente;
        });

        return to_route(
            'expedientes.show',
            $expediente
        )->with(
            'success',
            'Expediente creado correctamente.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Mostrar expediente
    |--------------------------------------------------------------------------
    */

    public function show(Expediente $expediente): Response
    {
        $expediente->load([
            'creator:id,name',
            'updater:id,name',
            'documentos' => function ($query) {
                $query
                    ->with([
                        'creator:id,name',
                        'updater:id,name',
                    ])
                    ->orderBy('orden');
            },
        ]);

        return Inertia::render('expedientes/show', [
            'expediente' => $expediente,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Formulario de edición
    |--------------------------------------------------------------------------
    */

    public function edit(Expediente $expediente): Response
    {
        return Inertia::render('expedientes/edit', [
            'expediente' => $expediente,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Actualizar expediente
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateExpedienteRequest $request,
        Expediente $expediente
    ): RedirectResponse {
        $validated = $request->validated();

        $expediente->update([
            'numero_expediente' => $validated['numero_expediente'],
            'titulo' => $validated['titulo'],
            'tipo_proceso' => $validated['tipo_proceso'] ?? null,
            'gestion' => $validated['gestion'] ?? null,
            'fecha_inicio' => $validated['fecha_inicio'] ?? null,
            'fecha_cierre' => $validated['fecha_cierre'] ?? null,
            'estado' => $validated['estado'],
            'descripcion' => $validated['descripcion'] ?? null,
            'observaciones' => $validated['observaciones'] ?? null,
            'updated_by' => auth()->id(),
        ]);

        return to_route(
            'expedientes.show',
            $expediente
        )->with(
            'success',
            'Expediente actualizado correctamente.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Eliminar expediente
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Expediente $expediente
    ): RedirectResponse {
        $expediente->delete();

        return to_route(
            'expedientes.index'
        )->with(
            'success',
            'Expediente eliminado correctamente.'
        );
    }
    public function verDocumento(
        Expediente $expediente,
        ExpedienteDocumento $documento
    ) {
        abort_unless(
            $documento->expediente_id === $expediente->id,
            404
        );

        $disk = Storage::disk('local');

        abort_unless(
            $disk->exists($documento->archivo_path),
            404
        );

        $nombreArchivo = str_replace(
            ["\r", "\n", '"'],
            '',
            $documento->archivo_nombre_original
        );

        return response()->file(
            $disk->path($documento->archivo_path),
            [
                'Content-Type' => $documento->archivo_mime ?: 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $nombreArchivo . '"',
            ]
        );
    }

    public function descargarDocumento(
        Expediente $expediente,
        ExpedienteDocumento $documento
    ) {
        abort_unless(
            $documento->expediente_id === $expediente->id,
            404
        );

        abort_unless(
            Storage::disk('local')->exists($documento->archivo_path),
            404
        );

        return Storage::disk('local')->download(
            $documento->archivo_path,
            $documento->archivo_nombre_original,
            [
                'Content-Type' => $documento->archivo_mime,
            ]
        );
    }

    public function agregarDocumento(
        StoreExpedienteDocumentoRequest $request,
        Expediente $expediente
    ): RedirectResponse {
        $validated = $request->validated();

        DB::transaction(function () use (
            $request,
            $validated,
            $expediente
        ) {
            $file = $request->file('documento');

            $extension = $file->getClientOriginalExtension();

            $nombreArchivo = Str::uuid()->toString()
                . '.'
                . $extension;

            $directorio = sprintf(
                'expedientes/%s/%s/documentos',
                $expediente->gestion ?? now()->format('Y'),
                $expediente->id,
            );

            $archivoPath = $file->storeAs(
                $directorio,
                $nombreArchivo,
                'local',
            );

            $ultimoOrden = ExpedienteDocumento::query()
                ->where(
                    'expediente_id',
                    $expediente->id
                )
                ->max('orden');

            ExpedienteDocumento::create([
                'expediente_id' => $expediente->id,
                'tipo_documento' => $validated['documento_tipo'],
                'titulo' => $validated['documento_titulo'],
                'descripcion' =>
                $validated['documento_descripcion']
                    ?? null,
                'fecha_documento' =>
                $validated['documento_fecha']
                    ?? null,
                'archivo_path' => $archivoPath,
                'archivo_nombre' => $nombreArchivo,
                'archivo_nombre_original' =>
                $file->getClientOriginalName(),
                'archivo_mime' => $file->getMimeType(),
                'archivo_size' => $file->getSize(),
                'orden' => ($ultimoOrden ?? 0) + 1,
                'observaciones' =>
                $validated['documento_observaciones']
                    ?? null,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);
        });

        return to_route(
            'expedientes.show',
            $expediente
        )->with(
            'success',
            'Documento agregado correctamente.'
        );
    }
}
