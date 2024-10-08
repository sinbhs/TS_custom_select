// 초기값 (select 닫혀있음)
let selectCurrentlyOpened:boolean = false;

/**
 * date : 240226
 * last : 240226
 * name : setUiSelect(selector)
 * pram : selector - 커스텀 select 생성 DOM 셀렉터(default : .ui-select)
 * desc : ui select set
 */
function setUiSelect(selector:string):void {
    if ( typeof document !== undefined && !!document.querySelector(selector) ) {
        let uiSelect:NodeListOf<Element> = document.querySelectorAll(selector);
        //console.log(uiSelect);

        uiSelect.forEach((elem:Element):void => {
            // 각 select
            const sel:HTMLSelectElement | null = elem.querySelector('select');

            // select가 있는 경우
            if( sel !== null  ) {
                // 커스텀 select 구조 생성
                const selBox:any = document.createElement('div');
                selBox.className = "ui-select-box";
                selBox.innerHTML = `<button type="button" class="ui-selectmenu-button"><i class="ui-selectmenu-icon"></i><span class="ui-selectmenu-text"></span></button>
                                    <div class="ui-selectmenu-wrap">
                                        <ul class="ui-selectmenu-list"></ul>
                                    </div>`;
                elem.append(selBox);

                // 선택 옵션 값 노출 영역
                const selValShow:Element | null = elem.querySelector('.selected-val-info .fc-red');

                // select 버튼, 텍스트 변수 선언
                let selectButton:Element | null = selBox.querySelector('.ui-selectmenu-button');
                let selText:Element | null = selBox.querySelector('.ui-selectmenu-text');

                // 옵션 구조 추가
                for(let option of Array.from(sel.options)) {
                    let opts:HTMLLIElement = document.createElement('li');
                    opts.className = "ui-menu-item";
                    opts.innerHTML = `<button type="button" class="btn-opt" data-number="${option.index}" ${option.disabled ? 'disabled' : ''} >${option.text}</button>`;
                    selBox.querySelector('.ui-selectmenu-list')?.append(opts);

                    // 옵션 선택
                    opts.querySelector('.btn-opt')?.addEventListener('click', (e:Event):void => {
                        // 옵션 선택 시 .ui-selectmunu-wrap 닫음
                        selectCurrentlyOpened = false;
                        selBox.classList.remove('active');

                        // 이벤트 타겟이 존재하지 않는 경우
                        if(!(e.target instanceof HTMLButtonElement)) return;
                        
                        // 이벤트 타겟이 존재하는 경우
                        selBox.dataset.selected = e.target?.dataset.number;
                        sel.dispatchEvent(new Event('change'));
                    });
                }

                // select [disabled]인 경우 버튼에 disabled class 추가
                if( sel.disabled ) selectButton?.classList.add('ui-state-disabled');

                // 초기 선택값 로드 (select selected draw)
                if(!!selText && !!selValShow) { // 옵션 존재하는 경우
                    selText.innerHTML = sel.options[sel.selectedIndex].text;
                    selValShow.innerHTML = sel.options[sel.selectedIndex].text;
                }
                selBox.dataset.selected = sel.options.selectedIndex;

                // select option 'change' 시
                sel.addEventListener('change', ():void => {
                    if(selBox.dataset.selected != undefined) sel.options[selBox.dataset.selected].selected = true;
                    if(!!selValShow) selValShow.innerHTML = sel.options[sel.selectedIndex].text;
                    if(!!selText) selText.innerHTML = sel.options[sel.selectedIndex].text;
                });

                // select Open/Close
                selectButton?.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if(selectButton?.classList.contains('ui-state-disabled')) return false;
                    // open 상태인 경우 닫음
                    if(selBox.classList.contains('active')) uiSelectClose(selBox);
                    // close 상태인 경우 엶
                    else { // 그 외
                        uiSelectClose(undefined);
                        selectCurrentlyOpened = true;
                        selBox.classList.add('active'); //active 클래스 추가 (드롭다운 display: block)

                        // 드롭다운 영역 포지션을 위한 변수
                        const space:number = window.innerHeight - selBox.getBoundingClientRect().bottom - 10; // 여유 하단 viewport
                        let selMenuHeight:number | undefined = selBox.querySelector('.ui-selectmenu-list')?.clientHeight;// 드롭다운의 높이

                        // viewport select 하단 높이 < 드롭다운 높이인 경우 드롭다운이 select 위로 뜨게함
                        if(selMenuHeight && space < selMenuHeight + 2) {
                            selBox.classList.add('up');
                        } else if (selBox.classList.contains('up')) {
                            selBox.classList.remove('up');
                        }


                    }
                });

            }
        });
    }
}

/**
 * date : 240226
 * last : 240226
 * name : uiSelectClose(selector)
 * pram : selector - open 되어있는 커스텀 select 셀렉터 Close (default : .ui-select-box)
 * desc : open Select Close
 */
function uiSelectClose(selector:any | undefined):void {
    selector = (typeof selector === 'object' ? selector : document.querySelector(selector)) || document.querySelector('.ui-select-box.active');

    if( selectCurrentlyOpened ) {
        selector.classList.remove('active');
        selectCurrentlyOpened = false;
    }
}

// 실행
setUiSelect('.ui-select');

// s: document scroll, click 이벤트
document.addEventListener('scroll', ():void => {
    uiSelectClose(undefined);
});

document.addEventListener('click', ():void => {
    uiSelectClose(undefined);
});
// e: document scroll, click 이벤트