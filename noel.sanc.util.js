/**
 * CHAIN SELECT UTILITY
 * @Author NOEL
 */

/**
 * @typedef _sancAttribute
 * @property {_codeEnum} SANC_LINE_STATUS_ENUM
 * @property {_codeEnum} SANCER_DIV_ENUM
 * @property {_codeEnum} SANC_DIV_ENUM
 */
/**
 * @typedef _mgrAttribute
 * @property {String} mgrId
 * @property {String} deptCd
 * @property {String} mgrNm
 * @property {String} deptNm
 * @property {String} gradeNm
 * @property {String} roleNm
 * @property {String} telephone
 * @property {String} fax
 * @property {String} mobile
 * @property {String} email
 * @property {String} moDeptCd
 * @property {String} moDeptNm
 * @property {String} positionCd
 * @property {String} sancLinePstnNm
 * @property {String} levelCd
 * @property {String} levelNm
 * @property {String} deptTelNum
 */
/**
 * @typedef _sancLineJson
 * @property {String} sancSeq
 * @property {Integer} sancLineNo
 * @property {Integer} orderNo
 * @property {String} sancLineMgrId
 * @property {String} sancLineDeptCd
 * @property {String} sancDivCd
 * @property {String} sancerDivCd
 * @property {String} sancLineStatusCd
 * @property {String} sancLineMgrNm
 * @property {String} sancLineDeptNm
 * @property {String} sancDivNm
 * @property {String} sancerDivNm
 * @property {String} sancLineStatusNm
 */
/**
 * @typedef _codeEnum
 * @property {String} code
 * @property {String} name
 */

/**
 * @typedef _sancerInfo
 * @property {String} sancerDiv - dept, mgr
 * @property {String} sancerId - deptCd, mgrId
 */

