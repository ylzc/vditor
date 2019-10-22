const globalAny: any = global;
globalAny.VDITOR_VERSION = 'version'
globalAny.CDN_PATH = 'cdn/path'
import {Options} from '../../src/ts/util/Options';

describe('Options', () => {

    test('Options toolbar', () => {
        const options = new Options({
            toolbar: ['br', 'fullscreen', {
                hotkey: "⌘-a",
                name: "preview",
            }]
        });
        expect(options.merge()).toMatchObject({
            toolbar: [{
                name: "br",
            }, {
                hotkey: "⌘-'",
                name: "fullscreen",
                tipPosition: "nw",
            }, {
                hotkey: "⌘-a",
                name: "preview",
                tipPosition: "nw",
            }],
        })
    });

    test('Options upload', () => {
        const options = new Options({
            upload: {
                accept: '.jpg'
            }
        });
        expect(options.merge()).toMatchObject({
            upload: {
                filename: expect.anything(),
                linkToImgUrl: "",
                max: 10 * 1024 * 1024,
                url: "",
                accept: '.jpg'
            },
        })
    })

    test('Options classes', () => {
        const options = new Options({
            classes: {
                preview: "content-reset",
            },
        });
        expect(options.merge()).toMatchObject({
            classes: {
                preview: "content-reset",
            },
        })
    });


    test('Options preview', () => {
        const options = new Options({
            preview: {
                url: 'https://hacpai.com/md',
                mode: 'both',
            },
        });
        expect(options.merge()).toMatchObject({
            preview: {
                url: 'https://hacpai.com/md',
                delay: 1000,
                mode: 'both',
            },
        })
    });

    test('Options preview hljs', () => {
        const options = new Options({
            preview: {
                mode: 'both',
                hljs: {
                    style: 'github'
                }
            },
        });
        expect(options.merge().preview).toEqual({
            delay: 1000,
            mode: 'both',
            maxWidth: 768,
            hljs: {
                style: 'github',
                enable: true,
            }
        })
    });

    test('Options hint', () => {
        const options = new Options({
            hint: {
                emojiTail: '前往设置',
                emoji: {
                    "+1": "👍",
                },
            },
        });
        expect(options.merge()).toMatchObject({
            hint: {
                delay: 200,
                emojiTail: '前往设置',
                emoji: {
                    "+1": "👍",
                },
                emojiPath: globalAny.CDN_PATH + "/vditor/dist/images/emoji",
            },
        })
    });

    test('Options resize', () => {
        const options = new Options({
            resize: {
                enable: true,
            },
        })
        expect(options.merge()).toMatchObject({
            resize: {
                enable: true,
                position: "bottom",
            },
        })
    });
})
