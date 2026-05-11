package com.fcbpo.workforce.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Obtener Authorization header
        final String authHeader = request.getHeader("Authorization");

        // 2. Validar si existe Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraer token
        String jwt = authHeader.substring(7);

        // 4. Extraer username/email
        String userEmail = jwtService.extractUsername(jwt);

        // 5. Validar si el usuario aún no está autenticado
        if (userEmail != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // 6. Buscar usuario en BD
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(userEmail);

            // 7. Validar token
            if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {

                // 8. Crear Authentication object
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // 9. Agregar detalles del request
                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // 10. Registrar usuario autenticado
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        // 11. Continuar request
        filterChain.doFilter(request, response);
    }
}