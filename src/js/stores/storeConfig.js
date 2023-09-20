// Initialize store classes
import Aritzia from "./aritzia.js";
import Primitiveskate from "./Primitiveskate.js";
import Simons from "./Simons.js";

export function initializeStoreClasses() {
    return {
        aritzia: Aritzia,
        primitiveskate:Primitiveskate,
        simons:Simons,
        // add more stores here
    };

}

const allFunctions = {
    initializeStoreClasses
};

export default allFunctions;