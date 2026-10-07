<?php

namespace App\Http\Controllers;

use App\Models\Expediente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $totalExpedientes = Expediente::query()->count();

        $abiertos = Expediente::query()
            ->where('estado', 'abierto')
            ->count();

        $enProceso = Expediente::query()
            ->where('estado', 'en_proceso')
            ->count();

        $concluidos = Expediente::query()
            ->where('estado', 'concluido')
            ->count();

        $archivados = Expediente::query()
            ->where('estado', 'archivado')
            ->count();

        $expedientesRecientes = Expediente::query()
            ->with([
                'creator:id,name',
            ])
            ->latest()
            ->limit(8)
            ->get([
                'id',
                'numero_expediente',
                'titulo',
                'tipo_proceso',
                'gestion',
                'estado',
                'created_by',
                'created_at',
            ]);

        return Inertia::render('dashboard', [
            'estadisticas' => [
                'total' => $totalExpedientes,
                'abiertos' => $abiertos,
                'en_proceso' => $enProceso,
                'concluidos' => $concluidos,
                'archivados' => $archivados,
            ],

            'expedientesRecientes' => $expedientesRecientes,
        ]);
    }
}
