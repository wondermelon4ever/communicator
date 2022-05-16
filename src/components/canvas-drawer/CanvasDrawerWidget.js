import React from 'react';
import './canvas-drawer-widget.css';

import AdditionalOptionContainier from './tools/tool-options/AdditionalOptionContainer';
import ArcContainer from './tools/advanced/arc/ArcContainer';
import CodeContainer from './views/CodeContainer';
import CodeContainerOptionContainer from './views/CodeContainerOptionContainer';
import ColorPaletteConatiner from './tools/tool-options/ColorPaletteContainer';
import CopyPathContainer from './views/CopyPathContainer';
import EraserContainer from './tools/basic/eraser/EraserContainer';
import FontSelector from './tools/basic/text/FontSelector';
import LineWidthContainer from './tools/tool-options/LineWidthContainer';
import MarkerContainer from './tools/basic/marker/MarkerContainer';
import PencilContainer from './tools/basic/pencil/PencilContainer';
import PdfContainer from './tools/basic/pdf/PdfContainer';
import PreviewPanel from './views/PreviewPanel';
import Toolbox from './toolbox/Toolbox';
import FontSizeSelector from './tools/basic/text/FontSizeSelector';
import TextContainer from './tools/basic/text/TextContainer';
import TextInfoContainer from './tools/basic/text/TextInfoContainer';
import Toolbox2 from './toolbox/Toolbox2';
import initWidget from './CanvasDrawerWidgetScript';

import CanvasMain from './views/CanvasMain';
import CanvasTemp from './views/CanvasTemp';

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

    // var mainCanvas = <canvas id="temp-canvas"></canvas>;
    // var tempCanvas = <canvas id="main-canvas"></canvas>;

    return (
        <div>
            <section className="design-surface">
                <CanvasTemp name="temp-canvas"/>
                <CanvasMain name="main-canvas"/>
            </section>

            <Toolbox shows={ iconShows } />

            <Toolbox2 mainCanvasName="main-canvas" tempCanvasName="temp-canvas"/>

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
                controlOpen={ controlShows } />
            <PencilContainer 
                open={ containersShow.pencilContainer } 
                controlOpen={ controlShows } />
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
