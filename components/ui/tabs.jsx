"use client"

import React, { useState, createContext, useContext } from "react"

const TabsContext = createContext()

function Tabs({ children, value: valueProp, defaultValue, onValueChange, className }) {
  const [value, setValue] = useState(defaultValue || null)
  const currentValue = valueProp !== undefined ? valueProp : value

  function handleValueChange(newValue) {
    if (onValueChange) {
      onValueChange(newValue)
    }
    if (valueProp === undefined) {
      setValue(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ children, className }) {
  return (
    <div role="tablist" className={className}>
      {children}
    </div>
  )
}

function TabsTrigger({ children, value, className }) {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component")
  }
  const { value: currentValue, onValueChange } = context
  const selected = currentValue === value

  return (
    <button
      role="tab"
      aria-selected={selected}
      className={`${className} ${selected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
      onClick={() => onValueChange(value)}
      type="button"
    >
      {children}
    </button>
  )
}

function TabsContent({ children, value, className }) {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component")
  }
  const { value: currentValue } = context

  if (currentValue !== value) {
    return null
  }

  return <div role="tabpanel" className={className}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
