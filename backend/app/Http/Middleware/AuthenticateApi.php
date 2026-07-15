<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;

/**
 * Custom Authenticate middleware for API routes that doesn't attempt
 * to redirect to a login page on authentication failure.
 */
class AuthenticateApi extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests, don't redirect - let the exception handler return 401 JSON
        if ($request->is('api/*')) {
            return null;
        }

        return route('login');
    }

    /**
     * Handle an unauthenticated user.
     */
    protected function unauthenticated($request, array $guards): void
    {
        // Throw AuthenticationException without trying to redirect
        throw new AuthenticationException(
            'Unauthenticated.',
            $guards,
            null // No redirect URL
        );
    }
}