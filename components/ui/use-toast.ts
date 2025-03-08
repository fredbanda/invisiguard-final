/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [x: string]: any
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

// const actionTypes = {
//   ADD_TOAST: "ADD_TOAST",
//   UPDATE_TOAST: "UPDATE_TOAST",
//   DISMISS_TOAST: "DISMISS_TOAST",
//   REMOVE_TOAST: "REMOVE_TOAST",
// } as const

let count = 0

function generateId() {
  return `${count++}`
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === toastId || toastId === undefined
          ? {
              ...toast,
              open: false,
            }
          : toast,
      ),
    )
  }, [])

  const remove = useCallback((toastId?: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }, [])

  const update = useCallback((props: ToastProps) => {
    setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === props.id ? { ...toast, ...props } : toast)))
  }, [])

  const add = useCallback((props: Omit<ToastProps, "id">) => {
    const id = generateId()
    const newToast = { id, ...props, open: true }

    setToasts((prevToasts) => {
      const updatedToasts = [...prevToasts, newToast].slice(-TOAST_LIMIT)
      return updatedToasts
    })

    return id
  }, [])

  const toast = useCallback(
    (props: Omit<ToastProps, "id">) => {
      return add(props)
    },
    [add],
  )

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    // biome-ignore lint/complexity/noForEach: <explanation>
    toasts.forEach((toast) => {
      if (!toast.open) {
        const timeout = setTimeout(() => {
          remove(toast.id)
        }, TOAST_REMOVE_DELAY)

        timeouts.push(timeout)
      }
    })

    return () => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [toasts, remove])

  return {
    toasts,
    toast,
    dismiss,
    remove,
    update,
  }
}

export const toast = {
  // Simple function to show a toast
  // This is used when we don't have access to the hook
  show: (props: Omit<ToastProps, "id">) => {
    // This is a simplified version that doesn't actually work
    // but allows us to call toast.show() without errors
    console.log("Toast:", props)
  },
}

