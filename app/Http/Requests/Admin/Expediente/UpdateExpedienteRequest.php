<?php

namespace App\Http\Requests\Admin\Expediente;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExpedienteRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación.
     */
    public function rules(): array
    {
        $expediente = $this->route('expediente');

        return [
            /*
            |--------------------------------------------------------------------------
            | Datos del expediente
            |--------------------------------------------------------------------------
            */

            'numero_expediente' => [
                'required',
                'string',
                'max:100',
                Rule::unique('expedientes', 'numero_expediente')
                    ->ignore($expediente),
            ],

            'titulo' => [
                'required',
                'string',
                'max:255',
            ],

            'tipo_proceso' => [
                'nullable',
                'string',
                'max:100',
            ],

            'gestion' => [
                'nullable',
                'digits:4',
            ],

            'fecha_inicio' => [
                'nullable',
                'date',
            ],

            'fecha_cierre' => [
                'nullable',
                'date',
                'after_or_equal:fecha_inicio',
            ],

            'estado' => [
                'required',
                Rule::in([
                    'abierto',
                    'en_proceso',
                    'concluido',
                    'archivado',
                ]),
            ],

            'descripcion' => [
                'nullable',
                'string',
            ],

            'observaciones' => [
                'nullable',
                'string',
            ],
        ];
    }

    /**
     * Mensajes personalizados.
     */
    public function messages(): array
    {
        return [
            'numero_expediente.required' =>
                'El número de expediente es obligatorio.',

            'numero_expediente.unique' =>
                'El número de expediente ya existe.',

            'titulo.required' =>
                'El título del expediente es obligatorio.',

            'gestion.digits' =>
                'La gestión debe tener 4 dígitos.',

            'fecha_cierre.after_or_equal' =>
                'La fecha de cierre no puede ser anterior a la fecha de inicio.',

            'estado.in' =>
                'El estado seleccionado no es válido.',
        ];
    }
}
