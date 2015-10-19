;(function(){

    var Controller = function(aModel, aView){
        this.model = aModel;
        this.view = aView;
    };

    Controller.prototype = {
        init: function(){

            // イベントセット
            this.SetEvent();

            // 初期表示
            this.SetFirstView();

        },
        SetEvent: function(){

            var self = this;

            // タスク追加時のイベントセット
            this.view.setEvent('add-task',function(aInputVal){
                self.addItem(aInputVal);
            });
        
            // タスク削除時のイベントセット
            this.view.setEvent('remove-task',function(aTask){
                self.removeItem(aTask);
            });

            // 入力欄表示/非表示切り替えイベントセット
            this.view.setEvent('toggle-display');

        },
        SetFirstView: function(){

            var self = this;

            // ランダムでギャグ取得
            var randGyag = this.model.getRandamGag();

            // ビュー初期表示
            this.view.init(randGyag);

            // ストレージに入ってるデータ取得して表示
            this.model.get(function(aData){
                self.view.render('showHistory', aData);
            });

        },
        addItem: function(aInputVal){
            var self = this;
            // ストレージにタスク追加保存
            this.model.save(aInputVal, function(aData){
                self.view.render('showAddItem', aData);
            });
        },
        removeItem: function(aTask){
            var self = this;
            // ストレージ内からタスク削除
            this.model.remove(aTask, function(aTaskId){
                self.view.render('showRemoveItem', aTaskId);
            });
        }
    };

    window.Controller = Controller;
    
})();







