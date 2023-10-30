import { useEffect } from "react"

type SetActiveLinkFunction = (link: string) => void;

export const useNavigateHome = (location:string, setActiveLink: SetActiveLinkFunction) => {
    useEffect(() => {
        if(location === "/") {
          setActiveLink("/")
        }
      },[location, setActiveLink])
}