(function (root, factory, sancConst, init) {
    if (!root['$N']) throw new Error('nlib[common.js] is required');
    root['$N']['sanc'] = root['$N']['sanc'] || factory;
    Object.values(sancConst).forEach(_enum => {
        _enum.findByCode = function (_code) {
            return rslt = Object.entries(this).reduce((_result, [_k, _v]) => {
                return _v?.code === _code ? this[_k] : _result;
            }, {})
        }
    })
    root['$N']['sancConst'] = root['$N']['sancConst'] || sancConst;
})(window,
    {

        init: () => {
            $N.sanc.sancerTableBuilder();
        },

        /**
         * 결재 요청 팝업
         * @param {String} _callback
         * @param {_sancerInfo[]} _sancerInfo
         */
        sancReqPop: (_callback, _sancerInfo, modalId) => {
            window["sancerInfo"] = $N.isEmpty(_sancerInfo) ? null : $N.isArray(_sancerInfo) ? _sancerInfo : [_sancerInfo];
            window["sancCallback"] = _callback;
            window["currentMenuId"] = window.frameElement.id;

            $.salmon.modal({
                width: 1550, height: 820,
                pid: parent?.Ext?.WindowManager?.getActive()?.id,
                url: CTX_PATH + '/bo/base/sanc/RESY01004p.do'
            });
        },
        /**
         * 결재관리 페이지 호출
         */
        sancPage: () => {
            if (!confirm("결재함 페이지로 이동합니다. 계속하시겠습니까?")) return;

            top.$.explorer.loadPage('RESY01');
        },
        /**
         * 결재선 팝업 조회
         */
        sancViewPop: () => {

        },
        /**
         * 고정결재선 요청 팝업
         * @param _callback
         * @param _sancerInfo
         */
        fixedSancReqPop: (_callback, _sancerInfo) => {
            window["sancerInfo"] = $N.isEmpty(_sancerInfo) ? null : $N.isArray(_sancerInfo) ? _sancerInfo : [_sancerInfo];
            window["sancCallback"] = _callback;
            window["currentMenuId"] = window.frameElement.id;

            $.salmon.modal({
                width: 850, height: 350,
                url: CTX_PATH + '/bo/base/sanc/p_fixedReqForm.do'
            });
        },

        /**
         * 결재 수행 팝업
         * @param _sancInfo
         */
        sancExecutePop: (_sancInfo) => {
            $.salmon.modal({
                width: 1500, height: window.innerHeight + 100,
                url: CTX_PATH + `/bo/base/sanc/RESY01002p.do?sancSeq=${_sancInfo.sancSeq}&ledgrSancSeq=${_sancInfo.ledgrSancSeq}`
            });
        },

        /**
         * 연속 결재 팝업
         */
        multiSancPop: () => {

            localStorage.setItem("searchForm", JSON.stringify($N.formToJson("#searchForm")));

            $.salmon.modal({
                width: 1800, height: window.innerHeight + 100,
                url: CTX_PATH + `/bo/base/sanc/RESY01002mp.do`
            });
        },

        /**
         * 결재 수행 폼
         * @param _tgtNodeSelector
         * @param _sancSeq
         * @param _callback
         * @param _args
         */
        sancForm: (_tgtNodeSelector, _sancSeq, _callback, ..._args) => {
            window["sancCallback"] = _callback;
            window["sancCallbackArgs"] = _args;

            $.salmon.load(_tgtNodeSelector, CTX_PATH + '/bo/base/sanc/a_sancForm.do?sancSeq=' + _sancSeq, null, () => { });

        },

        /**
         * 결재 아이템 클릭 이벤트 처리
         */
        addEventListenerOnSancItems: () => {
            const sancItems = document.querySelectorAll('.sanc-item-div');

            sancItems.forEach(item => {
                item.addEventListener('click', () => {
                    // 이미 다른 아이템의 clicked 클래스를 해제할 경우 필요
                    sancItems.forEach(i => i.classList.remove('clicked'));

                    // 현재 클릭된 요소에만 clicked 클래스 적용
                    item.classList.add('clicked');
                });
            });
        },
        /**
         * 공통 결재 애니메이션 (아이콘 / 색상 / 폭죽)
         * @param {String} targetSelector 폭죽 혹은 아이콘을 놓을 대상
         * @param {String} svgIcon 교체할 SVG 아이콘
         * @param {String} fillColor 최종 변경될 fill 색상
         * @param {Boolean} [withFirework=false] 폭죽 애니메이션 실행 여부
         */
        multiSancAnimation: function (targetSelector, svgIcon, fillColor, withFirework = false) {
            const itemDiv = document.querySelector(targetSelector);
            const iconDiv = document.querySelector(".sanc-item-icon-div");
            let icon = iconDiv.querySelector('svg');

            // 1) SVG 아이콘 교체
            icon.outerHTML = svgIcon;
            icon = iconDiv.querySelector('svg');

            // 2) 팝 애니메이션
            this.popIcon(icon);

            // 3) 폭죽 애니메이션 (승인 시에만 실행)
            if (withFirework) {
                this.createFirework(iconDiv);
            }

            // 4) 색상 전환 (0.2초 뒤 실행)
            setTimeout(() => {
                icon.querySelector('path').setAttribute('fill', fillColor);
            }, 200);
        },

        sancAnimation : function(sancAction, targetSelector) {
            if ( sancAction === 'APPROVE') {
                this.multiSancApproveAnimation(targetSelector);
            } else if ( sancAction === 'DENY') {
                this.multiSancDenyAnimation(targetSelector);
            }
        },
        /**
         * 승인(Approve) 애니메이션
         * @param {String} targetSelector
         */
        multiSancApproveAnimation: function (targetSelector) {
            this.multiSancAnimation(
                targetSelector,
                $N.sancConst.SVG.CHECK_READY,
                '#6BBE66',
                true // 폭죽 애니메이션 실행
            );
        },

        /**
         * 반려(Deny) 애니메이션
         * @param {String} targetSelector
         */
        multiSancDenyAnimation: function (targetSelector) {
            this.multiSancAnimation(
                targetSelector,
                $N.sancConst.SVG.CHECK_DENY,
                '#FF4141',
                false // 폭죽 애니메이션은 실행 안 함
            );
        },

        /**
         * 아이콘 흔들기
         * @param {HTMLElement} element 아이콘 요소
         */
        popIcon: function (element) {
            element.classList.remove('nitro-pop');
            // 강제 리플로우로 애니메이션 재시작
            void element.offsetWidth;
            element.classList.add('nitro-pop');
        },

        /**
         * 폭죽이펙트 SVG 생성
         * @param {HTMLElement} parentEl 폭죽이펙트 SVG를 추가할 부모 요소
         */
        createFirework: function (parentEl) {
            // 폭죽이펙트 SVG 준비
            const fireworkSVG = $N.sancConst.SVG.FIREWORK;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = fireworkSVG;
            const explosion = tempDiv.firstElementChild;

            parentEl.style.position = 'relative';
            parentEl.appendChild(explosion);

            // 0.5초 뒤 제거
            setTimeout(() => {
                explosion?.remove();
            }, 500);
        },

        /**
         * 결재선 정보 획득
         */
        getSancLine: () => {
            return window["sancLineInfo"];
        },
        /**
         * 참조자 정보 획득
         */
        getSancRef: () => {
            return window["sancRefInfo"];
        },

        /**
         * 결재선 텍스트화
         * @returns {String}
         */
        getSancLineStr: () => {
            let sancLine = $N.sanc.getSancLine();
            return sancLine.map(_item => {
                return `${_item.sancLineMgrNm || _item.sancLineDeptNm}(${_item.sancerDivNm})`
            }).join('→');
        },

        /**
         * 참조자 텍스트화
         * @returns {String}
         */
        getSancRefStr: () => {
            let refLine = $N.sanc.getSancRef();
            return refLine.map(_item => {
                return `${_item.sancRefMgrNm || _item.sancRefDeptNm}`
            }).join(', ');
        },

        /**
         * 결재요청중인 결재 정보 획득
         */
        drawProgressSancList: async () => {

            let searchForm = JSON.parse(localStorage.getItem("searchForm"));

            let resp = await $N.fetchSimple(CTX_PATH + "/bo/base/sanc/j_list.do",
                $N.mergeDeep(searchForm, { perPage : 999 }),
                "POST" );

            resp.dataList.forEach((_item, _idx) => {
                let listDiv = document.qs("#listDiv");

                let itemEl = $N.createHTMLElement($N.sancConst.MULTI_SANC_LIST_ITEM);
                itemEl.id = "sanc_" + _item.sancSeq;
                $N.describe(_item, itemEl);

                listDiv.append(itemEl);
            })
        },
        /**
         * 결재 정보 DB 조회
         * @param sancSeq
         * @returns {Promise<*|*[]>}
         */
        fetchSanc: async (sancSeq) => {
            if ($N.isEmpty(sancSeq)) return null;
            return await $N.fetchSimple(CTX_PATH + "/bo/base/sanc/j_viewSanc.do", { sancSeq }, "POST")
        },
        /**
         * 결재선 정보 DB 조회
         * @param sancSeq
         * @returns {Promise<*|*[]>}
         */
        fetchSancLine: async (sancSeq) => {
            if ($N.isEmpty(sancSeq)) return [];
            return await $N.fetchSimple(CTX_PATH + "/bo/base/sanc/j_sancLineList.do", { sancSeq }, "POST")
        },

        /**
         * 참조자 정보 DB 조회
         * @param sancSeq
         * @returns {Promise<*|*[]>}
         */
        fetchSancRef: async (sancSeq) => {
            if ($N.isEmpty(sancSeq)) return [];
            return await $N.fetchSimple(CTX_PATH + "/bo/base/sanc/j_sancRefList.do", { sancSeq }, "POST")
        },

        /**
         * 결재선 지정 팝업 콜백
         * @param _sancerInfo
         * @param _refInfo
         */
        defaultSancAssignCallback: (_sancerInfo, _refInfo) => {

            let sancLineEls = document.querySelectorAll("[name=sancLineJson]");
            let sancRefEls = document.querySelectorAll("[name=sancRefJson]");

            if ($N.isEmpty(sancLineEls))
                console.error(`결재선 JSON정보를 담을 Element가 존재하지 않습니다. form내부에 <input name="hidden" id="sancLineJson">을 생성해주세요.`);
            if ($N.isEmpty(sancRefEls))
                console.error(`참조자 JSON정보를 담을 Element가 존재하지 않습니다. form내부에 <input name="hidden" id="sancRefJson">을 생성해주세요.`);

            document.querySelectorAll("[name=sancLineJson]").forEach(_el => {
                _el.value = JSON.stringify(_sancerInfo);
            })
            document.querySelectorAll("[name=sancRefJson]").forEach(_el => {
                _el.value = JSON.stringify(_refInfo);
            })

            $N.sanc.sancerTableBuilder(_sancerInfo, _refInfo);
        },


        /**
         * 결재선/참조자 정보 HTML 빌더
         * @param {String|HTMLElement} _tgtEl
         * @param {Object[]} _sancList
         * @param {Object[]} _refList
         * @param {boolean} [isView] true일 경우 결재선 지정 버튼 숨김처리
         * @param {String} [_divId] sancBox를 표시할 DIV ID
         */
        sancerTableBuilder: (_sancList = [], _refList = [], _isView = false, _divId = "sancBox") => {
            $N.sanc.sancerTableBuilderExt({ sancList: _sancList, refList: _refList, isView: _isView, divId: _divId });
        },

        /**
         * 결재선/참조자 정보 HTML 빌더
         * @param {Object[]} _obj.sancList
         * @param {Object[]} _obj.refList
         * @param {boolean} [_obj.isView] true일 경우 결재선 지정 버튼 숨김처리
         * @param {String} [_obj.divId] sancBox를 표시할 DIV ID
         * @param {String} [_obj.title] 결재선/참조자 제목
         */
        sancerTableBuilderExt: (_obj) => {

            // _obj ->  _sancerInfo= [], _refInfo = [], isView = false, _divId = "sancBox"
            let _sancerInfo = _obj.sancList || [];
            let _refInfo = _obj.refList || [];
            let _isView = _obj.isView || false;
            let _divId = _obj.divId || "sancBox";
            let _title = _obj.title || "";
            let whenNoData = _obj.whenNoData || "";


            let sancBoxEl = document.querySelector("#" + _divId);
            if (!sancBoxEl) {
                console.error(`결재선/참조자 정보를 표시할 Element가 존재하지 않습니다. <div id='${_divId}'>를 생성해주세요.`);
                return;
            }

            if (whenNoData === "hide") {
                if ($N.isEmpty(_sancerInfo) && $N.isEmpty(_refInfo)) {
                    sancBoxEl.style.display = "none";
                    return;
                }
            }

            let _sancerInfoCopy = $N.deepcopy(_sancerInfo)
            let _refInfoCopy = $N.deepcopy(_refInfo)
            _sancerInfoCopy.forEach(_item => _item.exeDt = '');
            _refInfoCopy.forEach(_item => _item.cnfrmDt = '');

            $N.setValueIfExists("#sancLineJson", JSON.stringify(_sancerInfoCopy));
            $N.setValueIfExists("#sancRefJson", JSON.stringify(_refInfoCopy));

            sancBoxEl.innerHTML = '';

            if ($N.isNotEmpty(_title)) {
                let sancTitle = $N.createHTMLElement($N.sancConst.SANC_TITLE_HTML(_title));
                $N.appendHTMLElement(sancBoxEl, sancTitle);
            }

            let sancLineHeader = $N.createHTMLElement($N.sancConst.SANC_LINE_HEADER_HTML(_divId));
            let sancLineText = $N.createHTMLElement($N.sancConst.SANC_LINE_HEADER_TEXT);
            let sancLineDiv = $N.createHTMLElement($N.sancConst.SANC_LINE_DIV_HTML);
            let sancLineTable = $N.createHTMLElement($N.sancConst.SANC_LINE_TABLE_HTML);
            let sancRefHeader = $N.createHTMLElement($N.sancConst.SANC_REF_HEADER_HTML);
            let sancRefTable = $N.createHTMLElement($N.sancConst.SANC_REF_TABLE_HTML);

            let sancLineTbody = sancLineTable.querySelector("tbody");
            let sancRefTbody = sancRefTable.querySelector("tbody");

            if ($N.isEmpty(_sancerInfo)) {
                $N.appendHTMLElement(sancLineTbody, $N.createHTMLElement($N.sancConst.SANC_LINE_EMPTY_ROW_HTML));
            }
            if ($N.isEmpty(_refInfo)) {
                $N.appendHTMLElement(sancRefTbody, $N.createHTMLElement($N.sancConst.SANC_REF_EMPTY_ROW_HTML));
            }

            _sancerInfo.forEach((_sancer, _idx) => {
                let sancerLineTr = $N.createHTMLElement($N.sancConst.SANC_LINE_ROW_HTML);
                $N.describe(_sancer, sancerLineTr);
                $N.appendHTMLElement(sancLineTbody, sancerLineTr);
            });

            _refInfo.forEach((_ref, _idx) => {
                let sancerLineTr = $N.createHTMLElement($N.sancConst.SANC_REF_ROW_HTML);
                $N.describe(_ref, sancerLineTr);
                $N.appendHTMLElement(sancRefTbody, sancerLineTr);
            });

            $N.appendHTMLElement(sancLineDiv, sancLineText);
            $N.appendHTMLElement(sancLineDiv, sancLineTable);
            $N.appendHTMLElement(sancLineDiv, sancRefHeader);
            $N.appendHTMLElement(sancLineDiv, sancRefTable);
            $N.appendHTMLElement(sancBoxEl, sancLineHeader);
            $N.appendHTMLElement(sancBoxEl, sancLineDiv);

            if (_isView) {
                document.querySelector(`#${_divId} #sancReqBtn`).style.display = "none";
            }
        },

        /**
         * 결재선 HTML다이어그램 Builder
         * @param {_mgrAttribute} _mgrInfo
         * @param {[_sancAttribute]} _sancAttribute
         * @returns {HTMLElement}
         */
        sancerDiagramBuilder(_mgrInfo, _sancAttribute) {

            let { sancLineStatusCd, sancDivCd, sancerDivCd, activeCd } = _mgrInfo

            _mgrInfo.id = _mgrInfo?.mgrId || _mgrInfo?.sancLineMgrId || _mgrInfo.deptCd || _mgrInfo.sancLineDeptCd;
            _mgrInfo.nm = _mgrInfo?.mgrNm || _mgrInfo?.sancLineMgrNm || _mgrInfo.deptNm || _mgrInfo.sancLineDeptNm;

            _sancAttribute = _sancAttribute || {
                SANC_LINE_STATUS_ENUM: $N.sancConst.SANC_LINE_STATUS_ENUM.findByCode(sancLineStatusCd),
                SANC_DIV_ENUM: $N.sancConst.SANC_DIV_ENUM.findByCode(sancDivCd),
                SANCER_DIV_ENUM: $N.sancConst.SANCER_DIV_ENUM.findByCode(sancerDivCd),
                ACTIVE_ENUM: $N.sancConst.ACTIVE_ENUM.findByCode(activeCd)
            }
            let isProgress = activeCd === 'PRG'

            let activeSpan = $N.isEmpty(_sancAttribute.ACTIVE_ENUM) ? '' :
                `<span class="badge ${_sancAttribute.ACTIVE_ENUM.code} ${isProgress ? 'blinking' : ''} ">${_sancAttribute.ACTIVE_ENUM.name}</span>`;
            let positionDiv = $N.isEmpty(_mgrInfo.sancLinePstnNm) ? `<div class="border-bottom-dashed-1 mb-2 pb-1 position-div"></div>` :
                `<div class="border-bottom-dashed-1 mb-2 pb-1 position-div">${_sancAttribute.SANCER_DIV_ENUM.code == $N.sancConst.SANCER_DIV_ENUM.REQUESTER.code ? '기안' : _mgrInfo.sancLinePstnNm}</div>`;

            let sancDtDiv = `<div class="sanc-dt">${_mgrInfo?.exeDt || ''}</div>`;
            let switchBtn = window["GLOBAL"]["IS_DEV"] ? `<i class="fa fa-thumbs-o-up"></i>` : '';

            let diagramDiv =
                $N.createHTMLElement(`<div class="voc-sancer-item ${isProgress ? 'border-dashed-1' : ''}" id="id_${_mgrInfo.id}">
                ${positionDiv}
                <img src="/resources/layout/EXB/images/flamingo/sanc/sancer.png" alt="${_mgrInfo.nm}" class=".sancerImg">
                <span class="sancerNm">
                    <input type="hidden" value="${_mgrInfo.id}"/>
                    <span class="sancer-name">${_mgrInfo.nm} (${_mgrInfo.id})<span>${switchBtn}
                    <span class="badge ${_sancAttribute.SANCER_DIV_ENUM.code}">${_sancAttribute.SANCER_DIV_ENUM.name}</span>
                    ${activeSpan}
                    ${sancDtDiv}
                </span>
            </div>`);

            diagramDiv.querySelectorAll("i")?.forEach(_i => {
                _i.onclick = function () {
                    let tgt = this.closest("span.sancerNm").querySelector("input[type=hidden]").value;
                    window.open(CTX_PATH + "/sso/login_test.jsp?mgrId=" + tgt)
                }
            })

            return diagramDiv;
        },
        simpleSancerDiagramBuilder(_mgrInfoArr) {

            let diagramDiv = $N.createHTMLElement(`<div class="d-flex mb-2 text-center align-items-center justify-content-center flex-row" id="diagramDiv"></div>`);

            let itemArr = _mgrInfoArr.map((_mgrInfo, _idx) => {

                let { sancLineStatusCd, sancDivCd, sancerDivCd, activeCd } = _mgrInfo

                _mgrInfo.id = _mgrInfo?.mgrId || _mgrInfo?.sancLineMgrId || _mgrInfo.deptCd || _mgrInfo.sancLineDeptCd;
                _mgrInfo.nm = _mgrInfo?.mgrNm || _mgrInfo?.sancLineMgrNm || _mgrInfo.deptNm || _mgrInfo.sancLineDeptNm;
                _mgrInfo.deptCd = _mgrInfo.deptCd || _mgrInfo.sancLineDeptCd;
                _mgrInfo.deptNm = _mgrInfo.deptNm || _mgrInfo.sancLineDeptNm;

                if (_mgrInfo.id === _mgrInfo.deptCd) _mgrInfo.deptNm = '';

                let _sancAttribute = {
                    SANC_LINE_STATUS_ENUM: $N.sancConst.SANC_LINE_STATUS_ENUM.findByCode(sancLineStatusCd),
                    SANC_DIV_ENUM: $N.sancConst.SANC_DIV_ENUM.findByCode(sancDivCd),
                    SANCER_DIV_ENUM: $N.sancConst.SANCER_DIV_ENUM.findByCode(sancerDivCd),
                    ACTIVE_ENUM: $N.sancConst.ACTIVE_ENUM.findByCode(activeCd)
                }

                let itemDiv = $N.createHTMLElement(`
                    <div class="itemDiv">
                        <div class="svgDiv"></div>
                        <div class="deptDiv"></div>
                        <div class="nameDiv"></div>
                    </div>
                `)

                let isProgress = $N.sancConst.ACTIVE_ENUM.PROGRESS.code === _sancAttribute.ACTIVE_ENUM.code

                switch (_sancAttribute.SANC_LINE_STATUS_ENUM.code) {
                    case $N.sancConst.SANC_LINE_STATUS_ENUM.REQUEST.code:
                        itemDiv.qs(".svgDiv").append($N.createHTMLElement($N.sancConst.SVG.REQUEST));
                        break;
                    case $N.sancConst.SANC_LINE_STATUS_ENUM.READY.code:
                        itemDiv.qs(".svgDiv").append($N.createHTMLElement(isProgress ? $N.sancConst.SVG.READY : $N.sancConst.SVG.PENDING));
                        break;
                    case $N.sancConst.SANC_LINE_STATUS_ENUM.APPROVE.code:
                        itemDiv.qs(".svgDiv").append($N.createHTMLElement($N.sancConst.SVG.APPROVE));
                        break;
                    case $N.sancConst.SANC_LINE_STATUS_ENUM.DENY.code:
                        itemDiv.qs(".svgDiv").append($N.createHTMLElement($N.sancConst.SVG.DENY));
                        break;
                    case $N.sancConst.SANC_LINE_STATUS_ENUM.ROLLBACK.code:
                        itemDiv.qs(".svgDiv").append($N.createHTMLElement($N.sancConst.SVG.ROLLBACK));
                        break;
                }

                itemDiv.qs(".deptDiv").innerText = _mgrInfo.deptNm
                itemDiv.qs(".nameDiv").innerText = _mgrInfo.nm;

                isProgress && itemDiv.classList.add('blinking');

                return itemDiv;
            });

            itemArr.forEach((_item, _idx) => {
                diagramDiv.append(_item);
                if ($N.isNotEmpty(itemArr[_idx + 1])) diagramDiv.append($N.createHTMLElement(`<div class="sanc-line"></div>`))
            })

            return diagramDiv;
        },
        /**
         * 결재선 HTML다이어그램 Builder
         * @param {_mgrAttribute} _mgrInfo
         * @returns {HTMLElement}
         */
        refDiagramBuilder(_mgrInfo) {

            _mgrInfo.id = _mgrInfo?.mgrId || _mgrInfo?.sancRefMgrId || _mgrInfo.deptCd || _mgrInfo.sancRefDeptCd;
            _mgrInfo.nm = _mgrInfo?.mgrNm || _mgrInfo?.sancRefMgrNm || _mgrInfo.deptNm || _mgrInfo.sancRefDeptNm;

            let positionDiv = `<div class="border-bottom-dashed-1 mb-2 pb-1 position-div">${_mgrInfo.sancRefPstnNm || ''}</div>`;

            let refCnfrmDt = `<div class="sanc-dt">${_mgrInfo?.cnfrmDt || ''}</div>`;
            let isConfirm = $N.isEmpty(_mgrInfo.cnfrmDt);

            let diagramDiv =
                $N.createHTMLElement(`<div class="voc-sancer-item" id="id_${_mgrInfo.id}">
                ${positionDiv}
                <span class="sancerNm">
                    <input type="hidden" value="${_mgrInfo.id}"/>
                    <span class="sancer-name">${_mgrInfo.nm} (${_mgrInfo.id})<span>
                    <span class="badge ${isConfirm ? 'REF' : 'CNF'}">${isConfirm ? '참조' : '확인'}</span>
                    ${refCnfrmDt}
                </span>
            </div>`);

            return diagramDiv;
        },

        /**
         * 결재선 정보 JSON BUILDER
         * @param {_mgrAttribute} _item
         * @param {[_sancAttribute]} _sancAttribute
         * @param {Integer} _sancLineNo
         * @param {Integer} _orderNo
         * @returns {_sancLineJson}
         */
        sancLineJsonBuilder: (_item, _sancAttribute, _sancLineNo, _orderNo = 1) => {

            if ($N.isEmpty(_item)) throw new Error("[_item] param is required");
            if ($N.isEmpty(_sancLineNo)) throw new Error("[_sancLineNo] param is required");

            let { sancLineStatusCd, sancDivCd, sancerDivCd, activeCd } = _item

            _sancAttribute = _sancAttribute || {
                SANC_LINE_STATUS_ENUM: $N.sancConst.SANC_LINE_STATUS_ENUM.findByCode(sancLineStatusCd),
                SANC_DIV_ENUM: $N.sancConst.SANC_DIV_ENUM.findByCode(sancDivCd),
                SANCER_DIV_ENUM: $N.sancConst.SANCER_DIV_ENUM.findByCode(sancerDivCd),
                ACTIVE_ENUM: $N.sancConst.ACTIVE_ENUM.findByCode(activeCd)
            }

            _item.exeDt = '';

            return $N.mergeDeep(_item, {
                sancLineNo: _sancLineNo,
                orderNo: _orderNo,
                sancLineMgrId: _item.sancLineMgrId || _item.mgrId || '',
                sancLineDeptCd: _item.sancLineDeptCd || _item.deptCd || '',
                sancLineMgrNm: _item.sancLineMgrNm || _item.mgrNm || '',
                sancLineDeptNm: _item.sancLineDeptNm || _item.deptNm || '',
                sancLinePstnCd: _item.sancLinePstnCd || _item.pstnCd || '',
                sancLinePstnNm: _item.sancLinePstnNm || _item.pstnNm || '',
                sancLineOndtCd: _item.sancLineOndtCd || _item.ondtCd || '',
                sancLineOndtNm: _item.sancLineOndtNm || _item.ondtNm || '',
                sancDivCd: _sancAttribute.SANC_DIV_ENUM.code,
                sancerDivCd: _sancAttribute.SANCER_DIV_ENUM.code,
                sancLineStatusCd: _sancAttribute.SANC_LINE_STATUS_ENUM.code,
                sancDivNm: _sancAttribute.SANC_DIV_ENUM.name,
                sancerDivNm: _sancAttribute.SANCER_DIV_ENUM.name,
                sancLineStatusNm: _sancAttribute.SANC_LINE_STATUS_ENUM.name,
            })
        },
        /**
         * 참조자 정보 JSON BUILDER
         * @param {_mgrAttribute} _item
         * @param {Integer} _sancRefNo
         * @returns {_sancLineJson}
         */
        sancRefJsonBuilder: (_item, _sancRefNo) => {

            if ($N.isEmpty(_item)) throw new Error("[_item] param is required");
            if ($N.isEmpty(_sancRefNo)) throw new Error("[_sancRefNo] param is required");

            let { sancLineStatusCd, sancDivCd, sancerDivCd, activeCd } = _item

            _item.cnfrmDt = '';
            _item.cnfrmYn = '';

            return $N.mergeDeep(_item, {
                sancRefNo: _sancRefNo,
                sancRefMgrId: _item.sancRefMgrId || _item.mgrId || '',
                sancRefDeptCd: _item.sancRefDeptCd || _item.deptCd || '',
                sancRefMgrNm: _item.sancRefMgrNm || _item.mgrNm || '',
                sancRefDeptNm: _item.sancRefDeptNm || _item.deptNm || '',
                sancRefPstnCd: _item.sancRefPstnCd || _item.pstnCd || '',
                sancRefPstnNm: _item.sancRefPstnNm || _item.pstnNm || '',
                sancRefOndtCd: _item.sancRefOndtCd || _item.ondtCd || '',
                sancRefOndtNm: _item.sancRefOndtNm || _item.ondtNm || ''
            })
        },
    },
    {
        SANCER_DIV_ENUM: {
            REQUESTER: { code: "REQR", name: "상신자" },
            SANCER: { code: "SANC", name: "결재자" },
            REFERRER: { code: "REFR", name: "참조자" },
        },
        SANC_DIV_ENUM: {
            REQUEST: { code: "SD00", name: "상신" },
            NORMAL: { code: "SD10", name: "일반" },
            PARALLEL_ALL: { code: "SD20", name: "병렬 합의" },
            PARALLEL_PRIOR: { code: "SD21", name: "병렬 선결" },
            PARALLEL_MAJOR: { code: "SD22", name: "병렬 과반" },
            ARBITRARY: { code: "SD99", name: "전결" },
        },
        SANC_LINE_STATUS_ENUM: {
            REQUEST: { code: "SLS00", name: "상신" },
            READY: { code: "SLS01", name: "대기" },
            APPROVE: { code: "SLS02", name: "승인" },
            DENY: { code: "SLS03", name: "반려" },
            ROLLBACK: { code: "SLS04", name: "회수" },
        },
        SANC_STATUS_ENUM: {
            REGIST: { code: "S01", name: "임시저장" },
            REQUEST: { code: "S02", name: "결재요청" },
            ACCEPT: { code: "S03", name: "승인" },
            DENY: { code: "S04", name: "반려" },
            CANCEL: { code: "S98", name: "결재취소" },
            ROLLBACK: { code: "S99", name: "회수" }
        },
        ACTIVE_ENUM: {
            READY: { code: "RDY", name: "대기" },
            PROGRESS: { code: "PRG", name: "진행" },
            COMPLETE: { code: "CPL", name: "완료" },
        },
        SANC_TITLE_HTML: (_title) => `
            <span class="badge SANC_DIV d-block">${_title}</span>
        `,
        SANC_LINE_HEADER_HTML: (_divId) => `
            <div class="sm-header both" style="margin-top: 10px; position: relative; z-index: 999;">
                <div class="right page-buttons" id="sancBoxBtnDiv">
                    <button type="button" id="sancPageBtn" class="btn btn-outline-secondary btn-sm" onclick="$N.sanc.sancPage();">내 결재함</button>
                    <button type="button" id="sancReqBtn" class="btn btn-outline-secondary btn-sm" onclick="$N.sanc.sancReqPop();">결재선</button>
                    <button type="button" id="${_divId}_toggleBtn" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="collapse" data-bs-target="#${_divId} #sancDiv" aria-expanded="true"></button>
                </div>
            </div>
        `,
        SANC_LINE_HEADER_TEXT: `
            <div class="sm-header both mt-3">
                <div class="sm-header-text">결재선</div>
            </div>
        `,
        SANC_LINE_DIV_HTML: `
            <div id="sancDiv" class="collapse show" style="margin-top: -35px;"></div>
        `,
        SANC_LINE_TABLE_HTML: `
            <table class="tbl-list">
                <colgroup>
                    <col style="width: 10%;">
                    <col style="width: 10%;">
                    <col style="width: 10%;">
                    <col style="width: 10%;">
                    <col style="width: 15%;">
                    <col>
                </colgroup>
                <thead>
                    <tr>
                        <th>구분</th>
                        <th>성명</th>
                        <th>직위</th>
                        <th>승인상태</th>
                        <th>날짜</th>
                        <th>결재의견</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        `,
        SANC_REF_HEADER_HTML: `
            <div class="sm-header both mt-3">
                <div class="sm-header-text">참조자</div>
            </div>
        `,
        SANC_REF_TABLE_HTML: `
            <table class="tbl-list">
                <colgroup>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                </colgroup>
                <thead>
                    <tr>
                        <th>구분</th>
                        <th>성명</th>
                        <th>직위</th>
                        <th>확인여부</th>
                        <th>날짜</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        `,
        SANC_LINE_ROW_HTML: `
            <tr>
                <td id="sancDivNm"></td>
                <td id="sancLineMgrNm"></td>
                <td id="sancLinePstnNm"></td>
                <td id="sancLineStatusNm"></td>
                <td id="exeDt"></td>
                <td id="exeCmtTt"></td>
            </tr>
        `,
        SANC_REF_ROW_HTML: `
            <tr>
                <td>참조</td>
                <td id="sancRefMgrNm"></td>
                <td id="sancRefPstnNm"></td>
                <td id="cnfrmYn"></td>
                <td id="cnfrmDt"></td>
            </tr>
        `,
        SANC_LINE_EMPTY_ROW_HTML: `
            <tr>
                <td colspan="6" class="p-0">
                    <div class="alert alert-danger text-center mb-0 rounded-0 border-0">
                        <i class="fa fa-exclamation-triangle"></i>결재 정보가 없습니다.
                    </div>
                </td>
            </tr>
        `,
        SANC_REF_EMPTY_ROW_HTML: `
            <tr>
                <td colspan="5" class="p-0">
                    <div class="alert alert-danger text-center mb-0 rounded-0 border-0">
                        <i class="fa fa-exclamation-triangle"></i>참조 정보가 없습니다.
                    </div>
                </td>
            </tr>
        `,

        MULTI_SANC_LIST_ITEM: `
            <div class="sanc-item-div">
                <div class="d-flex"> 
                    <div class="sanc-item-text-div">
                        <span id="operDivNm"     class="sanc-item-oper-text-div"></span>
                        <span id="sancReqDeptNm" class="sanc-item-oper-mgr-div" ></span>
                        <span id="sancReqMgrNm"  class="sanc-item-oper-mgr-div" ></span>
                    </div>
                    <div class="sanc-item-icon-div">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 122.88 122.88" enable-background="new 0 0 122.88 122.88" xml:space="preserve"><g><path fill="#ebebeb" d="M34.388,67.984c-0.286-0.308-0.542-0.638-0.762-0.981c-0.221-0.345-0.414-0.714-0.573-1.097 c-0.531-1.265-0.675-2.631-0.451-3.934c0.224-1.294,0.812-2.531,1.744-3.548l0.34-0.35c2.293-2.185,5.771-2.592,8.499-0.951 c0.39,0.233,0.762,0.51,1.109,0.827l0.034,0.031c1.931,1.852,5.198,4.881,7.343,6.79l1.841,1.651l22.532-23.635 c0.317-0.327,0.666-0.62,1.035-0.876c0.378-0.261,0.775-0.482,1.185-0.661c0.414-0.181,0.852-0.323,1.3-0.421 c0.447-0.099,0.903-0.155,1.356-0.165h0.026c0.451-0.005,0.893,0.027,1.341,0.103c0.437,0.074,0.876,0.193,1.333,0.369 c0.421,0.161,0.825,0.363,1.207,0.604c0.365,0.231,0.721,0.506,1.056,0.822l0.162,0.147c0.316,0.313,0.601,0.653,0.85,1.014 c0.256,0.369,0.475,0.766,0.652,1.178c0.183,0.414,0.325,0.852,0.424,1.299c0.1,0.439,0.154,0.895,0.165,1.36v0.23 c-0.004,0.399-0.042,0.804-0.114,1.204c-0.079,0.435-0.198,0.863-0.356,1.271c-0.16,0.418-0.365,0.825-0.607,1.21 c-0.238,0.377-0.518,0.739-0.832,1.07l-27.219,28.56c-0.32,0.342-0.663,0.642-1.022,0.898c-0.369,0.264-0.767,0.491-1.183,0.681 c-0.417,0.188-0.851,0.337-1.288,0.44c-0.435,0.104-0.889,0.166-1.35,0.187l-0.125,0.003c-0.423,0.009-0.84-0.016-1.241-0.078 l-0.102-0.02c-0.415-0.07-0.819-0.174-1.205-0.31c-0.421-0.15-0.833-0.343-1.226-0.575l-0.063-0.04 c-0.371-0.224-0.717-0.477-1.032-0.754l-0.063-0.06c-1.58-1.466-3.297-2.958-5.033-4.466c-3.007-2.613-7.178-6.382-9.678-9.02 L34.388,67.984L34.388,67.984z M61.44,0c16.96,0,32.328,6.883,43.453,17.987c11.104,11.125,17.986,26.493,17.986,43.453 c0,16.961-6.883,32.329-17.986,43.454C93.769,115.998,78.4,122.88,61.44,122.88c-16.961,0-32.329-6.882-43.454-17.986 C6.882,93.769,0,78.4,0,61.439C0,44.48,6.882,29.112,17.986,17.987C29.112,6.883,44.479,0,61.44,0L61.44,0z M96.899,25.981 C87.826,16.907,75.29,11.296,61.44,11.296c-13.851,0-26.387,5.611-35.46,14.685c-9.073,9.073-14.684,21.609-14.684,35.458 c0,13.851,5.611,26.387,14.684,35.46s21.609,14.685,35.46,14.685c13.85,0,26.386-5.611,35.459-14.685s14.684-21.609,14.684-35.46 C111.583,47.59,105.973,35.054,96.899,25.981L96.899,25.981z"/></g></svg>
                    </div>
                </div>
            </div>
        `,

        SVG: {
            REQUEST: `
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; overflow: visible; fill: rgb(65, 75, 95);" viewBox="0 0 512 512">
                    <path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"/>
                </svg>
            `,

            APPROVE: `
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; overflow: visible; fill: rgb(65, 75, 95);" viewBox="0 0 512 512">
                    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>
                </svg>
            `,

            DENY: `
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; overflow: visible; fill: rgb(65, 75, 95);" viewBox="0 0 512 512">
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"/>
                </svg>
            `,

            READY: `
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; overflow: visible; fill: rgb(65, 75, 95);" viewBox="0 0 512 512">
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z"/>
                </svg>
            `,

            PENDING: `
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; overflow: visible; fill: rgb(65, 75, 95);" viewBox="0 0 512 512">
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-16 328c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160zm112 0c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160z"/>
                </svg>
            `,

            ROLLBACK: `
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; overflow: visible; fill: rgb(65, 75, 95);" viewBox="0 0 512 512">
                    <path d="M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z"/>
                </svg>
            `,

            CHECK_READY: `
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 122.88 122.88" enable-background="new 0 0 122.88 122.88" xml:space="preserve">
                    <g>
                        <path fill="#6BBE66" d="M34.388,67.984c-0.286-0.308-0.542-0.638-0.762-0.981c-0.221-0.345-0.414-0.714-0.573-1.097 c-0.531-1.265-0.675-2.631-0.451-3.934c0.224-1.294,0.812-2.531,1.744-3.548l0.34-0.35c2.293-2.185,5.771-2.592,8.499-0.951 c0.39,0.233,0.762,0.51,1.109,0.827l0.034,0.031c1.931,1.852,5.198,4.881,7.343,6.79l1.841,1.651l22.532-23.635 c0.317-0.327,0.666-0.62,1.035-0.876c0.378-0.261,0.775-0.482,1.185-0.661c0.414-0.181,0.852-0.323,1.3-0.421 c0.447-0.099,0.903-0.155,1.356-0.165h0.026c0.451-0.005,0.893,0.027,1.341,0.103c0.437,0.074,0.876,0.193,1.333,0.369 c0.421,0.161,0.825,0.363,1.207,0.604c0.365,0.231,0.721,0.506,1.056,0.822l0.162,0.147c0.316,0.313,0.601,0.653,0.85,1.014 c0.256,0.369,0.475,0.766,0.652,1.178c0.183,0.414,0.325,0.852,0.424,1.299c0.1,0.439,0.154,0.895,0.165,1.36v0.23 c-0.004,0.399-0.042,0.804-0.114,1.204c-0.079,0.435-0.198,0.863-0.356,1.271c-0.16,0.418-0.365,0.825-0.607,1.21 c-0.238,0.377-0.518,0.739-0.832,1.07l-27.219,28.56c-0.32,0.342-0.663,0.642-1.022,0.898c-0.369,0.264-0.767,0.491-1.183,0.681 c-0.417,0.188-0.851,0.337-1.288,0.44c-0.435,0.104-0.889,0.166-1.35,0.187l-0.125,0.003c-0.423,0.009-0.84-0.016-1.241-0.078 l-0.102-0.02c-0.415-0.07-0.819-0.174-1.205-0.31c-0.421-0.15-0.833-0.343-1.226-0.575l-0.063-0.04 c-0.371-0.224-0.717-0.477-1.032-0.754l-0.063-0.06c-1.58-1.466-3.297-2.958-5.033-4.466c-3.007-2.613-7.178-6.382-9.678-9.02 L34.388,67.984L34.388,67.984z M61.44,0c16.96,0,32.328,6.883,43.453,17.987c11.104,11.125,17.986,26.493,17.986,43.453 c0,16.961-6.883,32.329-17.986,43.454C93.769,115.998,78.4,122.88,61.44,122.88c-16.961,0-32.329-6.882-43.454-17.986 C6.882,93.769,0,78.4,0,61.439C0,44.48,6.882,29.112,17.986,17.987C29.112,6.883,44.479,0,61.44,0L61.44,0z M96.899,25.981 C87.826,16.907,75.29,11.296,61.44,11.296c-13.851,0-26.387,5.611-35.46,14.685c-9.073,9.073-14.684,21.609-14.684,35.458 c0,13.851,5.611,26.387,14.684,35.46s21.609,14.685,35.46,14.685c13.85,0,26.386-5.611,35.459-14.685s14.684-21.609,14.684-35.46 C111.583,47.59,105.973,35.054,96.899,25.981L96.899,25.981z"/>
                    </g>
                </svg>
            `,

            CHECK_DONE: `
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 122.88 122.88" enable-background="new 0 0 122.88 122.88" xml:space="preserve">
                    <g>
                        <path fill="#efefef" d="M34.388,67.984c-0.286-0.308-0.542-0.638-0.762-0.981c-0.221-0.345-0.414-0.714-0.573-1.097 c-0.531-1.265-0.675-2.631-0.451-3.934c0.224-1.294,0.812-2.531,1.744-3.548l0.34-0.35c2.293-2.185,5.771-2.592,8.499-0.951 c0.39,0.233,0.762,0.51,1.109,0.827l0.034,0.031c1.931,1.852,5.198,4.881,7.343,6.79l1.841,1.651l22.532-23.635 c0.317-0.327,0.666-0.62,1.035-0.876c0.378-0.261,0.775-0.482,1.185-0.661c0.414-0.181,0.852-0.323,1.3-0.421 c0.447-0.099,0.903-0.155,1.356-0.165h0.026c0.451-0.005,0.893,0.027,1.341,0.103c0.437,0.074,0.876,0.193,1.333,0.369 c0.421,0.161,0.825,0.363,1.207,0.604c0.365,0.231,0.721,0.506,1.056,0.822l0.162,0.147c0.316,0.313,0.601,0.653,0.85,1.014 c0.256,0.369,0.475,0.766,0.652,1.178c0.183,0.414,0.325,0.852,0.424,1.299c0.1,0.439,0.154,0.895,0.165,1.36v0.23 c-0.004,0.399-0.042,0.804-0.114,1.204c-0.079,0.435-0.198,0.863-0.356,1.271c-0.16,0.418-0.365,0.825-0.607,1.21 c-0.238,0.377-0.518,0.739-0.832,1.07l-27.219,28.56c-0.32,0.342-0.663,0.642-1.022,0.898c-0.369,0.264-0.767,0.491-1.183,0.681 c-0.417,0.188-0.851,0.337-1.288,0.44c-0.435,0.104-0.889,0.166-1.35,0.187l-0.125,0.003c-0.423,0.009-0.84-0.016-1.241-0.078 l-0.102-0.02c-0.415-0.07-0.819-0.174-1.205-0.31c-0.421-0.15-0.833-0.343-1.226-0.575l-0.063-0.04 c-0.371-0.224-0.717-0.477-1.032-0.754l-0.063-0.06c-1.58-1.466-3.297-2.958-5.033-4.466c-3.007-2.613-7.178-6.382-9.678-9.02 L34.388,67.984L34.388,67.984z M61.44,0c16.96,0,32.328,6.883,43.453,17.987c11.104,11.125,17.986,26.493,17.986,43.453 c0,16.961-6.883,32.329-17.986,43.454C93.769,115.998,78.4,122.88,61.44,122.88c-16.961,0-32.329-6.882-43.454-17.986 C6.882,93.769,0,78.4,0,61.439C0,44.48,6.882,29.112,17.986,17.987C29.112,6.883,44.479,0,61.44,0L61.44,0z M96.899,25.981 C87.826,16.907,75.29,11.296,61.44,11.296c-13.851,0-26.387,5.611-35.46,14.685c-9.073,9.073-14.684,21.609-14.684,35.458 c0,13.851,5.611,26.387,14.684,35.46s21.609,14.685,35.46,14.685c13.85,0,26.386-5.611,35.459-14.685s14.684-21.609,14.684-35.46 C111.583,47.59,105.973,35.054,96.899,25.981L96.899,25.981z"/>
                    </g>
                </svg>
            `,

            CHECK_DENY : `
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 122.879 122.879" enable-background="new 0 0 122.879 122.879" xml:space="preserve">
                    <g>
                        <path fill="#efefef" fill-rule="evenodd" clip-rule="evenodd" d="M61.44,0c33.933,0,61.439,27.507,61.439,61.439 s-27.506,61.439-61.439,61.439C27.507,122.879,0,95.372,0,61.439S27.507,0,61.44,0L61.44,0z M73.451,39.151 c2.75-2.793,7.221-2.805,9.986-0.027c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.076,12.249 c2.729,2.77,2.689,7.257-0.08,10.022c-2.773,2.765-7.23,2.758-9.955-0.013L61.446,71.54L49.428,83.728 c-2.75,2.793-7.22,2.805-9.986,0.027c-2.763-2.776-2.776-7.293-0.027-10.084L51.48,61.434L39.403,49.185 c-2.728-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.953,0.013l11.997,12.165L73.451,39.151L73.451,39.151z"/>
                    </g>
                </svg>
            `,

            FIREWORK: `
                <svg width="34" height="34" viewBox="0 0 122.88 95.57" class="firework-svg">
                    <defs>
                        <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stop-color="#fa709a"/>
                        <stop offset="100%" stop-color="#fee140"/>
                        </linearGradient>
                    </defs>
                    <path class="st0" fill="url(#fireGradient)"
                        d="M30.45,57.96h-0.93c0-7.62-2.85-14.28-8.54-19.97c-5.69-5.69-12.35-8.54-19.97-8.54v-0.93
                        c7.62,0,14.28-2.85,19.97-8.55C26.67,14.25,29.52,7.59,29.52,0h0.93c0,7.62,2.85,14.28,8.54,19.97c5.69,5.69,12.35,8.54,19.97,8.54
                        v0.93c-7.62,0-14.28,2.85-19.97,8.54C33.3,43.68,30.45,50.34,30.45,57.96L30.45,57.96z M13.51,92.85h-0.43
                        c0-3.49-1.31-6.55-3.92-9.16C6.55,81.08,3.49,79.77,0,79.77v-0.43c3.49,0,6.55-1.31,9.16-3.92c2.61-2.62,3.92-5.67,3.92-9.15h0.43
                        c0,3.49,1.31,6.55,3.92,9.16c2.61,2.61,5.66,3.92,9.16,3.92v0.43c-3.49,0-6.55,1.31-9.16,3.92C14.81,86.3,13.51,89.36,13.51,92.85
                        L13.51,92.85z M68.37,95.57h-0.43c0-3.49-1.31-6.55-3.92-9.16c-2.61-2.61-5.66-3.92-9.16-3.92v-0.43c3.49,0,6.55-1.31,9.16-3.92
                        c2.61-2.62,3.92-5.67,3.92-9.15h0.43c0,3.49,1.31,6.55,3.92,9.16c2.61,2.61,5.66,3.92,9.16,3.92v0.43c-3.49,0-6.55,1.31-9.16,3.92
                        C69.67,89.02,68.37,92.07,68.37,95.57L68.37,95.57z M98.95,64.57h-0.78c0-6.39-2.39-11.98-7.17-16.76
                        c-4.78-4.78-10.36-7.17-16.76-7.17v-0.78c6.39,0,11.98-2.39,16.76-7.18c4.78-4.79,7.17-10.38,7.17-16.75h0.78
                        c0,6.39,2.39,11.98,7.17,16.76c4.78,4.78,10.36,7.17,16.76,7.17v0.78c-6.39,0-11.98,2.39-16.76,7.17
                        C101.34,52.59,98.95,58.18,98.95,64.57L98.95,64.57z"></path>
                    </g>
                </svg>
            `,

        }
    });


    (function() {
        class LoadingSpinner extends HTMLElement {
            connectedCallback() {
            this.innerHTML = `
                <svg class="border-spinner" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="fadeGradient">
                    <stop offset="0%" stop-color="#6BBE66"/>
                    <stop offset="100%" stop-color="#6BBE66" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45"></circle>
                </svg>
            `;
            }
        }
        class ExecuteBtnArrow extends HTMLElement {
            connectedCallback() {
            this.innerHTML = `
                <svg version="1.1" class="exec-icon" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 92.2 122.88"
                    style="enable-background:new 0 0 92.2 122.88" xml:space="preserve" >
                    <style type="text/css">
                        .st0 {
                            fill-rule: evenodd;
                            clip-rule: evenodd;
                        }
                    </style>
                    <g>
                        <polygon class="st0" points="92.2,60.97 0,122.88 0,0 92.2,60.97" />
                    </g>
                </svg>
            `;
            }
        }
        
        class MulitSancHeaderIcon extends HTMLElement {
            connectedCallback() {
            this.innerHTML = `
                <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 119.86">
                    <path
                        d="M20.72,72a3,3,0,0,1-2.84-3.1,3,3,0,0,1,2.84-3.1H57.47a3,3,0,0,1,2.84,3.1A3,3,0,0,1,57.47,72ZM83.08,95.75c-1-1.53-2.77-3.62-2.77-5.42a2.92,2.92,0,0,1,1.94-2.64c-.09-1.51-.15-3.06-.15-4.59,0-.9,0-1.82.05-2.72A6.52,6.52,0,0,1,82.46,79a9.7,9.7,0,0,1,4.32-5.48,12.28,12.28,0,0,1,2.34-1.12c1.48-.54.76-2.88,2.39-2.91,3.79-.1,10,3.22,12.47,5.86a8.84,8.84,0,0,1,2.49,5.93L106.32,88a2.17,2.17,0,0,1,1.59,1.37c.52,2.1-1.66,4.71-2.67,6.38s-4.5,5.74-4.51,5.78a1.39,1.39,0,0,0,.32.77c5.54,7.62,21.83,1.74,21.83,16.89H65.33c0-15.16,16.29-9.27,21.82-16.89a1.68,1.68,0,0,0,.4-.79c0-.1-4.1-5.12-4.47-5.71Zm8-76.89h10.18A7.16,7.16,0,0,1,106.39,21a7.26,7.26,0,0,1,2.13,5.13V61.9l-6.27-2.46V26.13a1,1,0,0,0-1-1H91V57.88l-6.24,2.46V7.27a1,1,0,0,0-1-1H7.24a1,1,0,0,0-1,1V93.72a1,1,0,0,0,1,1H64.42L62,101H23.66v11.6a1,1,0,0,0,1,1H56.37l-2.46,6.24H24.73a7.31,7.31,0,0,1-7.27-7.28V101H7.27A7.31,7.31,0,0,1,0,93.72V7.27A7.16,7.16,0,0,1,2.14,2.14,7.23,7.23,0,0,1,7.27,0H83.79a7.18,7.18,0,0,1,5.14,2.14,7.27,7.27,0,0,1,2.14,5.13V18.86Zm-70.38,10a3,3,0,0,1-2.85-3.1,3,3,0,0,1,2.85-3.1H69.77a3,3,0,0,1,2.84,3.1,3,3,0,0,1-2.84,3.1Zm0,21.57a3,3,0,0,1-2.85-3.1,3,3,0,0,1,2.85-3.1H69.77a3,3,0,0,1,2.84,3.1,3,3,0,0,1-2.84,3.1Z" />
                </svg>
            `;
            }
        }
        
        // 브라우저에 새로운 커스텀 요소 등록
        customElements.define('loading-spinner', LoadingSpinner);
        customElements.define('execute-btn-arrow', ExecuteBtnArrow);
        customElements.define('multi-sanc-header-icon', MulitSancHeaderIcon);
    })();
