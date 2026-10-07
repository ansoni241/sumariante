<?php

use App\Http\Controllers\Admin\Expediente\ExpedienteController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// use App\Events\UserPresenceUpdated;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\DashboardController;

// use Illuminate\Support\Facades\Mail;

// Route::inertia('/', 'welcome')->name('home');
Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)
        ->name('dashboard');

    // Rutas para la gestión de usuarios
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:users.view')
        ->name('users.index');

    Route::get('/users/create', [UserController::class, 'create'])
        ->middleware('permission:users.create')
        ->name('users.create');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:users.create')
        ->name('users.store');

    Route::get('/users/{user}', [UserController::class, 'show'])
        ->middleware('permission:users.view')
        ->name('users.show');

    Route::get('/users/{user}/edit', [UserController::class, 'edit'])
        ->middleware('permission:users.edit')
        ->name('users.edit');

    Route::put('/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:users.edit')
        ->name('users.update');

    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->middleware('permission:users.delete')
        ->name('users.destroy');

    // Rutas para la gestión de roles
    Route::get('/roles', [RoleController::class, 'index'])
        ->middleware('permission:roles.view')
        ->name('roles.index');

    Route::get('/roles/create', [RoleController::class, 'create'])
        ->middleware('permission:roles.create')
        ->name('roles.create');

    Route::post('/roles', [RoleController::class, 'store'])
        ->middleware('permission:roles.create')
        ->name('roles.store');

    Route::get('/roles/{role}', [RoleController::class, 'show'])
        ->middleware('permission:roles.view')
        ->name('roles.show');

    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])
        ->middleware('permission:roles.edit')
        ->name('roles.edit');

    Route::put('/roles/{role}', [RoleController::class, 'update'])
        ->middleware('permission:roles.edit')
        ->name('roles.update');

    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])
        ->middleware('permission:roles.delete')
        ->name('roles.destroy');

    // Rutas para la gestión de expedientes
    // Route::resource('expedientes', ExpedienteController::class);
    // Route::get(
    //     'expedientes/{expediente}/documentos/{documento}/ver',
    //     [ExpedienteController::class, 'verDocumento']
    // )->name('expedientes.documentos.ver');

    // Route::get(
    //     'expedientes/{expediente}/documentos/{documento}/descargar',
    //     [ExpedienteController::class, 'descargarDocumento']
    // )->name('expedientes.documentos.descargar');

    // Route::post(
    //     'expedientes/{expediente}/documentos',
    //     [ExpedienteController::class, 'agregarDocumento']
    // )->name('expedientes.documentos.store');
    // =========================================================
    // RUTAS PARA LA GESTIÓN DE EXPEDIENTES
    // =========================================================

    Route::get('/expedientes', [ExpedienteController::class, 'index'])
        ->middleware('permission:expedientes.view')
        ->name('expedientes.index');

    Route::get('/expedientes/create', [ExpedienteController::class, 'create'])
        ->middleware('permission:expedientes.create')
        ->name('expedientes.create');

    Route::post('/expedientes', [ExpedienteController::class, 'store'])
        ->middleware('permission:expedientes.create')
        ->name('expedientes.store');

    Route::get('/expedientes/{expediente}', [ExpedienteController::class, 'show'])
        ->middleware('permission:expedientes.view')
        ->name('expedientes.show');

    Route::get('/expedientes/{expediente}/edit', [ExpedienteController::class, 'edit'])
        ->middleware('permission:expedientes.edit')
        ->name('expedientes.edit');

    Route::put('/expedientes/{expediente}', [ExpedienteController::class, 'update'])
        ->middleware('permission:expedientes.edit')
        ->name('expedientes.update');

    Route::delete('/expedientes/{expediente}', [ExpedienteController::class, 'destroy'])
        ->middleware('permission:expedientes.delete')
        ->name('expedientes.destroy');


    // =========================================================
    // RUTAS PARA LOS DOCUMENTOS DE LOS EXPEDIENTES
    // =========================================================

    Route::get(
        '/expedientes/{expediente}/documentos/{documento}/ver',
        [ExpedienteController::class, 'verDocumento']
    )
        ->middleware('permission:expedientes.documentos.view')
        ->name('expedientes.documentos.ver');

    Route::get(
        '/expedientes/{expediente}/documentos/{documento}/descargar',
        [ExpedienteController::class, 'descargarDocumento']
    )
        ->middleware('permission:expedientes.documentos.view')
        ->name('expedientes.documentos.descargar');

    Route::post(
        '/expedientes/{expediente}/documentos',
        [ExpedienteController::class, 'agregarDocumento']
    )
        ->middleware('permission:expedientes.documentos.create')
        ->name('expedientes.documentos.store');
});

require __DIR__ . '/settings.php';
