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
        Schema::create('expediente_documentos', function (Blueprint $table) {
            $table->id();
            /*
            |--------------------------------------------------------------------------
            | Expediente al que pertenece
            |--------------------------------------------------------------------------
            */
            $table->foreignId('expediente_id')
                ->constrained('expedientes')
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Información del documento
            |--------------------------------------------------------------------------
            */
            $table->string('tipo_documento', 100);

            $table->string('titulo');

            $table->text('descripcion')
                ->nullable();

            $table->date('fecha_documento')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Archivo físico
            |--------------------------------------------------------------------------
            |
            | El archivo NO se almacena dentro de MySQL.
            | Solamente guardamos aquí la información necesaria
            | para localizarlo y administrarlo.
            |
            */
            $table->string('archivo_path');

            $table->string('archivo_nombre');

            $table->string('archivo_nombre_original');

            $table->string('archivo_mime', 100);

            $table->unsignedBigInteger('archivo_size');

            /*
            |--------------------------------------------------------------------------
            | Orden dentro del expediente
            |--------------------------------------------------------------------------
            */
            $table->unsignedInteger('orden')
                ->default(1);

            /*
            |--------------------------------------------------------------------------
            | Observaciones
            |--------------------------------------------------------------------------
            */
            $table->text('observaciones')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Auditoría
            |--------------------------------------------------------------------------
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
            | Fechas
            |--------------------------------------------------------------------------
            */
            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Eliminación lógica
            |--------------------------------------------------------------------------
            */
            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Índices
            |--------------------------------------------------------------------------
            */
            $table->index([
                'expediente_id',
                'orden',
            ]);

            $table->index('tipo_documento');

            $table->index('fecha_documento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expediente_documentos');
    }
};
