require(deps,function (editormd) {
    $(document).ready(function () {
        // editormd.loadCSS("/staticfs/thirdparty/Markdown/lib/codemirror/addon/fold/foldgutter");
        // $.get('../editor/js/test.md', function(md) {
            testEditor = editormd("test-editormd", {
                width: "90%",
                height: 640,
                path: '/staticfs/thirdparty/Markdown/lib/',   //css引用路径
                markdown: '',
                codeFold: true,
                searchReplace: true,
                saveHTMLToTextarea: true,                // 保存HTML到Textarea
                htmlDecode: "style,script,iframe|on*",       // 开启HTML标签解析，为了安全性，默认不开启
                emoji: true,
                taskList: true,
                tex: true,
                tocm: true,         // Using [TOCM]
                autoLoadModules: false,
                previewCodeHighlight: true,
                flowChart: true,
                sequenceDiagram: true,
                //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
                //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
                //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
                //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
                //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
                imageUpload: true,
                imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                imageUploadURL: "./php/upload.php",
                onload: function () {
                    console.log('onload', this);
                    //this.fullscreen();
                    //this.unwatch();
                    //this.watch().fullscreen();
                    //this.setMarkdown("#PHP");
                    //this.width("100%");
                    //this.height(480);
                    //this.resize("100%", 640);
                }
            });
        // })
        $('#get-html-btn').on('click',function () {
            console.log(testEditor.getHTML());
        });
        $("#show-btn").bind('click', function(){
            testEditor.show();
        });

        $("#hide-btn").bind('click', function(){
            testEditor.hide();
        });

        $("#get-md-btn").bind('click', function(){
            alert(testEditor.getMarkdown());
        });

        $("#get-html-btn").bind('click', function() {
            alert(testEditor.getHTML());
        });

        $("#watch-btn").bind('click', function() {
            testEditor.watch();
        });

        $("#unwatch-btn").bind('click', function() {
            testEditor.unwatch();
        });

        $("#preview-btn").bind('click', function() {
            testEditor.previewing();
        });

        $("#fullscreen-btn").bind('click', function() {
            testEditor.fullscreen();
        });

        $("#show-toolbar-btn").bind('click', function() {
            testEditor.showToolbar();
        });

        $("#close-toolbar-btn").bind('click', function() {
            testEditor.hideToolbar();
        });

        $("#toc-menu-btn").click(function(){
            testEditor.config({
                tocDropdown   : true,
                tocTitle      : "目录 Table of Contents",
            });
        });

        $("#toc-default-btn").click(function() {
            testEditor.config("tocDropdown", false);
        });
    });


});