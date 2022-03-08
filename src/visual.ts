/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import DataViewTable = powerbi.DataViewTable;
import DataViewTableRow = powerbi.DataViewTableRow;
import PrimitiveValue = powerbi.PrimitiveValue;
import { VisualSettings } from "./settings";
import { precisionRound } from "d3";


export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;
    private host: IVisualHost;
    private table: HTMLParagraphElement;

    constructor(options: VisualConstructorOptions) {
        // constructor body
        this.target = options.element;
        this.host = options.host;
        this.table = document.createElement("table");
        this.target.appendChild(this.table);
        // ...
    }

    public update(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0];
        const tableDataView: DataViewTable = dataView.table;
        var DateIndex: number
        var HourIndex: number
        var MediaTypeIndex: number
        var MaxCountIndex: number
        

        if (!tableDataView) {
            return
        }
        while(this.table.firstChild) {
            this.table.removeChild(this.table.firstChild);
        }
        var i=0
        //draw header
        tableDataView.columns.forEach((column: DataViewMetadataColumn) => {
            console.log(column.queryName)
            if (column.queryName.toString() == "CQD.Date") {
                DateIndex=i
                console.log(DateIndex)
            }
            if (column.queryName.toString() == "CQD.Hour") {
                HourIndex=i
                console.log(HourIndex)
            }
            if (column.queryName.toString() == "CountNonNull(CQD.Second User Count)") {
                MaxCountIndex=i
                console.log(MediaTypeIndex)
            }
            if (column.queryName.toString() == "CQD.Media Type") {
                MediaTypeIndex=i
                console.log(MaxCountIndex)
            }
            i++
        });
        var maxVideo=0
        var maxAudio=0
        var maxVBSS=0
        
        tableDataView.rows.forEach((row: DataViewTableRow) => {
            if (row[MediaTypeIndex] == 'Audio') {
                if (maxAudio < row[MaxCountIndex]) 
                    {maxAudio = Number(row[MaxCountIndex])}
            } 
            if (row[MediaTypeIndex] == 'Video') {
                if (maxVideo < row[MaxCountIndex]) 
                    {maxVideo = Number(row[MaxCountIndex])}
            } 
            if (row[MediaTypeIndex] == 'VBSS') {
                if (maxVBSS < row[MaxCountIndex]) 
                    {maxVBSS = Number(row[MaxCountIndex])}
            } 
        });
        console.log(maxAudio)
        console.log(maxVideo)
        console.log(maxVBSS)

        var lowAudioBW =  maxAudio*.0450
        var lowVideoBW = maxVideo*1.60
        var lowVBSSBW = maxVBSS*.456
        var lowBW = lowVBSSBW+lowVideoBW+lowAudioBW
        var maxAudioBW =  maxAudio*.0505
        var maxVideoBW = maxVideo*2.040
        var maxVBSSBW = maxVBSS*.577
        var maxBW = maxVBSSBW+maxVideoBW+maxAudioBW

        const tableRow0 = document.createElement("tr");
        const tableHeader = document.createElement("th");
        const tableHeader2 = document.createElement("th");
        tableHeader.innerText = 'Media Type'
        tableHeader2.innerText = 'Estimated BW Usage'
        tableRow0.appendChild(tableHeader);
        tableRow0.appendChild(tableHeader2);
        this.table.appendChild(tableRow0);


        //draw rows
        const tableRow = document.createElement("tr");
        const cell = document.createElement("td");
        const cell2 = document.createElement("td");
        cell.innerText = 'Audio'
        cell2.innerText = lowAudioBW.toFixed(0) + "-" + maxAudioBW.toFixed(0)+ " Mbps"
        tableRow.appendChild(cell);
        tableRow.appendChild(cell2);
        this.table.appendChild(tableRow);
        const tableRowVideo = document.createElement("tr");
        const cellVideo1 = document.createElement("td");
        const cellVideo2 = document.createElement("td");
        cellVideo1.innerText = 'Video'
        cellVideo2.innerText = lowVideoBW.toFixed(0) + "-" + maxVideoBW.toFixed(0)+" Mbps"
        tableRowVideo.appendChild(cellVideo1);
        tableRowVideo.appendChild(cellVideo2);
        this.table.appendChild(tableRowVideo);
        const tableRowVBSS = document.createElement("tr");
        const cellVBSS1 = document.createElement("td");
        const cellVBSS2 = document.createElement("td");
        cellVBSS1.innerText = 'VBSS'
        cellVBSS2.innerText = lowVBSSBW.toFixed(0) + "-" + maxVBSSBW.toFixed(0)+" Mbps"
        tableRowVBSS.appendChild(cellVBSS1);
        tableRowVBSS.appendChild(cellVBSS2);
        this.table.appendChild(tableRowVBSS);
        const tableRowTotal = document.createElement("tr");
        const cellTotal1 = document.createElement("td");
        const cellTotal2 = document.createElement("td");
        cellTotal1.innerText = 'Total'
        cellTotal2.innerText = lowBW.toFixed(0) + "-" + maxBW.toFixed(0)+" Mbps"
        tableRowTotal.appendChild(cellTotal1);
        tableRowTotal.appendChild(cellTotal2);
        this.table.appendChild(tableRowTotal);
        //const tableRow2 = document.createElement("tr");
        //const cell2 = document.createElement("td");
        //cell.innerText = maxVideo.toString()
        //tableRow2.appendChild(cell2);
        //this.table.appendChild(tableRow2);
        //const tableRow3 = document.createElement("tr");
        //const cell3 = document.createElement("td");
        //cell.innerText = maxVBSS.toString()
        //tableRow.appendChild(cell3);
        //this.table.appendChild(tableRow3);
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}