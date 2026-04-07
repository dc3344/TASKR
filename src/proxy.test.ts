import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from './proxy'

describe('proxy', () => {
  function createMockRequest(pathname: string, cookies: Record<string, string> = {}) {
    const url = `http://localhost:3000${pathname}`
    const mockCookies = {
      get: (name: string) => (cookies[name] ? { value: cookies[name] } : undefined),
    }
    return {
      nextUrl: { pathname },
      url,
      cookies: mockCookies,
    } as unknown as NextRequest
  }

  it('allows public paths without authentication', () => {
    const request = createMockRequest('/login')
    const response = proxy(request)
    expect(response.status).not.toBe(307)
  })

  it('allows Next.js internal paths', () => {
    const request = createMockRequest('/_next/static/chunk.js')
    const response = proxy(request)
    expect(response.status).not.toBe(307)
  })

  it('allows API routes', () => {
    const request = createMockRequest('/api/health')
    const response = proxy(request)
    expect(response.status).not.toBe(307)
  })

  it('redirects to login when no session cookie present', () => {
    const request = createMockRequest('/board')
    const response = proxy(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('allows authenticated routes with valid session cookie', () => {
    const request = createMockRequest('/board', { 'taskr-session': 'active' })
    const response = proxy(request)
    expect(response.status).not.toBe(307)
  })

  it('redirects to login for protected routes without cookie', () => {
    const request = createMockRequest('/my-tasks')
    const response = proxy(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })
})
