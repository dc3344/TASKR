'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface PinPadProps {
  onComplete: (pin: string) => void
  disabled: boolean
  error: string | null
}

const PIN_LENGTH = 6

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['backspace', '0', 'submit'],
]

export function PinPad({ onComplete, disabled, error }: PinPadProps) {
  const [pin, setPin] = useState('')
  const pinRef = useRef(pin)

  useEffect(() => {
    pinRef.current = pin
  }, [pin])

  const handleKeyPress = useCallback(
    (key: string) => {
      if (disabled) return

      if (key === 'backspace') {
        setPin((prev) => prev.slice(0, -1))
        return
      }

      if (key === 'submit') {
        setPin((prev) => {
          if (prev.length === PIN_LENGTH) {
            onComplete(prev)
          }
          return prev
        })
        return
      }

      setPin((prev) => {
        if (prev.length >= PIN_LENGTH) return prev
        const next = prev + key
        return next
      })
    },
    [disabled, onComplete]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        handleKeyPress(e.key)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        handleKeyPress('backspace')
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleKeyPress('submit')
      }
    },
    [disabled, handleKeyPress]
  )

  return (
    <div className="flex flex-col items-center gap-6" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex gap-2" aria-label={`PIN entry, ${pin.length} of ${PIN_LENGTH} digits entered`}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 transition-colors ${
              i < pin.length
                ? error
                  ? 'bg-error'
                  : 'bg-accent'
                : 'bg-surface-highest'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div
        className="grid grid-cols-3 gap-2"
        role="group"
        aria-label="PIN keypad"
      >
        {KEYS.flat().map((key) => {
          if (key === 'backspace') {
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress('backspace')}
                disabled={disabled || pin.length === 0}
                className="flex h-14 w-14 items-center justify-center bg-surface-high text-text-secondary transition-colors hover:bg-surface-highest disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Delete last digit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              </button>
            )
          }

          if (key === 'submit') {
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress('submit')}
                disabled={disabled || pin.length !== PIN_LENGTH}
                className="flex h-14 w-14 items-center justify-center bg-accent/20 text-accent transition-colors hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Submit PIN"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )
          }

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled || pin.length >= PIN_LENGTH}
              className="flex h-14 w-14 items-center justify-center bg-surface text-lg font-mono text-text-primary transition-colors hover:bg-surface-high disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label={`Digit ${key}`}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
