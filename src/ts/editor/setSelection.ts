export const setSelectionFocus = (range: Range) => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

export const setSelectionByPosition = (start: number, end: number, editor: HTMLElement) => {
    let charIndex = 0;
    let line = 0;
    let pNode = editor.childNodes[line];
    let foundStart = false;
    let stop = false;
    start = Math.max(0, start);
    end = Math.max(0, end);

    const range = editor.ownerDocument.createRange();
    range.setStart(pNode || editor, 0);
    range.collapse(true);

    while (!stop && pNode) {
        const nextCharIndex = charIndex + pNode.textContent.length;
        if (!foundStart && start >= charIndex && start <= nextCharIndex) {
            if (start === 0) {
                range.setStart(pNode, 0);
            } else {
                if (pNode.childNodes[0].nodeType === 3) {
                    range.setStart(pNode.childNodes[0], start - charIndex);
                } else if (pNode.nextSibling) {
                    range.setStartBefore(pNode.nextSibling);
                } else {
                    range.setStartAfter(pNode);
                }
            }
            foundStart = true;
            if (start === end) {
                stop = true;
                break;
            }
        }
        if (foundStart && end >= charIndex && end <= nextCharIndex) {
            if (end === 0) {
                range.setEnd(pNode, 0);
            } else {
                if (pNode.childNodes[0].nodeType === 3) {
                    range.setEnd(pNode.childNodes[0], end - charIndex);
                } else if (pNode.nextSibling) {
                    range.setEndBefore(pNode.nextSibling);
                } else {
                    range.setEndAfter(pNode);
                }
            }
            stop = true;
        }
        charIndex = nextCharIndex;
        pNode = editor.childNodes[++line];
    }

    if (!stop && editor.childNodes[line - 1]) {
        range.setStartBefore(editor.childNodes[line - 1]);
    }

    setSelectionFocus(range);
    return range;
};

export const setSelectionByInlineText = (text: string, childNodes: NodeListOf<ChildNode>) => {
    let offset = 0;
    let startIndex = 0;
    Array.from(childNodes).some((node: HTMLElement, index: number) => {
        startIndex = node.textContent.indexOf(text);
        if (startIndex > -1 && childNodes[index].childNodes[0].nodeType === 3) {
            offset = index;
            return true;
        }
    });
    if (startIndex < 0) {
        return;
    }
    const range = document.createRange();
    range.setStart(childNodes[offset].childNodes[0], startIndex);
    range.setEnd(childNodes[offset].childNodes[0], startIndex + text.length);
    setSelectionFocus(range);
};
