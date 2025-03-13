/**
 * @vitest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useSearchProfiles, useProfile } from '@/hooks/useGithub'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('useSearchProfiles', () => {
  beforeEach(() => {
    // Setup fetch mock
    vi.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          items: [{id: 1, login: 'test-user'}],
          total_count: 1
        })
      }) as Promise<Response>
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return search results when given a query', async () => {
    const { result } = renderHook(() => useSearchProfiles({ query: 'test' }))
    
    // Initial state
    expect(result.current.isLoading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.users.length).toBe(1)
    expect(result.current.users[0].login).toBe('test-user')
  })

  it('should handle API errors', async () => {
    // Override the mock for this test
    vi.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 404
      }) as Promise<Response>
    })
    
    const { result } = renderHook(() => useSearchProfiles({ query: 'test' }))
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.error).toBeDefined()
  })
})

describe('useProfile', () => {
  beforeEach(() => {
    // Setup fetch mock for all the API calls that useProfile makes
    vi.spyOn(global, 'fetch').mockImplementation((url: string | URL | Request) => {
      const urlString = url.toString();
      
      // Mock user profile endpoint
      if (urlString.includes('/users/testuser') && !urlString.includes('/repos') && !urlString.includes('/events')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            login: 'testuser',
            id: 12345,
            name: 'Test User',
            avatar_url: 'https://example.com/avatar.png',
            bio: 'Test bio',
            company: '@test-company',
            location: 'Test Location',
            email: 'test@example.com',
            blog: 'https://test.com',
            followers: 100,
            following: 50,
            public_repos: 30,
            public_gists: 10,
            html_url: 'https://github.com/testuser',
            created_at: '2020-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          })
        }) as Promise<Response>
      } 
      // Mock repositories endpoint
      else if (urlString.includes('/users/testuser/repos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              name: 'test-repo',
              full_name: 'testuser/test-repo',
              html_url: 'https://github.com/testuser/test-repo',
              description: 'Test repository',
              fork: false,
              created_at: '2022-01-01T00:00:00Z',
              updated_at: '2023-01-01T00:00:00Z',
              pushed_at: '2023-01-01T00:00:00Z',
              stargazers_count: 50,
              watchers_count: 5,
              language: 'TypeScript',
              forks_count: 10,
              open_issues_count: 2,
              topics: ['test', 'typescript']
            }
          ])
        }) as Promise<Response>
      } 
      // Mock events endpoint for commit count
      else if (urlString.includes('/users/testuser/events')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              type: 'PushEvent',
              payload: {
                commits: [
                  { sha: 'abc123' },
                  { sha: 'def456' }
                ]
              }
            }
          ])
        }) as Promise<Response>
      } 
      // Mock PRs endpoint
      else if (urlString.includes('search/issues') && urlString.includes('type:pr')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            total_count: 25
          })
        }) as Promise<Response>
      } 
      // Mock issues endpoint
      else if (urlString.includes('search/issues') && urlString.includes('type:issue')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            total_count: 15
          })
        }) as Promise<Response>
      }
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      }) as Promise<Response>
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch and return profile data with repositories and stats', async () => {
    const { result } = renderHook(() => useProfile('testuser'))
    
    // Initial state
    expect(result.current.isLoading).toBe(true)
    
    // Wait for all API calls to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    // Check profile data
    expect(result.current.profile).toBeDefined()
    expect(result.current.profile?.login).toBe('testuser')
    expect(result.current.profile?.name).toBe('Test User')
    
    // Check repositories
    expect(result.current.repositories).toHaveLength(1)
    expect(result.current.repositories[0].name).toBe('test-repo')
    
    // Check calculated stats
    expect(result.current.profile?.totalStars).toBe(50)
    expect(result.current.profile?.totalCommits).toBe(2)
    expect(result.current.profile?.totalPRs).toBe(25)
    expect(result.current.profile?.totalIssues).toBe(15)
  })

  it('should handle API errors', async () => {
    // Override the mock for this test to simulate an error
    vi.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 404
      }) as Promise<Response>
    })
    
    const { result } = renderHook(() => useProfile('nonexistentuser'))
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.error).toBeDefined()
    expect(result.current.profile).toBeUndefined()
  })

  it('should not fetch data if username is empty', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    
    renderHook(() => useProfile(''))
    
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})