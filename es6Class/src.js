var str =  `<div class="file-upload-input">
				<label for="sb123" class="btn btn-upload">选择上传文件</label>
				<input type="file" multiple id='sb123' style='position: absolute;left:-99999px'/>
				<span>
					<span class="ellipsis inline-block mr15" title="" ng-repeat='item in fileList track by item.fileId' style="position: relative;top: 5px;" >
						<a ng-click='fileDown(item.fileId,item.fileName)'>
							1.txt
						</a>
						<span class="glyphicon glyphicon-remove cursor"   ng-click='fileList.splice($index,1)'></span>
					</span>
				</span>
			</div>`;



