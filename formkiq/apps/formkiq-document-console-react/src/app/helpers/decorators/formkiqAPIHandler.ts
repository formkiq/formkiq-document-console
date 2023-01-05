import { logout } from "../../Store/reducers/auth";
import { store } from "../../Store/store";



export function formkiqAPIHandler(target: Object, method: string, descriptor: PropertyDescriptor){
    let originalMethod = descriptor.value;
    descriptor.value = function(...args: any){
        let returnValue = originalMethod.apply(this, args);
        if(returnValue?.then){
            return returnValue.then((val: any) => {
                if(val?.message === 'Unauthorized') {
                    store.dispatch(logout())
                    window.location.reload()
                }
                return val
            })
        }
        return returnValue;
    }
}