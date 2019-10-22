import editSVG from "../../assets/icons/edit.svg";
import {formatRender} from "../editor/formatRender";
import {getText} from "../editor/getText";
import {getEventName} from "../util/getEventName";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";
import {MenuItem} from "./MenuItem";

export class WYSIWYG extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        this.element.children[0].innerHTML = menuItem.icon || editSVG;
        if (vditor.currentMode === "markdown") {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;
        } else {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }

        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), function(event) {
            if (this.className.indexOf("vditor-menu--current") > -1) {
                this.className = this.className.replace(" vditor-menu--current", "");
                vditor.wysiwyg.element.style.display = "none";
                if (vditor.currentPreviewMode === "both") {
                    vditor.editor.element.style.display = "block";
                    vditor.preview.element.style.display = "block";
                } else if (vditor.currentPreviewMode === "preview") {
                    vditor.preview.element.style.display = "block";
                } else if (vditor.currentPreviewMode === "editor") {
                    vditor.editor.element.style.display = "block";
                }
                if (vditor.toolbar.elements.format) {
                    vditor.toolbar.elements.format.style.display = "block";
                }
                if (vditor.toolbar.elements.both) {
                    vditor.toolbar.elements.both.style.display = "block";
                }
                if (vditor.toolbar.elements.preview) {
                    vditor.toolbar.elements.preview.style.display = "block";
                }
                formatRender(vditor, vditor.wysiwyg.element.textContent, undefined, false);

                vditor.currentMode = "markdown";
            } else {
                this.className = this.className + " vditor-menu--current";
                vditor.editor.element.style.display = "none";
                vditor.preview.element.style.display = "none";
                vditor.wysiwyg.element.style.display = "block";

                if (vditor.toolbar.elements.format) {
                    vditor.toolbar.elements.format.style.display = "none";
                }
                if (vditor.toolbar.elements.both) {
                    vditor.toolbar.elements.both.style.display = "none";
                }
                if (vditor.toolbar.elements.preview) {
                    vditor.toolbar.elements.preview.style.display = "none";
                }
                renderDomByMd(vditor, getText(vditor.editor.element));
                vditor.currentMode = "wysiwyg";
            }

            if (vditor.hint) {
                vditor.hint.element.style.display = "none";
            }
            if (vditor.toolbar.elements.headings) {
                (vditor.toolbar.elements.headings.children[1] as HTMLElement).style.display = "none";
            }
            if (vditor.toolbar.elements.emoji) {
                (vditor.toolbar.elements.emoji.children[1] as HTMLElement).style.display = "none";
            }
            if (vditor.devtools &&  vditor.devtools.ASTChart && vditor.devtools.element.style.display === "block") {
                vditor.devtools.ASTChart.resize();
            }

            event.preventDefault();
        });
    }
}
