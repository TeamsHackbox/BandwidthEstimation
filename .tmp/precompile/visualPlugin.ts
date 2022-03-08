import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;

var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var bandwidthCalculationF355FE6363AD4C338B38860138152B90: IVisualPlugin = {
    name: 'bandwidthCalculationF355FE6363AD4C338B38860138152B90',
    displayName: 'Bandwidth Estimation Visual',
    class: 'Visual',
    apiVersion: '3.2.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["bandwidthCalculationF355FE6363AD4C338B38860138152B90"] = bandwidthCalculationF355FE6363AD4C338B38860138152B90;
}
export default bandwidthCalculationF355FE6363AD4C338B38860138152B90;