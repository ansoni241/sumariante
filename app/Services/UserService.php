<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Hash;

use App\Events\Users\UserCreated;
use App\Events\Users\UserUpdated;
use App\Events\Users\UserDeleted;

class UserService
{

    /**
     * Determina si el usuario corresponde a la cuenta
     * principal del sistema (Developer).
     */
    private function isDeveloperAccount(User $user): bool
    {
        return $user->email === config('app.developer.email');
    }

    /**
     * Crear un usuario.
     */
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $role = $data['role'] ?? null;

            unset($data['role']);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                // 'password' => Hash::make($data['password']),
                'password' => $data['password'],
                'status' => $data['status'],
            ]);

            if ($role) {
                $user->assignRole($role);
            }
            $user->load('roles');
            event(new UserCreated($user));
            return $user;
        });
    }

    /**
     * Actualizar un usuario.
     */
    // public function update(User $user, array $data): User
    // {
    //     return DB::transaction(function () use ($user, $data) {
    //         $role = $data['role'] ?? null;

    //         unset($data['role']);

    //          /*
    //         |--------------------------------------------------------------------------
    //         | Protección de la cuenta Developer
    //         |--------------------------------------------------------------------------
    //         |
    //         | La cuenta principal puede actualizar otros datos permitidos,
    //         | pero JAMÁS puede cambiar su rol.
    //         |
    //         |--------------------------------------------------------------------------
    //         */

    //         if ($this->isDeveloperAccount($user)) {
    //             if ($role !== null) {
    //                 /*
    //                  * No permitimos que una petición externa pueda
    //                  * cambiar el rol de la cuenta principal.
    //                  */
    //                 unset($role);
    //             }
    //         }

    //         if (empty($data['password'])) {
    //             unset($data['password']);
    //         } else {
    //             $data['password'] = $data['password'];
    //         }

    //         $user->update($data);


    //         /*
    //         |--------------------------------------------------------------------------
    //         | Sincronizar rol
    //         |--------------------------------------------------------------------------
    //         |
    //         | Solamente usuarios que NO sean la cuenta Developer
    //         | pueden cambiar de rol.
    //         |
    //         |--------------------------------------------------------------------------
    //         */

    //         if (!$this->isDeveloperAccount($user)) {
    //             if ($role !== null) {
    //                 $user->syncRoles([$role]);
    //             }
    //         } else {
    //             /*
    //              * Garantizamos que la cuenta principal conserve
    //              * siempre el rol Developer.
    //              */
    //             $user->syncRoles(['Developer']);
    //         }

    //         // if ($role !== null) {
    //         //     $user->syncRoles([$role]);
    //         // }

    //         $user = $user->fresh()->load('roles');

    //         event(new UserUpdated($user));

    //         return $user;
    //     });
    // }
    public function update(User $user, array $data): User
    {
        /*
    |--------------------------------------------------------------------------
    | Protección absoluta de la cuenta Developer
    |--------------------------------------------------------------------------
    */

        if ($this->isDeveloperAccount($user)) {
            throw new \RuntimeException(
                'La cuenta principal Developer no puede ser modificada.'
            );
        }

        return DB::transaction(function () use ($user, $data) {
            $role = $data['role'] ?? null;

            unset($data['role']);

            /*
        |--------------------------------------------------------------------------
        | Contraseña
        |--------------------------------------------------------------------------
        */

            if (empty($data['password'])) {
                unset($data['password']);
            } else {
                $data['password'] = \Illuminate\Support\Facades\Hash::make(
                    $data['password']
                );
            }

            /*
        |--------------------------------------------------------------------------
        | Actualizar usuario
        |--------------------------------------------------------------------------
        */

            $user->update($data);

            /*
        |--------------------------------------------------------------------------
        | Actualizar rol
        |--------------------------------------------------------------------------
        */

            if ($role !== null) {
                $user->syncRoles([$role]);
            }

            $user = $user->fresh()->load('roles');

            event(new UserUpdated($user));

            return $user;
        });
    }

    /**
     * Cambiar el estado de un usuario.
     */
    public function changeStatus(User $user, string $status): User
    {
        $user->update([
            'status' => $status,
        ]);

        return $user->fresh();
    }

    /**
     * Eliminar un usuario.
     */
    // public function delete(User $user): void
    // {
    //     DB::transaction(function () use ($user) {
    //         $user->syncRoles([]);

    //         $user->delete();
    //     });
    // }
    public function delete(User $user): void
    {
        DB::transaction(function () use ($user) {
            $userId = $user->id;

            $user->syncRoles([]);

            $user->delete();

            event(new UserDeleted($userId));
        });
    }
}
