export interface SessionUser<TRole extends string = string> {
  id: string;
  email: string;
  name?: string;
  role: TRole;
}
