import { AbstractControl } from "@angular/forms"
import { Observable } from "rxjs";

//if null is returned that means that it is valid!!
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer: Observer) => {
        fileReader.addEventListener("loadend", () => {
            
        });
        fileReader.readAsArrayBuffer(file);
    });
    // const frObs = new Observable();
};