import bugSVG from "../../assets/icons/bug.svg";
import {getEventName} from "../util/getEventName";
import {MenuItem} from "./MenuItem";

export class Devtools extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || bugSVG;

        this.element.addEventListener(getEventName(), async () => {
            if (this.element.children[0].className.indexOf("vditor-menu--current") > -1) {
                this.element.children[0].className =
                    this.element.children[0].className.replace(" vditor-menu--current", "");
                vditor.devtools.element.style.display = "none";
                if (vditor.wysiwyg) {
                    const padding =
                        (vditor.wysiwyg.element.parentElement.scrollWidth - vditor.options.preview.maxWidth) / 2;
                    vditor.wysiwyg.element.style.paddingLeft = `${Math.max(10, padding)}px`;
                    vditor.wysiwyg.element.style.paddingRight = `${Math.max(10, padding)}px`;
                }
            } else {
                this.element.children[0].className += " vditor-menu--current";
                vditor.devtools.element.style.display = "block";
                if (vditor.wysiwyg) {
                    const padding =
                        ((vditor.wysiwyg.element.parentElement.scrollWidth / 2) - vditor.options.preview.maxWidth) / 2;
                    vditor.wysiwyg.element.style.paddingLeft = `${Math.max(10, padding)}px`;
                    vditor.wysiwyg.element.style.paddingRight = `${Math.max(10, padding)}px`;
                }
                vditor.devtools.renderEchart(vditor);
            }
        });
    }
}
