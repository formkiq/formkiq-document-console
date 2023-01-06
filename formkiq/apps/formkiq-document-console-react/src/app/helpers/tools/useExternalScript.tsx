import { useEffect, useState } from "react";
export const useExternalScript = (url: string) => {
  const [state, setState] = useState(url ? "loading" : "idle");
  
  useEffect(() => {
    if (!url) {
      setState("idle");
      return;
     }
    let script = document.querySelector(`script[src="${url}"]`);
    
    const handleScript = (e: Event) => {
      setState(e.type === "load" ? "ready" : "error");
    };
    
    if (!script) {
      script = document.createElement("script");
      (script as HTMLScriptElement).type = "application/javascript";
      (script as HTMLScriptElement).src = url;
      (script as HTMLScriptElement).async = true;
      document.body.appendChild(script);
      script.addEventListener("load", handleScript);
      script.addEventListener("error", handleScript);
    }
   
   script.addEventListener("load", handleScript);
   script.addEventListener("error", handleScript);
   
   return () => {
    (script as HTMLScriptElement).removeEventListener("load", handleScript);
    (script as HTMLScriptElement).removeEventListener("error", handleScript);
   };
  }, [url]);
  
  return state;
};