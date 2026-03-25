declare namespace google.accounts.oauth2 {
  interface TokenClient {
    requestAccessToken(options?: { prompt?: string }): void
  }
  interface TokenResponse {
    access_token: string
    expires_in: number
    error?: string
  }
  function initTokenClient(config: {
    client_id: string
    scope: string
    callback: (resp: TokenResponse) => void
    error_callback?: (err: { type: string }) => void
  }): TokenClient
}
