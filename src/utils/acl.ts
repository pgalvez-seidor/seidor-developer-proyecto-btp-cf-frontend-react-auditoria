// src/utils/acl.ts

export type AclItem = {
  label: string;
  path: string; // p.ej. "/repuestos" o "/finanzas/reporte-transmision-facturacion"
  roles: string[];
  children?: AclItem[];
  principal?: boolean;
  nav?: boolean;
};

/** Aplana tu JSON de menús a pares path → roles */
export function flattenAcl(items: AclItem[]): Record<string, Set<string>> {
  const map: Record<string, Set<string>> = {};

  const walk = (node: AclItem) => {
    if (node.path && node.roles?.length) {
      if (!map[node.path]) map[node.path] = new Set<string>();
      node.roles.forEach(r => map[node.path].add(r));
    }
    node.children?.forEach(walk);
  };

  items.forEach(walk);
  return map;
}

/** ¿El usuario tiene al menos un rol requerido? */
export function hasAnyRole(userRoles: string[] | string, required: Set<string>): boolean {
  const list = Array.isArray(userRoles) ? userRoles : userRoles ? [userRoles] : [];
  for (const r of list) if (required.has(r)) return true;
  return false;
}

/**
 * Busca el primer patrón configurado que haga match con la location actual.
 * Usa matchPath para soportar rutas anidadas del tipo "/finanzas/*" si las agregas.
 */
export function findMatchingPattern(
  pathname: string,
  aclMap: Record<string, Set<string>>,
): { pattern: string; roles: Set<string> } | null {
  // Estrategia: buscar el path exacto y, si no, probar prefijos relevantes.
  // Orden: más largo → más específico.
  const patterns = Object.keys(aclMap).sort((a, b) => b.length - a.length);

  for (const pattern of patterns) {
    // Coincidencia exacta
    if (pathname === pattern) return { pattern, roles: aclMap[pattern] };

    // Coincidencia por prefijo de sección (permite proteger todo bajo una sección)
    // Ej: patrón "/repuestos" protege "/repuestos/crear-pedido-de-venta-v2"
    if (pathname.startsWith(pattern.endsWith('/') ? pattern : pattern + '/')) {
      return { pattern, roles: aclMap[pattern] };
    }

    // Si en el futuro defines patrones con comodines, matchPath te ayuda:
    // if (matchPath({ path: pattern, end: false }, pathname)) return { pattern, roles: aclMap[pattern] };
  }
  return null;
}
