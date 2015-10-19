;(function(){

    var View = function(){
        this.$addBtn = document.getElementById('add-btn');
        this.$removeBtn = document.getElementById('removeBtn');
        this.$openBtn = document.getElementById('open-btn');
        this.$inputArea = document.getElementById('input-area');
        this.$mordalBg = document.getElementById('mordalBg');
        this.$input = document.getElementById('input-task');
        this.$inputCloseBtn = document.getElementById('input-close-btn');
        this.$gyagArea = document.getElementById('gyagArea');
        this.$outputList = document.getElementById('output-list');
        this.$selectLi = '';
    };

    View.prototype = {

        // タスクのid
        taskID : 0,

        init: function(aRandGayg){

            // ダジャレ表示
            this.showGyag(aRandGayg);

        },
        setEvent: function(aEvent, aHandler){
            
            var self = this;
            
            aHandler = aHandler || function(){};

            // プラン追加時のイベント
            if(aEvent === 'add-task'){
                this.$addBtn.addEventListener('click', addTask, false);
            }
            // プラン削除時のイベント
            else if(aEvent === 'remove-task'){
                self.selectTask();
                this.$removeBtn.addEventListener('click', rmTask, false);
                this.$outputList.addEventListener('click', function(event){
                    if(event.target.tagName === 'SPAN'){
                        rmTask();
                    }
                }, false);
            }
            // 入力ボックス表示/非表示のイベント
            else if(aEvent === 'toggle-display'){
                this.$openBtn.addEventListener('click', toggleDisplay, false);
                this.$inputCloseBtn.addEventListener('click', toggleDisplay, false);

                // フォーカスしたらテキスト削除
                this.$input.addEventListener('focus', function(event){
                    event.target.value = '';
                }, false);
            }


            // 表示/非表示をきりかえ
            function toggleDisplay(){
                self.$mordalBg.style.display = self.$mordalBg.style.display === 'block' ? 'none' : 'block';
                
                // 無理矢理fadeIn、fadeOut,,,,
                if (self.$inputArea.className != 'fadeout') {
                    self.$inputArea.className = 'fadeout';
                    setTimeout(function(){
                        self.$inputArea.style.display = 'none';
                    }, 500);
                } else {
                    self.$inputArea.style.display = 'block';
                    setTimeout(function(){
                        self.$inputArea.className = 'fadein';
                    }, 100);
                }
            }

            // プラン追加
            function addTask(){
                if(!self.$input.value){
                    alert('入力欄が空です');
                    return;
                }
                aHandler(self.$input.value);
            }

            // プラン削除
            function rmTask(){
                if(!self.$selectLi){
                    alert('選択してください');
                    return;
                }
                aHandler(self.$selectLi);
            }
        },
        render: function(aViewCmd, aData){
            var self = this;
            var viweCommands = {
                showHistory: function(){
                    var $fragment = document.createDocumentFragment();
                    for(var cnt = 0, len=aData.length; cnt < len; cnt++){
                        $fragment.appendChild(self.createTask(aData[cnt]));
                    }
                    self.showTodoList($fragment);
                },
                showAddItem: function(){
                    self.showTodoList(self.createTask(aData));
                },
                showRemoveItem: function(aTaskId){
                    self.removeTask(aTaskId);
                },
            };
            viweCommands[aViewCmd](aData);
        },
        createTask: function(aData){
            var $li = document.createElement('li');
            $li.setAttribute('ID', this.createTaskId());
            var task = document.createTextNode(aData.text);
            $li.appendChild(task);
            return $li;
        },
        createTaskId: function(){
            return this.taskID++;
        },
        selectTask: function(){
            var self = this;

            // タッチでセレクト
            this.$outputList.addEventListener('click', function(evt){
                if(evt.target.tagName === 'LI'){
                    self.clearBgColor();
                    self.changeBgColor(evt.target);
                    self.$selectLi = evt.target;
                }
            }, false);

            // フリックでセレクト
            this.$outputList.addEventListener("touchstart", touchHandler, false);
            this.$outputList.addEventListener("touchmove", touchHandler, false);
            this.$outputList.addEventListener("touchend", touchHandler, false);

            var startX = 0;
            var currentX = 0;

            // タッチした時のハンドリング
            function touchHandler(evt){
                var touch = evt.touches[0];

                if(evt.target.tagName === 'LI'){

                    // タッチスタート
                    if(evt.type === "touchstart"){
                        startX = touch.clientX;
                    }
                    // 移動中
                    else if(evt.type === "touchmove"){
                        currentX = touch.clientX;
                        evt.target.style.left = - (50 - currentX / 10) + 'px'; // 調整
                    }
                    // 移動終了
                    else if(evt.type === "touchend"){
                        var MOVE_NUM = (currentX - startX);
                        var SWIPE_BORDER = -300;
                        if(MOVE_NUM < SWIPE_BORDER){

                            if(evt.target.getElementsByTagName('span').length === 0){
                                evt.target.appendChild(self.CreateRemoveTag());
                                self.$selectLi = evt.target;
                            }

                        } else {
                            evt.target.style.left = '0px';
                            var spanNode = null;
                            spanNode = evt.target.getElementsByTagName('span');
                            if(spanNode.length !== 0){
                                evt.target.removeChild(spanNode[0]);
                                self.$selectLi = '';
                            }
                        }

                        MOVE_NUM = 0;

                    }
                }
            }
        },
        CreateRemoveTag:function(){
            $removeElem = document.createElement('span');
            $removeElem.innerHTML = '削除';
            $removeElem.style.textAlign = 'center';
            $removeElem.style.width = '50px';
            $removeElem.style.display = 'inline-block';
            $removeElem.style.backgroundColor = 'red';
            return $removeElem;
        },
        changeBgColor:function(aElm){
            aElm.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        },
        clearBgColor: function(){
            var liArray = this.$outputList.childNodes;
            for(var cnt=0, len=liArray.length; cnt < len; cnt++){
                if(liArray[cnt].tagName === 'LI'){
                    liArray[cnt].style.backgroundColor = 'initial';
                }
            }
        },
        showTodoList: function($aElm){
            this.$outputList.appendChild($aElm);
        },
        removeTask: function(aTaskId){
            var removeNode = document.getElementById(aTaskId);
            if(removeNode){
                this.$outputList.removeChild(removeNode);
            }
        },
        // ランダムダジャレ表示
        showGyag: function(aRandGayg){
            this.$gyagArea.innerHTML = aRandGayg;
        },
    };

    window.View = View;

})();



