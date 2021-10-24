import React from 'react'

export const ErrorBoundaryFallback = ({error}) => {
    return (
        <span>{`An error was catch by the error boundary ${error}`}</span>
    )
}