/**
 * Public user shape returned by the API (never includes the password hash).
 */
export interface User {
  email: string;
  profilePic?: string;
}

export type UserProfile = Partial<Pick<User, 'profilePic'>>;
