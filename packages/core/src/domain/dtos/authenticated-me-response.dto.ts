export interface AuthenticatedMeResponse {
  authenticated?: boolean;
  session?: {
    userId: string;
    email: string;
    fullName: string;
  };
}
