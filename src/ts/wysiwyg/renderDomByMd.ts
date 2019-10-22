import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRender} from "../markdown/mathRender";
import {mediaRender} from "../markdown/mediaRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {setRange} from "./setRange";

export const renderDomByMd = (vditor: IVditor, md: string) => {
    const domHTML = vditor.lute.RenderVditorDOM(md, md.length, md.length);
    console.log(domHTML[0], md, md.length, md.length);
    const blockElement = vditor.wysiwyg.element;
    blockElement.innerHTML = domHTML[0] || domHTML[1];
    setRange(blockElement);
    codeRender(blockElement, vditor.options.lang);
    highlightRender(vditor.options.preview.hljs.style, vditor.options.preview.hljs.enable,
        blockElement);
    mathRender(blockElement);
    mermaidRender(blockElement);
    chartRender(blockElement);
    abcRender(blockElement);
    mediaRender(blockElement);
};
