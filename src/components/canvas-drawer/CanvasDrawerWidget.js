import React from 'react';
import './canvas-drawer-widget.css';
import AdditionalOptionContainier from './common/options/AdditionalOptionContainer';
import ArcContainer from './tools/arc/ArcContainer';
import CodeContainer from './CodeContainer';
import CodeContainerOptionContainer from './CodeContainerOptionContainer';
import ColorPaletteConatiner from './common/options/ColorPaletteContainer';
import CopyPathContainer from './CopyPathContainer';
import EraserContainer from './tools/eraser/EraserContainer';
import FontSelector from './tools/text/FontSelector';
import LineWidthContainer from './common/options/LineWidthContainer';
import MarkerContainer from './tools/marker/MarkerContainer';
import PencilContainer from './tools/pencil/PencilContainer';
import PdfContainer from './tools/pdf/PdfContainer';
import PreviewPanel from './PreviewPanel';
import Toolbox from './toolbox/Toolbox';
import FontSizeSelector from './tools/text/FontSizeSelector';
import TextContainer from './tools/text/TextContainer';
import TextInfoContainer from './tools/text/TextInfoContainer';
import initWidget from './CanvasDrawerWidgetScript';
import {
    addEvent,
    colors,
    clone,
    find,
    getContext,
    hexToRGB,
    hexToRGBA,
    hideContainers,
    syncData
} from './util/Utils'

const CanvasDrawerWidget = (props) => {

    const [iconShows, setIconShows] = React.useState({
        pencil: true,
        marker: true,
        eraser: true,
        text: true,
        image: true,
        pdf: true,
        dragLastPath: true,
        dragAllPath: true,
        line: true,
        arrow: true,
        zoomIn: true,
        zoomOut: true,
        arc: true,
        rectangle: true,
        quadraticCurve: true,
        bezierCurve: true,
        undo: true,
        lineWidth: true,
        colors: true,
        additional: true
    });

    const [containersShow, setContainersShow] = React.useState({
        pdfContainer: false,
        arcContainer: false,
        codeContainer: false,
        previewPanel: false,
        codeContainerOptionsContainer: false,
        lineWidthContainer: false,
        colorPaletteContainer: false,
        markerContainer: false,
        pencilContainer: false,
        eraserContainer: false,
        textContainer: false,
        copyPathContainer: false,
        additionalOptionContainer: false,
        fontSelectionContainer: false,
        fontSizeSelectionContainer: false,
        textInfoContainer: false
    });

    React.useEffect(()=>{
        init();
    }, []);

    const init = () => {
        (function() {
            var params = {}, r = /([^&=]+)=?([^&]*)/g;

            const d = (s) =>  {
                return decodeURIComponent(s.replace(/\+/g, ' '));
            }

            var match, search = window.location.search;
            while (match = r.exec(search.substring(1))) params[d(match[1])] = d(match[2]);
            window.params = params;
        })();
        window.selectedIcon = params.selectedIcon;

        if (window.selectedIcon) {
            try {
                window.selectedIcon = window.selectedIcon.split('')[0].toUpperCase() + window.selectedIcon.replace(window.selectedIcon.split('').shift(1), '');
            } catch (e) {
                window.selectedIcon = 'Pencil';
            }
        } else {
            window.selectedIcon = 'Pencil';
        }
        initWidget(iconShows);
        // require('./CanvasDrawerWidgetScript');
    }

    const controlShows = (shouldbeOpenContainer) => {
        setContainersShow( {
            pdfContainer: shouldbeOpenContainer === "pdfContainer" ? true : false,
            arcContainer: shouldbeOpenContainer === "arcContainer" ? true : false,
            codeContainer: shouldbeOpenContainer === "codeContainer" ? true : false,
            previewPanel: shouldbeOpenContainer === "previewPanel" ? true : false,
            codeContainerOptionsContainer: shouldbeOpenContainer === "codeContainerOptionsContainer" ? true : false,
            lineWidthContainer: shouldbeOpenContainer === "lineWidthContainer" ? true : false,
            colorPaletteContainer: shouldbeOpenContainer === "colorPaletteContainer" ? true : false,
            markerContainer: shouldbeOpenContainer === "markerContainer" ? true : false,
            pencilContainer: shouldbeOpenContainer === "pencilContainer" ? true : false,
            eraserContainer: shouldbeOpenContainer === "eraserContainer" ? true: false,
            textContainer: shouldbeOpenContainer === "textContainer" ? true: false,
            copyPathContainer: shouldbeOpenContainer === "copyPathContainer" ? true : false,
            additionalOptionContainer: shouldbeOpenContainer === "additionalOptionContainer" ? true : false,
            fontSelectionContainer: shouldbeOpenContainer === "fontSelectionContainer" ? true : false,
            fontSizeSelectionContainer: shouldbeOpenContainer === "fontSizeSelectionContainer" ? true : false,
            textInfoContainer: shouldbeOpenContainer === "textInfoContainer" ? true : false
        });
    }

    return (
        <div>
            <section className="design-surface">
                <canvas id="temp-canvas"></canvas>
                <canvas id="main-canvas"></canvas>
            </section>

            <Toolbox shows={ iconShows } />

            <PdfContainer open={ containersShow.pdfContainer } controlOpen={ controlShows } />
            <ArcContainer open={ containersShow.arcContainer } controlOpen={ controlShows }  />

            <CodeContainer open={ containersShow.codeContainer } controlOpen={ controlShows } />
            <PreviewPanel open={ containersShow.previewPanel } controlOpen={ controlShows } />
            
            <CodeContainerOptionContainer open={ containersShow.codeContainerOptionsContainer } controlOpen={ controlShows } />

            <LineWidthContainer 
                open={ containersShow.lineWidthContainer } 
                controlOpen={ controlShows } 
                toolIconId="line-width" />
            <ColorPaletteConatiner 
                open={ containersShow.colorPaletteContainer } 
                controlOpen={ controlShows } 
                toolIconId="colors" />
            <AdditionalOptionContainier 
                open={ containersShow.additionalOptionContainer } 
                controlOpen={ controlShows } 
                toolIconId="additional" />
            
            <MarkerContainer 
                open={ containersShow.markerContainer } 
                controlOpen={ controlShows } 
                toolIconId="marker-icon" />
            <PencilContainer 
                open={ containersShow.pencilContainer } 
                controlOpen={ controlShows } 
                toolIconId="pencil-icon" />
            <EraserContainer 
                open={ containersShow.eraserContainer } 
                controlOpen={ controlShows } 
                toolIconId="eraser-icon" />
            <TextContainer 
                open={ containersShow.textContainer } 
                controlOpen={ controlShows } 
                toolIconId="text-icon" />

            <CopyPathContainer 
                open={ containersShow.copyPathContainer } 
                controlOpen={ controlShows } />

            <FontSelector open={ containersShow.fontSelectionContainer } controlOpen={ controlShows } />
            <FontSizeSelector open={ containersShow.fontSizeSelectionContainer } controlOpen={ controlShows } />
            <TextInfoContainer open={ containersShow.TextInfoContainer } controlOpen={ controlShows } />

        </div>
    )
}

export default CanvasDrawerWidget;
