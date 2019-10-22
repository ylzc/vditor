import {getText} from "../editor/getText";
import {i18n} from "../i18n/index";
import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRenderByLute} from "../markdown/mathRenderByLute";
import {md2htmlByVditor} from "../markdown/md2html";
import {mediaRender} from "../markdown/mediaRender";
import {mermaidRender} from "../markdown/mermaidRender";

export class Preview {
    public element: HTMLElement;
    private mdTimeoutId: number;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = `vditor-preview`;
        const previewElement = document.createElement("div");
        previewElement.className = vditor.options.classes.preview ? vditor.options.classes.preview : "vditor-reset";
        previewElement.style.maxWidth = vditor.options.preview.maxWidth + "px";
        if (vditor.currentMode === "wysiwyg" || vditor.currentPreviewMode === "editor") {
            this.element.style.display = "none";
        }
        this.element.appendChild(previewElement);
        this.render(vditor);
    }

    public async render(vditor: IVditor, value?: string) {
        if (this.element.className === "vditor-preview vditor-preview--editor") {
            if (this.element.getAttribute("data-type") === "renderPerformance") {
                vditor.tip.hide();
            }
            return;
        }

        if (value) {
            this.element.children[0].innerHTML = value;
            return;
        }

        if (getText(vditor.editor.element).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") === "") {
            this.element.children[0].innerHTML = "";
            return;
        }

        clearTimeout(this.mdTimeoutId);
        const renderStartTime = new Date().getTime();
        const markdownText = getText(vditor.editor.element);
        if (vditor.options.preview.url) {
            this.mdTimeoutId = window.setTimeout(async () => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", vditor.options.preview.url);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = async () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const responseJSON = JSON.parse(xhr.responseText);
                            if (responseJSON.code !== 0) {
                                alert(responseJSON.msg);
                                return;
                            }
                            this.element.children[0].innerHTML = responseJSON.data;
                            this.afterRender(vditor, renderStartTime);
                        } else {
                            const html = await md2htmlByVditor(markdownText, vditor);
                            this.element.children[0].innerHTML = html;
                            this.afterRender(vditor, renderStartTime);
                        }
                    }
                };

                xhr.send(JSON.stringify({markdownText}));
            }, vditor.options.preview.delay);
        } else {
            const html = await md2htmlByVditor(markdownText, vditor);
            this.element.children[0].innerHTML = html;
            this.afterRender(vditor, renderStartTime);
        }
    }

    private afterRender(vditor: IVditor, startTime: number) {
        if (vditor.options.preview.parse) {
            vditor.options.preview.parse(this.element);
        }
        const time = (new Date().getTime() - startTime);
        if ((new Date().getTime() - startTime) > 2000) {
            // https://github.com/b3log/vditor/issues/67
            vditor.tip.show(i18n[vditor.options.lang].performanceTip.replace("${x}",
                time.toString()));
            vditor.preview.element.setAttribute("data-type", "renderPerformance");
        } else if (vditor.preview.element.getAttribute("data-type") === "renderPerformance") {
            vditor.tip.hide();
            vditor.preview.element.removeAttribute("data-type");
        }
        codeRender(vditor.preview.element.children[0] as HTMLElement, vditor.options.lang);
        highlightRender(vditor.options.preview.hljs.style, vditor.options.preview.hljs.enable,
            vditor.preview.element.children[0] as HTMLElement);
        mathRenderByLute(vditor.preview.element.children[0] as HTMLElement);
        mermaidRender(vditor.preview.element.children[0] as HTMLElement);
        chartRender(vditor.preview.element.children[0] as HTMLElement);
        abcRender(vditor.preview.element.children[0] as HTMLElement);
        mediaRender(vditor.preview.element.children[0] as HTMLElement);
    }
}
