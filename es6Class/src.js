var imgHtml = `<div class="fill-item clearfix">
                <img    style='float: left;width: 100px;height: 100px;background: rgba(0, 160, 233, .1);overflow: hidden;text-align: center;line-height: 106px;' 
                 ng-src="{{src}}">
                <div  style='position: absolute;left: 120px;bottom: -2px;' ng-show="!isEdit">
                    <div style='position: relative;'>
                        <p style='width: 120px;height: 34px;overflow: hidden;background: #00c1de;text-align: center;line-height: 34px;color: #fff;'>上传图片</p>
                        <input  style='position: absolute;top: 0;left: 0; width: 120px;height: 34px;opacity: 0;' 
                        type="file" capture="camera" accept="image/png,image/jpg,image/JPEG">
                    </div>
                    <p class="img-tip">请上传不小于100*100像素的图片，支持jpg、gif、png格式，大小不能超过200KB</p>
                </div>
            </div>`