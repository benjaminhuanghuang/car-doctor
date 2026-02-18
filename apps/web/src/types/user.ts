export interface User {
  email: string;
  profilePic?: string;
}

export type UserProfile = Partial<Pick<User, 'profilePic'>>;
