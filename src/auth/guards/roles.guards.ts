import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    // Verifica si la ruta tiene la metadata "isPublic"
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true; // Permite el acceso si es público
    }
    


    
    
    
    // Obtenemos los roles requeridos de la metadata del decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Roles requeridos:', requiredRoles);

    // Si no se han definido roles, se permite el acceso
    if (!requiredRoles) return true;

    // Obtenemos el objeto 'user' del request
    const { user } = context.switchToHttp().getRequest();
    console.log('Usuario en request:', user);

    // Verificamos si el 'user' está presente y tiene la propiedad 'id_rol'
    if (!user || !user.rol) {
      throw new ForbiddenException('Acceso restringido. Usuario no autenticado o sin rol asignado.');
    }

    // Verificamos si el rol del usuario está en los roles permitidos
    if (!requiredRoles.some((rol) => user.rol === rol)) {
      throw new ForbiddenException('Acceso restringido. Permiso denegado.');
    }

    // Si todo está bien, permitimos el acceso
    return true;
  }
}