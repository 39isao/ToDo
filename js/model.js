;(function(){

	var Model = function(){
		this.contents = [];
	};
	Model.prototype = {
		save: function(aData, callback){
			callback = callback || function(){};
			var obj = {};
			obj.text = aData;
			this.contents.push(obj);
			this.saveStorage();
			callback.call(this, obj);
		},
		get: function(callback){
			var storageData = JSON.parse(window.localStorage.getItem('memo'));
			if(storageData){
				for(var cnt=0, len=storageData.length; cnt<len; cnt++){
					this.contents.push(storageData[cnt]);
				}
				callback.call(this, storageData);
			}
		},
		remove: function(aTask,callback){
			var removeTaskKey = aTask.id;
			this.contents.splice(removeTaskKey, 1);
			this.saveStorage();
			callback(removeTaskKey);
		},
		saveStorage: function(){
			window.localStorage.setItem('memo', JSON.stringify(this.contents));
		},
		getRandamGag: function(){

			//ajaxでダジャレjson取得
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = checkReadyState;
			xhr.open("GET", "http://killertunes.lolipop.jp/gyagu/gyags.json", false);
			xhr.send(null);

			var randGag;
			function checkReadyState(){
				if ((xhr.readyState == 4) && (xhr.status == 200)){
					var gaygObj = JSON.parse(xhr.responseText);
					var randnum = Math.floor( Math.random() * Object.keys(gaygObj).length);
					var randKeyName = 'gyag' + randnum;
					for(var pname in gaygObj){
						if(pname === randKeyName){
							randGag = gaygObj[pname];
						}
					}
				}
			}
			//ダジャレを一つ返す
			return randGag;
		}
	};

	window.Model = Model;

})();