import React from 'react';
import './canvas-drawer-widget.css';

const CanvasDrawerWidget = (props) => {

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
        require('./CanvasDrawerWidgetScript');
    }

    return (
        <div>
            <section className="design-surface">
            {/* <section style={{ backgroundColor: "black"}}> */}
                <canvas id="temp-canvas"></canvas>
                <canvas id="main-canvas"></canvas>
            </section>

            {/* <!-- toolbox --> */}

            <section id="tool-box" className="tool-box">
                <canvas id="pencil-icon" width="40" height="40" title="Panchil"></canvas>
                <canvas id="marker-icon" width="40" height="40" title="Marker"></canvas>

                <canvas id="eraser-icon" width="40" height="40" title="Erase drawings"></canvas>
                <canvas id="text-icon" width="40" height="40" title="Write text"></canvas>
                <canvas id="image-icon" width="40" height="40" title="Add image"></canvas>

                <canvas id="pdf-icon" width="40" height="40" title="Add pdf"></canvas>

                <canvas id="drag-last-path" width="40" height="40" title="Drag/move last path"></canvas>
                <canvas id="drag-all-paths" width="40" height="40" title="Drag/move all paths"></canvas>

                <canvas id="line" width="40" height="40" title="Draw Lines"></canvas>
                <canvas id="arrow" width="40" height="40" title="Draw Arrows"></canvas>

                <canvas id="zoom-up" width="40" height="40" title="Zoon-In"></canvas>
                <canvas id="zoom-down" width="40" height="40" title="Zoom-Out"></canvas>

                <canvas id="arc" width="40" height="40" title="Arc"></canvas>
                <canvas id="rectangle" width="40" height="40" title="Rectangle"></canvas>
                <canvas id="quadratic-curve" width="40" height="40" title="Quadratic curve"></canvas>
                <canvas id="bezier-curve" width="40" height="40" title="Bezier curve"></canvas>

                <canvas id="undo" width="40" height="40" title="Undo: Remove recent shapes"></canvas>

                <canvas id="line-width" width="40" height="40" title="Set line-width"></canvas>
                <canvas id="colors" width="40" height="40" title="Set foreground and background colors"></canvas>
                <canvas id="additional" width="40" height="40" title="Extra options"></canvas>
            </section>

            {/* <!-- pdf --> */}

            <section id="pdf-page-container">
                <img id="pdf-prev" />
                <select id="pdf-pages-list"></select>
                <img id="pdf-next" />
                <img id="pdf-close" />
            </section>

            {/* <!-- arc --> */}

            <section id="arc-range-container" className="arc-range-container">
                <input id="arc-range" className="arc-range" type="text" value="2" onChange={ (e)=>console.log(e)}/>
                <input type="checkbox" id="is-clockwise" checked className="allow-select" onChange={ (e)=>console.log(e)}/>
                <label htmlFor="is-clockwise">Clockwise?</label>
                <div className="arc-range-container-guide">Use arrow keys ↑↓</div>
            </section>

            {/* <!-- generated code --> */}

            <section className="code-container">
                <textarea id="code-text" className="code-text allow-select"></textarea>
            </section>

            <section className="preview-panel" style={{ display: "none" }}>
                <div id="design-preview" className="preview-selected">Preview</div>
                <div id="code-preview">Code</div>
            </section>

            {/* <!-- options --> */}

            <section id="options-container" className="options-container">
                <div>
                    <input type="checkbox" id="is-absolute-points" checked onChange={ (e)=>console.log(e)}/>
                    <label htmlFor="is-absolute-points">Absolute Points</label>
                </div>
                <div>
                    <input type="checkbox" id="is-shorten-code" checked onChange={ (e)=>console.log(e)}/>
                    <label htmlFor="is-shorten-code">Shorten Code</label>
                </div>
            </section>

            {/* <!-- line-width --> */}

            <section id="line-width-container" className="context-popup">
                <label htmlFor="line-width-text">Line Width:</label>
                <input id="line-width-text" className="line-width-text" type="text" value="2" onChange={ (e)=>console.log(e)}/>

                <div id="line-width-done" className="btn-007">Done</div>
            </section>

            {/* <!-- colors selector --> */}

            <section id="colors-container" className="context-popup colors-container">
                <div className="input-div">
                    <label htmlFor="stroke-style">Stroke Style:</label>
                    <input id="stroke-style" type="color" value="#6c96c8" onChange={ (e)=>console.log(e)}/>
                </div>

                <div className="input-div">
                    <label htmlFor="fill-style">Fill Style:</label>
                    <input id="fill-style" type="color" value="#ffffff" onChange={ (e)=>console.log(e)}/>
                </div>
                <div id="colors-done" className="btn-007">Done</div>
            </section>

            {/* <!-- marker selector --> */}

            <section id="marker-container" className="context-popup colors-container">
                <div className="input-div">
                    <label htmlFor="marker-stroke-style">Thickness:</label>
                    <select id="marker-stroke-style" value="8" onChange={ (e)=>console.log(e)}>
                        <option value='8'>8</option>
                        <option value='9'>9</option>
                        <option value='10'>10</option>
                        <option value='11'>11</option>
                        <option value='12'>12</option>
                        <option value='14'>14</option>
                        <option value='16'>16</option>
                        <option value='18'>18</option>
                        <option value='20'>20</option>
                        <option value='22'>22</option>
                        <option value='22'>22</option>
                        <option value='24'>24</option>
                        <option value='26'>26</option>
                        <option value='28'>28</option>
                        <option value='36'>36</option>
                        <option value='36'>36</option>
                        <option value='48'>48</option>
                        <option value='72'>72</option>
                    </select>
                </div>
                <div className="input-div" id='marker-color-container'>
                    <label htmlFor="marker-fill-style">Fill Color:</label>
                    <div id="marker-selected-color"></div>
                    <div id="marker-fill-colors" className='context-popup'>
                        <div className="top">
                            <div id="marker-selected-color-2"></div>
                            <input id="marker-fill-style" type="text" value="FF7373" onChange={ (e)=>console.log(e)}/>
                        </div>
                        <table id="marker-colors-list">

                        </table>
                    </div>
                </div>
        {/* </div>  */}
                <div id="marker-done" className="btn-007">Done</div>
            </section>

            {/* <!-- marker selector --> */}

            {/* <!-- pencil selector --> */}

            <section id="pencil-container" className="context-popup colors-container">

                <div className="input-div">
                    <label htmlFor="pencil-stroke-style">Thickness:</label>
                    <select id="pencil-stroke-style" value="5" onChange={ (e)=> console.log(e)}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                        <option value='7'>7</option>
                        <option value='8'>8</option>
                        <option value='9'>9</option>
                        <option value='10'>10</option>
                        <option value='11'>11</option>
                        <option value='12'>12</option>
                        <option value='14'>14</option>
                        <option value='16'>16</option>
                        <option value='18'>18</option>
                        <option value='20'>20</option>
                        <option value='22'>22</option>
                        <option value='22'>22</option>
                        <option value='24'>24</option>
                        <option value='26'>26</option>
                        <option value='28'>28</option>
                        <option value='36'>36</option>
                        <option value='36'>36</option>
                        <option value='48'>48</option>
                        <option value='72'>72</option>
                    </select>
                </div>
                <div className="input-div" id='pencil-color-container'>
                    <label htmlFor="pencil-fill-style">Fill Color:</label>
                    <div id="pencil-selected-color"></div>
                    <div id="pencil-fill-colors" className='context-popup'>
                        <div className="top">
                            <div id="pencil-selected-color-2"></div>
                            <input id="pencil-fill-style" type="text" value="6699FF" onChange={ (e)=>console.log(e)}/>
                        </div>
                        <table id="pencil-colors-list">

                        </table>
                    </div>
                </div>
                {/* </div> */}

                <div id="pencil-done" className="btn-007">Done</div>
            </section>

            {/* <!-- pencil selector --> */}

            {/* <!-- copy paths --> */}

            <section id="copy-container" className="context-popup">
                <div>
                    <input type="checkbox" id="copy-last" checked onChange={ (e)=>console.log(e)}/>
                    <label htmlFor="copy-last">Copy last path</label>
                </div>
                <div style={{ marginTop: "5px" }}>
                    <input type="checkbox" id="copy-all" onChange={ (e)=>console.log(e)}/>
                    <label htmlFor="copy-all">Copy all paths</label>
                </div>
            </section>

            {/* <!-- additional controls --> */}

            <section id="additional-container" className="context-popup additional-container">
                <div>
                    <label htmlFor="lineCap-select">Line Cap:</label>
                    <select id="lineCap-select" value="round" onChange={(e)=>console.log(e)}>
                        <option value="round">round</option>
                        <option value="butt">butt</option>
                        <option value="square">square</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="lineJoin-select">Line Join:</label>
                    <select id="lineJoin-select" value="round" onChange={(e)=>console.log(e)}>
                        <option value="round">round</option>
                        <option value="bevel">bevel</option>
                        <option value="miter">miter</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="globalAlpha-select">globalAlpha:</label>
                    <select id="globalAlpha-select" value="0.7" onChange={(e)=>console.log(e)}>
                        <option value="1.0">1.0</option>
                        <option value="0.9">0.9</option>
                        <option value="0.8">0.8</option>
                        <option value="0.7">0.7</option>
                        <option value="0.6">0.6</option>
                        <option value="0.5">0.5</option>
                        <option value="0.4">0.4</option>
                        <option value="0.3">0.3</option>
                        <option value="0.2">0.2</option>
                        <option value="0.1">0.1</option>
                        <option value="0.0">0.0</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="globalCompositeOperation-select">globalCompositeOperation:</label>
                    <select id="globalCompositeOperation-select" value="source-over" onChange={(e)=>console.log(e)}>
                        <option value="source-atop">source-atop</option>
                        <option value="source-in">source-in</option>
                        <option value="source-out">source-out</option>
                        <option value="source-over">source-over</option>
                        <option value="destination-atop">destination-atop</option>
                        <option value="destination-in">destination-in</option>
                        <option value="destination-out">destination-out</option>
                        <option value="destination-over">destination-over</option>
                        <option value="lighter">lighter</option>
                        <option value="copy">copy</option>
                        <option value="xor">xor</option>
                    </select>
                </div>

                <div id="additional-close" className="btn-007">Done</div>
            </section>

            {/* <!-- fade --> */}

            <div id="fade"></div>

            {/* <!-- text font/family/color --> */}

            <ul className="fontSelectUl" style={{ display: "none", position: "absolute", top: 0, left: 0, width: "166px" }}>
                <li>Arial</li>
                <li>Arial Black</li>
                <li>Comic Sans MS</li>
                <li>Courier New</li>
                <li>Georgia</li>
                <li>Tahoma</li>
                <li>Times New Roman</li>
                <li>Trebuchet MS</li>
                <li>Verdana</li>
            </ul>

            <ul className="fontSizeUl" style={{ display: "none", position: "absolute", top: 0, left: 0, width: "50px", textAlign: "center" }} >
                <li>15</li>
                <li>17</li>
                <li>19</li>
                <li>20</li>
                <li>22</li>
                <li>25</li>
                <li>30</li>
                <li>35</li>
                <li>42</li>
                <li>48</li>
                <li>60</li>
                <li>72</li>
            </ul>
        </div>
    )
}

export default CanvasDrawerWidget;