interface GithubUser {
  login: string
  avatar_url: string
  url: string
}

// Note the real event sent from Github is much larger,
// but here we only define the keys that we use
export interface GithubStarEvent {
  action: 'created' | 'deleted'
  starred_at: string | null
  repository: {
    full_name: string
    owner: GithubUser
    html_url: string
    description: string
    stargazers_count: number
  }
  sender: GithubUser
}
