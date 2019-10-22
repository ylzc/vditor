import emojiSVG from "../../assets/icons/emoji.svg";
import {insertText} from "../editor/insertText";
import {getEventName} from "../util/getEventName";
import {MenuItem} from "./MenuItem";

export class Emoji extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || emojiSVG;

        const emojiPanelElement = document.createElement("div");
        emojiPanelElement.className = "vditor-panel";

        let commonEmojiHTML = "";
        Object.keys(vditor.options.hint.emoji).forEach((key) => {
            const emojiValue = vditor.options.hint.emoji[key];
            if (emojiValue.indexOf(".") > -1) {
                commonEmojiHTML += `<span data-value=":${key}: " data-key=":${key}:"><img
data-value=":${key}: " data-key=":${key}:" src="${emojiValue}"/></span>`;
            } else {
                commonEmojiHTML += `<span data-value="${emojiValue} " data-key="${key}">${emojiValue}</span>`;
            }
        });

        const tailHTML = `<div class="vditor-emojis__tail">
    <span class="vditor-emojis__tip"></span><span>${vditor.options.hint.emojiTail || ""}</span>
</div>`;

        emojiPanelElement.innerHTML = `<div class="vditor-emojis" style="max-height: ${
            vditor.options.height === "auto" ? "auto" : vditor.options.height as number - 80
            }px">${commonEmojiHTML}</div>${tailHTML}`;

        this.element.appendChild(emojiPanelElement);

        this._bindEvent(emojiPanelElement, vditor);
    }

    public _bindEvent(emojiPanelElement: HTMLElement, vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (emojiPanelElement.style.display === "block") {
                emojiPanelElement.style.display = "none";
            } else {
                emojiPanelElement.style.display = "block";
                if (vditor.toolbar.elements.headings) {
                    const headingsPanel = vditor.toolbar.elements.headings.children[1] as HTMLElement;
                    headingsPanel.style.display = "none";
                }
            }

            if (vditor.hint) {
               vditor.hint.element.style.display = "none";
           }
            event.preventDefault();
        });

        emojiPanelElement.querySelectorAll(".vditor-emojis span").forEach((element) => {
            element.addEventListener(getEventName(), (event: Event) => {
                insertText(vditor, (event.target as HTMLElement).getAttribute("data-value"),
                    "", true);
                emojiPanelElement.style.display = "none";
                event.preventDefault();
            });
            element.addEventListener("mouseover", (event: Event) => {
                emojiPanelElement.querySelector(".vditor-emojis__tip").innerHTML =
                    (event.target as HTMLElement).getAttribute("data-key");
            });
        });
    }
}
