import {abcRender} from "./ts/markdown/abcRender";
import {chartRender} from "./ts/markdown/chartRender";
import {codeRender} from "./ts/markdown/codeRender";
import {highlightRender} from "./ts/markdown/highlightRender";
import {mathRender} from "./ts/markdown/mathRender";
import {mathRenderByLute} from "./ts/markdown/mathRenderByLute";
import {md2htmlByPreview} from "./ts/markdown/md2html";
import {mediaRender} from "./ts/markdown/mediaRender";
import {mermaidRender} from "./ts/markdown/mermaidRender";
import {previewRender} from "./ts/markdown/previewRender";

class Vditor {

    public static codeRender = codeRender;
    public static highlightRender = highlightRender;
    public static mathRenderByLute = mathRenderByLute;
    public static mathRender = mathRender;
    public static mermaidRender = mermaidRender;
    public static chartRender = chartRender;
    public static abcRender = abcRender;
    public static mediaRender = mediaRender;
    public static md2html = md2htmlByPreview;
    public static preview = previewRender;
}

export default Vditor;
