export const getParentBlock = (element: HTMLElement) => {
    let block = element;
    let hasBlock = false;
    while (!hasBlock) {
        const mtype = block.nodeType === 3 ? null : block.getAttribute("data-mtype");
        if (block.className === "vditor-reset vditor-wysiwyg" || mtype === "0" || mtype === "1") {
            hasBlock = true;
        } else {
            block = block.parentElement;
        }
    }
    return block;
};
