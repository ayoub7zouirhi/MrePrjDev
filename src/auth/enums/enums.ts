import { registerEnumType } from "@nestjs/graphql";

export enum Role {
  ADMIN = 'ADMIN',
  RESPONSABLE = 'RESPONSABLE',
  AGENT = 'AGENT',
}

registerEnumType(Role, {
  name: 'Role', 
});