// import { createInertiaApp, router } from '@inertiajs/react';
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// import { Toaster } from '@/components/ui/sonner';
// import { TooltipProvider } from '@/components/ui/tooltip';
// import { initializeTheme } from '@/hooks/use-appearance';
// import AppLayout from '@/layouts/app-layout';
// import AuthLayout from '@/layouts/auth-layout';
// import SettingsLayout from '@/layouts/settings/layout';

// import { toast } from 'sonner';

// const appName =
//     import.meta.env.VITE_APP_NAME || 'Laravel';

// /**
//  * Laravel Echo + Reverb
//  *
//  * Pusher es requerido por Laravel Echo para
//  * establecer la conexión WebSocket con Reverb.
//  */
// window.Pusher = Pusher;

// window.Echo = new Echo({

//     broadcaster: 'reverb',

//     key: import.meta.env.VITE_REVERB_APP_KEY,

//     wsHost:
//         import.meta.env.VITE_REVERB_HOST ||
//         '127.0.0.1',

//     wsPort: Number(
//         import.meta.env.VITE_REVERB_PORT || 8080,
//     ),

//     wssPort: Number(
//         import.meta.env.VITE_REVERB_PORT || 8080,
//     ),

//     forceTLS:
//         (import.meta.env.VITE_REVERB_SCHEME ||
//             'http') === 'https',

//     enabledTransports: ['ws', 'wss'],
// });

// router.on('success', (event) => {
//     const flash = event.detail.page.props.flash as {
//         success?: string | null;
//         error?: string | null;
//     };

//     if (flash?.success) {
//         toast.success(flash.success, {
//             id: flash.success,
//         });
//     }
//     if (flash?.error) {
//         toast.error(flash.error, {
//             id: `error-${flash.error}`,
//         });
//     }
// });

// createInertiaApp({
//     title: (title) =>
//         title
//             ? `${title} - ${appName}`
//             : appName,

//     layout: (name) => {
//         switch (true) {
//             case name === 'welcome':
//                 return null;

//             case name.startsWith('auth/'):
//                 return AuthLayout;

//             case name.startsWith('settings/'):
//                 return [AppLayout, SettingsLayout];

//             default:
//                 return AppLayout;
//         }
//     },

//     strictMode: true,

//     withApp(app) {
//         return (
//             <>
//                 <TooltipProvider>
//                     {app}
//                 </TooltipProvider>

//                 <Toaster />
//             </>
//         );
//     },

//     progress: {
//         color: '#4B5563',
//     },
// });

// // Configurar tema claro/oscuro
// initializeTheme();
import { createInertiaApp, router } from '@inertiajs/react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

import { toast } from 'sonner';

const appName =
    import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Laravel Echo + Reverb
 *
 * Echo y Pusher necesitan ejecutarse únicamente
 * en el navegador porque utilizan window/WebSocket.
 *
 * Durante SSR la aplicación se ejecuta en Node.js,
 * donde window no existe.
 */
if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    window.Echo = new Echo({
        broadcaster: 'reverb',

        key: import.meta.env.VITE_REVERB_APP_KEY,

        wsHost:
            import.meta.env.VITE_REVERB_HOST ||
            '127.0.0.1',

        wsPort: Number(
            import.meta.env.VITE_REVERB_PORT || 8080,
        ),

        wssPort: Number(
            import.meta.env.VITE_REVERB_PORT || 8080,
        ),

        forceTLS:
            (import.meta.env.VITE_REVERB_SCHEME ||
                'http') === 'https',

        enabledTransports: ['ws', 'wss'],
    });
}

/**
 * Flash messages de Laravel/Inertia
 *
 * Este listener puede registrarse durante SSR porque
 * no accede directamente a window.
 */
router.on('success', (event) => {
    const flash = event.detail.page.props.flash as {
        success?: string | null;
        error?: string | null;
    };

    if (flash?.success) {
        toast.success(flash.success, {
            id: flash.success,
        });
    }

    if (flash?.error) {
        toast.error(flash.error, {
            id: `error-${flash.error}`,
        });
    }
});

createInertiaApp({
    title: (title) =>
        title
            ? `${title} - ${appName}`
            : appName,

    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;

            case name.startsWith('auth/'):
                return AuthLayout;

            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <>
                <TooltipProvider>
                    {app}
                </TooltipProvider>

                <Toaster />
            </>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

// Configurar tema claro/oscuro
initializeTheme();
