<?php

namespace App\Http\Requests\Admin\Expediente;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExpedienteDocumentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'documento' => [
                'required',
                'file',
                'mimes:pdf',
                'max:51200',
            ],
            'documento_tipo' => [
                'required',
                'string',
                'max:100',
            ],
            'documento_titulo' => [
                'required',
                'string',
                'max:255',
            ],
            'documento_descripcion' => [
                'nullable',
                'string',
            ],
            'documento_fecha' => [
                'nullable',
                'date',
            ],
            'documento_observaciones' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'documento.required' => 'Debe seleccionar un documento PDF.',
            'documento.file' => 'El documento seleccionado no es válido.',
            'documento.mimes' => 'El documento debe estar en formato PDF.',
            'documento.max' => 'El documento no puede superar los 50 MB.',
            'documento_tipo.required' => 'El tipo de documento es obligatorio.',
            'documento_tipo.max' => 'El tipo de documento no puede superar los 100 caracteres.',
            'documento_titulo.required' => 'El título del documento es obligatorio.',
            'documento_titulo.max' => 'El título del documento no puede superar los 255 caracteres.',
            'documento_fecha.date' => 'La fecha del documento no es válida.',
        ];
    }
}
