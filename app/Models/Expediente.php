<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expediente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'expedientes';
    protected $fillable = [
        'numero_expediente',
        'titulo',
        'tipo_proceso',
        'gestion',
        'fecha_inicio',
        'fecha_cierre',
        'estado',
        'descripcion',
        'observaciones',
        'created_by',
        'updated_by',
    ];
    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_cierre' => 'date',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Usuario que creó el expediente
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
    public function documentos(): HasMany
    {
        return $this->hasMany(
            ExpedienteDocumento::class,
            'expediente_id',
        )->orderBy('orden');
    }
}
