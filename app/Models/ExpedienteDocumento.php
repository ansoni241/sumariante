<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpedienteDocumento extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'expediente_documentos';

    protected $fillable = [
        'expediente_id',
        'tipo_documento',
        'titulo',
        'descripcion',
        'fecha_documento',
        'archivo_path',
        'archivo_nombre',
        'archivo_nombre_original',
        'archivo_mime',
        'archivo_size',
        'orden',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha_documento' => 'date',
            'archivo_size' => 'integer',
            'orden' => 'integer',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Expediente al que pertenece
    |--------------------------------------------------------------------------
    */

    public function expediente(): BelongsTo
    {
        return $this->belongsTo(
            Expediente::class,
            'expediente_id',
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Usuario que creó/subió el documento
    |--------------------------------------------------------------------------
    */

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by',
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Usuario que realizó la última modificación
    |--------------------------------------------------------------------------
    */

    public function updater(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'updated_by',
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Crear automáticamente el usuario responsable
    |--------------------------------------------------------------------------
    */

    protected static function booted(): void
    {
        static::creating(function (ExpedienteDocumento $documento) {
            if (auth()->check()) {
                $documento->created_by = auth()->id();
                $documento->updated_by = auth()->id();
            }
        });

        static::updating(function (ExpedienteDocumento $documento) {
            if (auth()->check()) {
                $documento->updated_by = auth()->id();
            }
        });
    }
}
