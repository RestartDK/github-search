export interface UserData {
  id: number;
  login: string;
  nodeId?: string;
  avatarUrl: string;
  gravatarId?: string;
  url: string;
  htmlUrl: string;
  followersUrl: string;
  followingUrl: string;
  gistsUrl: string;
  starredUrl: string;
  subscriptionsUrl: string;
  organizationsUrl: string;
  reposUrl: string;
  eventsUrl: string;
  receivedEventsUrl: string;
  type: string;
  userViewType?: string;
  siteAdmin: boolean;
  score: number;
}

export interface SearchProfilesResponse {
  totalCount: number;
  incompleteResults: boolean;
  items: UserData[];
}

export interface Profile {
  login: string;
  id: number;
  avatarUrl: string;
  htmlUrl: string;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitterUsername: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  fork: boolean;
  stargazersCount: number;
  watchersCount: number;
  language: string | null;
  forksCount: number;
  openIssuesCount: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
}

export interface GithubStats {
  totalCommits?: number;
  totalPRs?: number;
  totalIssues?: number;
  totalStars?: number;
}

export interface UseProfileResult {
  profile?: Profile;
  repositories: Repository[];
  stats: GithubStats;
  isLoading: boolean;
  error?: Error;
}
