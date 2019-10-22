import {formatRender} from "../editor/formatRender";
import {html2md} from "../editor/html2md";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";

export class Ui {
    private contentElement: HTMLElement;

    constructor(vditor: IVditor) {
        const vditorElement = document.getElementById(vditor.id);
        vditorElement.innerHTML = "";
        vditorElement.className = "vditor" + (vditorElement.className ? " " + vditorElement.className : "");
        if (typeof vditor.options.height === "number") {
            vditorElement.style.height = vditor.options.height + "px";
        }
        if (typeof vditor.options.width === "number") {
            vditorElement.style.width = vditor.options.width + "px";
        } else {
            vditorElement.style.width = vditor.options.width;
        }

        const toolbarElement = document.createElement("div");
        toolbarElement.className = "vditor-toolbar";
        Object.keys(vditor.toolbar.elements).forEach((key) => {
            toolbarElement.appendChild(vditor.toolbar.elements[key]);
        });

        vditorElement.appendChild(toolbarElement);

        this.contentElement = document.createElement("div");
        this.contentElement.className = "vditor-content";

        if (vditor.wysiwyg) {
            this.contentElement.appendChild(vditor.wysiwyg.element);
        }

        if (vditor.editor) {
            this.contentElement.appendChild(vditor.editor.element);
        }

        if (vditor.preview) {
            this.contentElement.appendChild(vditor.preview.element);
        }

        if (vditor.toolbar.elements.devtools) {
            this.contentElement.appendChild(vditor.devtools.element);
        }

        if (vditor.options.counter > 0) {
            this.contentElement.appendChild(vditor.counter.element);
        }

        if (vditor.upload) {
            this.contentElement.appendChild(vditor.upload.element);
        }

        if (vditor.options.resize.enable) {
            this.contentElement.appendChild(vditor.resize.element);
        }

        if (vditor.hint) {
            this.contentElement.appendChild(vditor.hint.element);
        }

        this.contentElement.appendChild(vditor.tip.element);

        vditorElement.appendChild(this.contentElement);

        this.afterRender(vditor);
    }

    private async afterRender(vditor: IVditor) {
        let height: number = Math.max(this.contentElement.offsetHeight, 20);
        if (height < 21 && typeof vditor.options.height === "number") {
            height = vditor.options.height - 37;
        }

        if (vditor.editor && vditor.options.typewriterMode) {
            vditor.editor.element.style.paddingBottom = height / 2 + "px";
        }

        if (vditor.wysiwyg) {
            const padding = (vditor.wysiwyg.element.parentElement.scrollWidth - vditor.options.preview.maxWidth) / 2;
            if (vditor.options.typewriterMode) {
                vditor.wysiwyg.element.style.padding = `10px ${Math.max(10, padding)}px ${height / 2}px`;
            } else {
                vditor.wysiwyg.element.style.padding = `10px ${Math.max(10, padding)}px 10px`;
            }
        }

        // set default value
        let initValue = localStorage.getItem("vditor" + vditor.id);
        if (!vditor.options.cache || !initValue) {
            initValue = await html2md(vditor, vditor.originalInnerHTML);
        }
        if (!initValue) {
            return;
        }

        if (vditor.options.mode.indexOf("wysiwyg") > -1) {
            renderDomByMd(vditor, initValue);
        }

        if (vditor.options.mode.indexOf("markdown") > -1) {
            formatRender(vditor, initValue, undefined, true);
        }
    }
}
