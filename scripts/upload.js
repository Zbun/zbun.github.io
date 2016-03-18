//HTML5 上传简单实现，jQuery插件版
;
(function ($) {
    $.fn.upload = function (opts) {
        var def = {
            url: '',
            type: 'POST',
            dataType: 'JSON',
            callback: function () { }
        };

        var opt = $.extend(true, def, opts);

        this.on('change', function () {
            var file = this.files[0];
            var formData = new FormData();
            formData.append('filename', file);
            $.ajax({
                url: opt.url,
                type: opt.type,
                dataType: opt.dataType,
                data: formData,
                processData: false, //告诉jQuery不要去处理发送的数据
                contentType: false, //告诉jQuery不要支设置Content-Type请求头
                success: opt.callback
            })
            $(this).replaceWith($(this).clone(true));
        })
        return this;
    }
})($);

//HTML5 FormData 上传
function html5Upload() {
    var arg = arguments[0];
    var obj = arg.obj;                               //作用于上传按钮对象
    var name = obj.name || 'image';                  //formData 格式
    var url = arg.url || '';                         //上传服务器
    var beforeUpload = arg.beforeUpload || '';       //上传前执行，需要返回值
    var callback = arg.callback || '';               //成功回调
    var errorCallback = arg.errorCallback || '';     //失败回调
    if (obj) {
        obj.addEventListener('change', function () {
            //构造加载进度HTML
            var progressBg = document.createElement('div');
            progressBg.style.cssText = 'position:fixed;left:50%;top:50%;padding:10px 40px 0;border:1px solid #666;box-shadow:inset 0 0 1px #fff;border-radius:4px;text-align:center;color:#fff;background:rgba(0,0,0,.5);z-index;123;transform:translate(-50%,-50%);'
            var progressBarOuter = document.createElement('div');
            progressBarOuter.style.cssText = 'position:relative;height:6px;width:100px;border-radius:6px;border:1px solid #ddd;';
            var progressBarInner = document.createElement('span');
            progressBarInner.style.cssText = 'position:absolute;left:0;top:0;bottom:0;background:#56C7A8;transition:.3s;';
            var progressNum = document.createElement('p');
            var isReady = true;
            var selfFunc = arguments.callee;
            //FormData上传
            if (window.FormData) {
                if (typeof beforeUpload == 'function') {
                    isReady = beforeUpload(obj);
                }    
                if (isReady) {
                    var formData = new FormData();
                    formData.append(name, obj.files[0]);
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', url);
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            progressBg.parentNode.removeChild(progressBg);
                            var data = JSON.parse(xhr.response);
                            typeof callback == 'function' && callback(data);                     
                            var newNode = obj.cloneNode(true);                            
                            obj.parentNode.replaceChild(newNode, obj);
                            html5Upload({
                                obj: newNode,
                                url: url,
                                callback: callback,
                                beforeUpload: beforeUpload,
                                name: name,
                                errorCallback:errorCallback
                            });
                            //obj.removeEventListener('change', selfFuncs);
                        } else {
                            typeof errorCallback == 'function' && errorCallback();
                            console.log('上传失败');
                        }
                    };

                    //加载进度事件
                    xhr.upload.onprogress = function (event) {
                        if (event.lengthComputable) {
                            document.body.appendChild(progressBg);
                            var complete = (event.loaded / event.total * 100 | 0) + '%';
                            progressBarInner.style.width = complete;
                            progressNum.innerHTML = '已完成：' + complete;
                            progressBarOuter.innerHTML = progressBarInner.outerHTML;
                            progressBg.innerHTML = progressBarOuter.outerHTML + progressNum.outerHTML;
                        }
                    }
                    xhr.send(formData);
                }
            }
        })
    }
}
