import { useEffect, useState } from "react";

// this function basically checks if value exists and if change it update it.

// give it a generic type
// type either type t or function as state can pass either an intial value or a function to set state
export function useLocalStorage<T>(key:string, intialValue: T | (()=> T)) {
  // use function version of usestate to check if value is in localStorage
  const [value, setValue] = useState<T>(()=>{
    const jsonValue = localStorage.getItem(key)
    if(jsonValue === null ){
      if (typeof intialValue === "function") {
        //call funciton version intial value is that type.
        return (intialValue as ()=> T)()
      } else {
        return intialValue
      }
    } else {
      return JSON.parse(jsonValue)
    }
  })

  // useEffect to save data in local storage if value or key changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value,key])



  // ensuring it is clear the first value or array is type of T and second is whatever type of SetValue is.
  return [value, setValue] as [T, typeof setValue]
}
