<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expedientes', function (Blueprint $table) {
            $table->id();
            /*
            |--------------------------------------------------------------------------
            | IDENTIFICACIÓN DEL EXPEDIENTE
            |--------------------------------------------------------------------------
            */

            $table->string('numero_expediente', 100)
                ->unique();

            $table->string('titulo', 255);

            /*
            |--------------------------------------------------------------------------
            | INFORMACIÓN DEL PROCESO
            |--------------------------------------------------------------------------
            */

            $table->string('tipo_proceso', 100)
                ->nullable();

            $table->string('gestion', 4)
                ->nullable();

            $table->date('fecha_inicio')
                ->nullable();

            $table->date('fecha_cierre')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | ESTADO
            |--------------------------------------------------------------------------
            */

            $table->enum('estado', [
                'abierto',
                'en_proceso',
                'concluido',
                'archivado',
            ])->default('abierto');

            /*
            |--------------------------------------------------------------------------
            | INFORMACIÓN ADICIONAL
            |--------------------------------------------------------------------------
            */

            $table->text('descripcion')
                ->nullable();

            $table->text('observaciones')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | AUDITORÍA
            |--------------------------------------------------------------------------
            |
            | created_by:
            | Usuario que creó el expediente.
            |
            | updated_by:
            | Usuario que realizó la última modificación.
            |
            */

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | FECHAS
            |--------------------------------------------------------------------------
            */

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | ELIMINACIÓN LÓGICA
            |--------------------------------------------------------------------------
            */

            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | ÍNDICES
            |--------------------------------------------------------------------------
            */

            $table->index('estado');
            $table->index('gestion');
            $table->index('tipo_proceso');
            $table->index('fecha_inicio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expedientes');
    }
};
