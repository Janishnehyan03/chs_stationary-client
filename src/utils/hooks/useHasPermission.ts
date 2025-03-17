// hooks/usePermissions.ts
import { useUserContext } from "../../context/userContext";

export const useHasPermission = (permission: string) => {
  const { user } = useUserContext();
  return user?.permissions?.some((p) => p.permissionTitle === permission);
};
